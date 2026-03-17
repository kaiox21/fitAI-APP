import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Profile() {
  const { user, setUser } = useApp()
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
    const tmb = calcTMB()
    const tdee = calcTDEE()
    let kcalGoal = tdee
    if (form.goal === 'loss') kcalGoal = tdee - 500
    if (form.goal === 'gain') kcalGoal = tdee + 300
    setUser({ ...form, kcalGoal })
    setEditing(false)
  }

  const goalLabels = { loss: '📉 Emagrecer', gain: '💪 Ganhar massa', maint: '⚖️ Manter peso' }

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-xl font-bold">Perfil</h1>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          className="bg-green-400 text-black text-sm font-bold px-4 py-2 rounded-xl"
        >
          {editing ? 'Salvar' : 'Editar'}
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-green-400 flex items-center justify-center text-black text-2xl font-bold flex-shrink-0">
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <p className="text-white text-lg font-bold">{user.name}</p>
          <p className="text-green-400 text-sm">{goalLabels[user.goal]}</p>
        </div>
      </div>

      {editing ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4 flex flex-col gap-3">
          <div>
            <p className="text-gray-400 text-xs mb-1">Nome</p>
            <input
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-gray-400 text-xs mb-1">Idade</p>
              <input type="number" className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none"
                value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} />
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Sexo</p>
              <select className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none"
                value={form.sex} onChange={e => setForm(p => ({ ...p, sex: e.target.value }))}>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Peso (kg)</p>
              <input type="number" className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none"
                value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} />
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Altura (cm)</p>
              <input type="number" className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none"
                value={form.height} onChange={e => setForm(p => ({ ...p, height: e.target.value }))} />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-2">Objetivo</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'loss', label: '📉 Emagrecer' },
                { value: 'gain', label: '💪 Ganhar massa' },
                { value: 'maint', label: '⚖️ Manter' },
              ].map(g => (
                <button
                  key={g.value}
                  onClick={() => setForm(p => ({ ...p, goal: g.value }))}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    form.goal === g.value
                      ? 'bg-green-400 text-black'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Idade', value: `${user.age} anos` },
              { label: 'Sexo', value: user.sex === 'M' ? 'Masculino' : 'Feminino' },
              { label: 'Peso', value: `${user.weight} kg` },
              { label: 'Altura', value: `${user.height} cm` },
              { label: 'TMB', value: `${calcTMB()} kcal` },
              { label: 'Meta diária', value: `${user.kcalGoal} kcal` },
            ].map(item => (
              <div key={item.label}>
                <p className="text-gray-400 text-xs">{item.label}</p>
                <p className="text-white font-bold mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}