import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const STEPS = ['Conta', 'Corpo', 'Objetivo']

export default function Register() {
  const navigate = useNavigate()
  const { setUser } = useApp()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    age: '', weight: '', height: '', sex: 'M',
    goal: 'loss', activity: '1.55'
  })

  function update(field, value) {
    setForm(p => ({ ...p, [field]: value }))
  }

  function calcKcalGoal() {
    const w = parseFloat(form.weight)
    const h = parseFloat(form.height)
    const a = parseInt(form.age)
    let tmb = form.sex === 'M'
      ? 88.36 + 13.4 * w + 4.8 * h - 5.7 * a
      : 447.6 + 9.2 * w + 3.1 * h - 4.3 * a
    const tdee = tmb * parseFloat(form.activity)
    if (form.goal === 'loss') return Math.round(tdee - 500)
    if (form.goal === 'gain') return Math.round(tdee + 300)
    return Math.round(tdee)
  }

  function handleFinish() {
    setUser({
      name: form.name,
      email: form.email,
      age: form.age,
      weight: form.weight,
      height: form.height,
      sex: form.sex,
      goal: form.goal,
      activity: form.activity,
      kcalGoal: calcKcalGoal()
    })
    navigate('/home')
  }

  const inputStyle = {
    background: 'transparent',
    borderBottom: '1px solid #3A3A3A',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderRadius: 0,
    color: 'white',
    padding: '12px 0',
    width: '100%',
    outline: 'none',
    fontSize: '1rem',
  }

  const displayFont = { fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase' }

  return (
    <div className="min-h-screen flex flex-col px-6 pt-12 pb-8" style={{ background: '#0F0F0F' }}>

      <button onClick={() => step === 0 ? navigate('/') : setStep(s => s - 1)}
        className="text-gray-500 text-xl mb-8">←</button>

      {/* Progress */}
      <div className="flex gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all"
            style={{ background: i <= step ? '#7C3AED' : '#2A2A2A' }} />
        ))}
      </div>

      <p className="text-gray-500 text-xs mb-1 uppercase tracking-widest">Passo {step + 1} de {STEPS.length}</p>
      <h1 style={{ ...displayFont, fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '2rem' }}>
        {STEPS[step]}.
      </h1>

      {/* Step 0 */}
      {step === 0 && (
        <div className="flex flex-col gap-6 flex-1">
          <div>
            <p className="text-gray-500 text-xs mb-2 uppercase tracking-widest">Nome completo</p>
            <input style={inputStyle} placeholder="Seu nome"
              value={form.name} onChange={e => update('name', e.target.value)} />
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-2 uppercase tracking-widest">Email</p>
            <input type="email" style={inputStyle} placeholder="seu@email.com"
              value={form.email} onChange={e => update('email', e.target.value)} />
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-2 uppercase tracking-widest">Senha</p>
            <input type="password" style={inputStyle} placeholder="••••••••"
              value={form.password} onChange={e => update('password', e.target.value)} />
          </div>
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="flex flex-col gap-6 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-xs mb-2 uppercase tracking-widest">Idade</p>
              <input type="number" style={inputStyle} placeholder="25"
                value={form.age} onChange={e => update('age', e.target.value)} />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-2 uppercase tracking-widest">Sexo</p>
              <div className="flex gap-2 mt-2">
                {[{ value: 'M', label: 'Masc' }, { value: 'F', label: 'Fem' }].map(s => (
                  <button key={s.value} onClick={() => update('sex', s.value)}
                    className="flex-1 py-2 rounded-full text-sm font-bold uppercase"
                    style={{
                      background: form.sex === s.value ? '#7C3AED' : '#1A1A1A',
                      color: form.sex === s.value ? 'white' : '#6B7280',
                      border: '1px solid #2A2A2A',
                      fontFamily: 'Barlow Condensed, sans-serif',
                      letterSpacing: '0.05em'
                    }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-2 uppercase tracking-widest">Peso (kg)</p>
            <input type="number" style={inputStyle} placeholder="70"
              value={form.weight} onChange={e => update('weight', e.target.value)} />
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-2 uppercase tracking-widest">Altura (cm)</p>
            <input type="number" style={inputStyle} placeholder="170"
              value={form.height} onChange={e => update('height', e.target.value)} />
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-2 uppercase tracking-widest">Nível de atividade</p>
            <select style={{ ...inputStyle, appearance: 'none' }}
              value={form.activity} onChange={e => update('activity', e.target.value)}>
              <option value="1.2">Sedentário</option>
              <option value="1.375">Leve (1 a 3x por semana)</option>
              <option value="1.55">Moderado (3 a 5x por semana)</option>
              <option value="1.725">Intenso (6 a 7x por semana)</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="flex flex-col gap-4 flex-1">
          <p className="text-gray-400 text-sm mb-2">Qual é o seu objetivo?</p>
          {[
            { value: 'loss', icon: '📉', title: 'Lose Weight', desc: 'Déficit de 500 kcal/dia' },
            { value: 'gain', icon: '💪', title: 'Get Fit', desc: 'Superávit de 300 kcal/dia' },
            { value: 'maint', icon: '⚖️', title: 'Maintain', desc: 'Manutenção calórica' },
          ].map(g => (
            <button key={g.value} onClick={() => update('goal', g.value)}
              className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
              style={{
                background: form.goal === g.value ? '#7C3AED' : '#1A1A1A',
                border: form.goal === g.value ? '2px solid #7C3AED' : '2px solid #2A2A2A'
              }}>
              <span className="text-3xl">{g.icon}</span>
              <div className="flex-1">
                <p style={{ ...displayFont, fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>{g.title}</p>
                <p className="text-xs mt-1" style={{ color: form.goal === g.value ? '#DDD6FE' : '#6B7280' }}>{g.desc}</p>
              </div>
              {form.goal === g.value && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'white' }}>
                  <span className="text-purple-700 text-xs font-black">✓</span>
                </div>
              )}
            </button>
          ))}

          {form.weight && form.height && form.age && (
            <div className="rounded-2xl p-4 mt-2"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)' }}>
              <p className="text-purple-400 text-xs uppercase tracking-widest mb-1">Meta calórica estimada</p>
              <p style={{ ...displayFont, fontSize: '2rem', fontWeight: 900, color: 'white' }}>
                {calcKcalGoal()} <span className="text-purple-400 text-lg">kcal/dia</span>
              </p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => step < 2 ? setStep(s => s + 1) : handleFinish()}
        className="w-full py-4 rounded-full text-white font-bold mt-6"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
      >
        {step < 2 ? 'Continuar' : 'Começar agora'}
      </button>

      {step === 0 && (
        <p className="text-center text-gray-500 text-sm mt-4">
          Já tem conta?{' '}
          <span className="font-bold cursor-pointer" style={{ color: '#A78BFA' }}
            onClick={() => navigate('/login')}>
            Sign in
          </span>
        </p>
      )}

    </div>
  )
}