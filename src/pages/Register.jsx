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
    background: '#1A1A1A',
    border: '1px solid #2A2A2A',
  }

  return (
    <div className="min-h-screen flex flex-col px-6 pt-12 pb-8" style={{ background: '#0F0F0F' }}>

      <button onClick={() => step === 0 ? navigate('/') : setStep(s => s - 1)}
        className="text-gray-500 text-sm mb-6">
        Voltar
      </button>

      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all"
            style={{ background: i <= step ? 'linear-gradient(90deg, #7C3AED, #A78BFA)' : '#2A2A2A' }} />
        ))}
      </div>

      <p className="text-gray-500 text-sm mb-1">Passo {step + 1} de {STEPS.length}</p>
      <h1 className="text-white text-3xl font-black mb-8">{STEPS[step]}.</h1>

      {step === 0 && (
        <div className="flex flex-col gap-4 flex-1">
          <div>
            <p className="text-gray-500 text-xs mb-2">Nome completo</p>
            <input className="w-full rounded-2xl px-4 py-4 outline-none text-white font-bold"
              style={inputStyle} placeholder="Seu nome"
              value={form.name} onChange={e => update('name', e.target.value)} />
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-2">Email</p>
            <input type="email" className="w-full rounded-2xl px-4 py-4 outline-none text-white font-bold"
              style={inputStyle} placeholder="seu@email.com"
              value={form.email} onChange={e => update('email', e.target.value)} />
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-2">Senha</p>
            <input type="password" className="w-full rounded-2xl px-4 py-4 outline-none text-white font-bold"
              style={inputStyle} placeholder="senha"
              value={form.password} onChange={e => update('password', e.target.value)} />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-4 flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-gray-500 text-xs mb-2">Idade</p>
              <input type="number" className="w-full rounded-2xl px-4 py-4 outline-none text-white font-bold"
                style={inputStyle} placeholder="25"
                value={form.age} onChange={e => update('age', e.target.value)} />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-2">Sexo</p>
              <div className="grid grid-cols-2 gap-2">
                {[{ value: 'M', label: 'Masc' }, { value: 'F', label: 'Fem' }].map(s => (
                  <button key={s.value} onClick={() => update('sex', s.value)}
                    className="py-4 rounded-2xl text-sm font-black transition-all"
                    style={{
                      background: form.sex === s.value ? 'linear-gradient(135deg, #7C3AED, #5B21B6)' : '#1A1A1A',
                      border: '1px solid #2A2A2A',
                      color: form.sex === s.value ? 'white' : '#6B7280'
                    }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-2">Peso (kg)</p>
            <input type="number" className="w-full rounded-2xl px-4 py-4 outline-none text-white font-bold"
              style={inputStyle} placeholder="70"
              value={form.weight} onChange={e => update('weight', e.target.value)} />
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-2">Altura (cm)</p>
            <input type="number" className="w-full rounded-2xl px-4 py-4 outline-none text-white font-bold"
              style={inputStyle} placeholder="170"
              value={form.height} onChange={e => update('height', e.target.value)} />
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-2">Nível de atividade</p>
            <select className="w-full rounded-2xl px-4 py-4 outline-none text-white font-bold"
              style={inputStyle}
              value={form.activity} onChange={e => update('activity', e.target.value)}>
              <option value="1.2">Sedentário (sem exercício)</option>
              <option value="1.375">Leve (1 a 3x por semana)</option>
              <option value="1.55">Moderado (3 a 5x por semana)</option>
              <option value="1.725">Intenso (6 a 7x por semana)</option>
            </select>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4 flex-1">
          {[
            { value: 'loss', icon: '📉', title: 'Emagrecer', desc: 'Déficit de 500 kcal/dia' },
            { value: 'gain', icon: '💪', title: 'Ganhar massa', desc: 'Superávit de 300 kcal/dia' },
            { value: 'maint', icon: '⚖️', title: 'Manter peso', desc: 'Manutenção calórica' },
          ].map(g => (
            <button key={g.value} onClick={() => update('goal', g.value)}
              className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
              style={{
                background: form.goal === g.value ? 'rgba(124,58,237,0.15)' : '#1A1A1A',
                border: form.goal === g.value ? '2px solid #7C3AED' : '2px solid #2A2A2A'
              }}>
              <span className="text-3xl">{g.icon}</span>
              <div className="flex-1">
                <p className="text-white font-black">{g.title}</p>
                <p className="text-gray-500 text-xs mt-1">{g.desc}</p>
              </div>
              {form.goal === g.value && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: '#7C3AED' }}>
                  <span className="text-white text-xs font-black">✓</span>
                </div>
              )}
            </button>
          ))}

          {form.weight && form.height && form.age && (
            <div className="rounded-2xl p-4 mt-2"
              style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)' }}>
              <p className="text-purple-400 text-xs font-bold mb-1">Sua meta calórica estimada</p>
              <p className="text-white text-2xl font-black">{calcKcalGoal()} kcal/dia</p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => step < 2 ? setStep(s => s + 1) : handleFinish()}
        className="w-full py-4 rounded-2xl text-white font-black text-lg mt-6"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
      >
        {step < 2 ? 'Continuar' : 'Começar agora'}
      </button>

      {step === 0 && (
        <p className="text-center text-gray-500 text-sm mt-4">
          Já tem conta?{' '}
          <span className="text-purple-400 font-bold cursor-pointer"
            onClick={() => navigate('/login')}>
            Entrar
          </span>
        </p>
      )}

    </div>
  )
}