import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Profile() {
  const { user, setUser, logout } = useApp()
  const [editing, setEditing] = useState(false)
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

  function handleSave() {
    const tdee = calcTDEE()
    let kcalGoal = tdee
    if (form.goal === 'loss') kcalGoal = tdee - 500
    if (form.goal === 'gain') kcalGoal = tdee + 300
    setUser({ ...form, kcalGoal })
    setEditing(false)
  }

  const goalLabels = { loss: '📉 Emagrecer', gain: '💪 Ganhar massa', maint: '⚖️ Manter peso' }

  return (
    <div className="pb-24">

      <div className="px-5 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-black">Perfil.</h1>
          <p className="text-gray-500 text-sm mt-1">Suas informações</p>
        </div>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          className="px-4 py-2 rounded-xl text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
        >
          {editing ? 'Salvar' : 'Editar'}
        </button>
      </div>

      <div className="mx-5 rounded-2xl p-5 mb-4 flex items-center gap-4" style={{ background: '#1A1A1A' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}>
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <p className="text-white text-xl font-black">{user.name}</p>
          <p className="text-purple-400 text-sm mt-1">{goalLabels[user.goal]}</p>
        </div>
      </div>

      <div className="mx-5 grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'TMB', value: `${calcTMB()}`, unit: 'kcal' },
          { label: 'TDEE', value: `${calcTDEE()}`, unit: 'kcal' },
          { label: 'Meta', value: `${user.kcalGoal}`, unit: 'kcal' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-3 text-center"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
            <p className="text-white font-black text-lg">{s.value}</p>
            <p className="text-purple-200 text-xs">{s.unit}</p>
            <p className="text-purple-300 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {editing ? (
        <div className="mx-5 rounded-2xl p-5 mb-4 flex flex-col gap-3" style={{ background: '#1A1A1A' }}>
          <div>
            <p className="text-gray-500 text-xs mb-1">Nome</p>
            <input
              className="w-full rounded-xl px-4 py-3 outline-none text-white font-bold"
              style={{ background: '#111' }}
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-gray-500 text-xs mb-1">Idade</p>
              <input type="number" className="w-full rounded-xl px-4 py-3 outline-none text-white font-bold"
                style={{ background: '#111' }}
                value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Sexo</p>
              <select className="w-full rounded-xl px-4 py-3 outline-none text-white font-bold"
                style={{ background: '#111' }}
                value={form.sex} onChange={e => setForm(p => ({ ...p, sex: e.target.value }))}>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Peso (kg)</p>
              <input type="number" className="w-full rounded-xl px-4 py-3 outline-none text-white font-bold"
                style={{ background: '#111' }}
                value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Altura (cm)</p>
              <input type="number" className="w-full rounded-xl px-4 py-3 outline-none text-white font-bold"
                style={{ background: '#111' }}
                value={form.height} onChange={e => setForm(p => ({ ...p, height: e.target.value }))} />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-2">Objetivo</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'loss', label: '📉 Emagrecer' },
                { value: 'gain', label: '💪 Ganhar' },
                { value: 'maint', label: '⚖️ Manter' },
              ].map(g => (
                <button key={g.value}
                  onClick={() => setForm(p => ({ ...p, goal: g.value }))}
                  className="py-2 px-2 rounded-xl text-xs font-black transition-all"
                  style={{
                    background: form.goal === g.value ? 'linear-gradient(135deg, #7C3AED, #5B21B6)' : '#111',
                    color: form.goal === g.value ? 'white' : '#6B7280'
                  }}>
                  {g.label}
                </button>
              ))}
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
                <p className="text-gray-500 text-xs">{item.label}</p>
                <p className="text-white font-black text-lg mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mx-5 mt-4">
        <button
          onClick={() => {
            if (window.confirm('Tem certeza que quer sair da conta?')) {
              logout()
            }
          }}
          className="w-full py-4 rounded-2xl text-white font-black"
          style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
        >
          Sair da conta
        </button>
      </div>

    </div>
  )
}