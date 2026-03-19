import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'

const displayFont = { fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase' }

export default function Profile() {
  const { user, setUser, logout } = useApp()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ ...user })

  function calcTMB() {
    const w = parseFloat(user.weight)
    const h = parseFloat(user.height)
    const a = parseInt(user.age)
    if (user.sex === 'M') return Math.round(88.36 + 13.4 * w + 4.8 * h - 5.7 * a)
    return Math.round(447.6 + 9.2 * w + 3.1 * h - 4.3 * a)
  }

  function calcTDEE() {
    return Math.round(calcTMB() * 1.55)
  }

  async function handleSave() {
    setSaving(true)
    const tdee = calcTDEE()
    let kcalGoal = tdee
    if (form.goal === 'loss') kcalGoal = tdee - 500
    if (form.goal === 'gain') kcalGoal = tdee + 300

    const updatedUser = { ...form, kcalGoal }

    // Atualiza no Supabase
    const { error } = await supabase.from('profiles').update({
      name: form.name,
      age: parseInt(form.age),
      sex: form.sex,
      weight: parseFloat(form.weight),
      height: parseFloat(form.height),
      goal: form.goal,
      activity: parseFloat(form.activity),
      kcal_goal: kcalGoal,
    }).eq('id', user.id)

    if (!error) {
      setUser(updatedUser)
      setEditing(false)
    }

    setSaving(false)
  }

  const goalLabels = { loss: 'Emagrecer', gain: 'Ganhar massa', maint: 'Manter peso' }

  const inputStyle = {
    background: 'transparent',
    borderBottom: '1px solid #3A3A3A',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderRadius: 0,
    color: 'white',
    padding: '10px 0',
    width: '100%',
    outline: 'none',
    fontSize: '1rem',
  }

  return (
    <div className="pb-24">

      <div className="px-5 pt-8 pb-4 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Suas informações</p>
          <h1 style={{ ...displayFont, fontSize: '2.2rem', fontWeight: 900, color: 'white', lineHeight: 1.1 }}>
            Perfil.
          </h1>
        </div>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          disabled={saving}
          className="px-4 py-2 rounded-full text-white font-bold"
          style={{ background: editing ? 'linear-gradient(135deg, #7C3AED, #5B21B6)' : '#1A1A1A', border: editing ? 'none' : '1px solid #2A2A2A', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}
        >
          {saving ? 'Salvando...' : editing ? 'Salvar' : 'Editar'}
        </button>
      </div>

      {/* Avatar */}
      <div className="mx-5 rounded-2xl p-5 mb-4 flex items-center gap-4" style={{ background: '#1A1A1A' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.8rem' }}>
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <p style={{ ...displayFont, fontSize: '1.4rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>{user.name}</p>
          <p style={{ ...displayFont, fontSize: '0.75rem', color: '#A78BFA', letterSpacing: '0.05em', marginTop: '4px' }}>
            {goalLabels[user.goal]}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-5 grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'TMB', value: calcTMB(), unit: 'kcal' },
          { label: 'TDEE', value: calcTDEE(), unit: 'kcal' },
          { label: 'Meta', value: user.kcalGoal, unit: 'kcal' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-3 text-center"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
            <p style={{ ...displayFont, fontSize: '1.3rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>{s.value}</p>
            <p style={{ ...displayFont, fontSize: '0.6rem', color: '#DDD6FE', letterSpacing: '0.05em', marginTop: '2px' }}>{s.unit}</p>
            <p style={{ ...displayFont, fontSize: '0.6rem', color: '#C4B5FD', letterSpacing: '0.08em', marginTop: '2px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {editing ? (
        <div className="mx-5 rounded-2xl p-5 mb-4" style={{ background: '#1A1A1A' }}>
          <div className="flex flex-col gap-5">
            <div>
              <p style={{ ...displayFont, fontSize: '0.7rem', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '4px' }}>Nome</p>
              <input style={inputStyle} value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p style={{ ...displayFont, fontSize: '0.7rem', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '4px' }}>Idade</p>
                <input type="number" style={inputStyle} value={form.age}
                  onChange={e => setForm(p => ({ ...p, age: e.target.value }))} />
              </div>
              <div>
                <p style={{ ...displayFont, fontSize: '0.7rem', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '4px' }}>Sexo</p>
                <select style={inputStyle} value={form.sex}
                  onChange={e => setForm(p => ({ ...p, sex: e.target.value }))}>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>
              <div>
                <p style={{ ...displayFont, fontSize: '0.7rem', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '4px' }}>Peso (kg)</p>
                <input type="number" style={inputStyle} value={form.weight}
                  onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} />
              </div>
              <div>
                <p style={{ ...displayFont, fontSize: '0.7rem', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '4px' }}>Altura (cm)</p>
                <input type="number" style={inputStyle} value={form.height}
                  onChange={e => setForm(p => ({ ...p, height: e.target.value }))} />
              </div>
            </div>
            <div>
              <p style={{ ...displayFont, fontSize: '0.7rem', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '8px' }}>Objetivo</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'loss', label: 'Emagrecer' },
                  { value: 'gain', label: 'Ganhar' },
                  { value: 'maint', label: 'Manter' },
                ].map(g => (
                  <button key={g.value}
                    onClick={() => setForm(p => ({ ...p, goal: g.value }))}
                    className="py-2 rounded-full font-black transition-all"
                    style={{
                      background: form.goal === g.value ? '#7C3AED' : '#2A2A2A',
                      color: form.goal === g.value ? 'white' : '#6B7280',
                      fontFamily: 'Barlow Condensed, sans-serif',
                      fontSize: '0.8rem',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase'
                    }}>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-5 rounded-2xl p-5 mb-4" style={{ background: '#1A1A1A' }}>
          <div className="grid grid-cols-2 gap-5">
            {[
              { label: 'Idade', value: `${user.age} anos` },
              { label: 'Sexo', value: user.sex === 'M' ? 'Masculino' : 'Feminino' },
              { label: 'Peso', value: `${user.weight} kg` },
              { label: 'Altura', value: `${user.height} cm` },
            ].map(item => (
              <div key={item.label}>
                <p style={{ ...displayFont, fontSize: '0.65rem', color: '#6B7280', letterSpacing: '0.1em' }}>{item.label}</p>
                <p style={{ ...displayFont, fontSize: '1.3rem', fontWeight: 800, color: 'white', marginTop: '2px' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mx-5">
        <button
          onClick={() => {
            if (window.confirm('Tem certeza que quer sair da conta?')) logout()
          }}
          className="w-full py-4 rounded-full text-white font-bold uppercase"
          style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.08em', fontSize: '0.95rem' }}
        >
          Sair da conta
        </button>
      </div>

    </div>
  )
}