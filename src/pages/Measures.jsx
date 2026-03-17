import { useState } from 'react'
import { useApp } from '../context/AppContext'

const FIELDS = [
  { key: 'weight', label: 'Peso', icon: '⚖️', unit: 'kg' },
  { key: 'waist', label: 'Cintura', icon: '📏', unit: 'cm' },
  { key: 'arm', label: 'Braço', icon: '💪', unit: 'cm' },
  { key: 'chest', label: 'Peito', icon: '🫁', unit: 'cm' },
  { key: 'leg', label: 'Perna', icon: '🦵', unit: 'cm' },
]

export default function Measures() {
  const { measures, addMeasure } = useApp()
  const latest = measures[measures.length - 1] || {}
  const prev = measures[measures.length - 2] || {}
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ weight: '', waist: '', arm: '', chest: '', leg: '' })

  function handleSave() {
    const entry = {}
    FIELDS.forEach(f => entry[f.key] = parseFloat(form[f.key]) || latest[f.key] || 0)
    addMeasure(entry)
    setShowForm(false)
    setForm({ weight: '', waist: '', arm: '', chest: '', leg: '' })
  }

  const weightHistory = measures.slice(-6).map((m, i) => ({
    val: m.weight,
    label: ['Jan','Fev','Mar','Abr','Mai','Jun'][i] || `M${i+1}`
  }))
  const maxW = Math.max(...weightHistory.map(w => w.val), 1)
  const minW = Math.min(...weightHistory.map(w => w.val), 0)

  return (
    <div className="pb-24">

      <div className="px-5 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-black">Medidas.</h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe sua evolução</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
        >
          + Registrar
        </button>
      </div>

      {/* Gráfico de peso */}
      {weightHistory.length > 1 && (
        <div className="mx-5 rounded-2xl p-4 mb-5" style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-purple-200 text-xs">Peso atual</p>
              <p className="text-white font-black text-2xl">{latest.weight} kg</p>
            </div>
            <div className="text-right">
              <p className="text-purple-200 text-xs">Peso inicial</p>
              <p className="text-white font-black text-2xl">{measures[0]?.weight} kg</p>
            </div>
          </div>

          <div className="relative" style={{ height: '80px' }}>
            <svg width="100%" height="80" viewBox={`0 0 ${weightHistory.length * 50} 80`} preserveAspectRatio="none">
              <polyline
                points={weightHistory.map((w, i) => {
                  const x = i * 50 + 25
                  const y = 70 - ((w.val - minW) / (maxW - minW + 1)) * 60
                  return `${x},${y}`
                }).join(' ')}
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {weightHistory.map((w, i) => {
                const x = i * 50 + 25
                const y = 70 - ((w.val - minW) / (maxW - minW + 1)) * 60
                return <circle key={i} cx={x} cy={y} r="4" fill="white" />
              })}
            </svg>
          </div>

          <div className="flex justify-between mt-1">
            {weightHistory.map((w, i) => (
              <p key={i} className="text-purple-200 text-xs">{w.label}</p>
            ))}
          </div>
        </div>
      )}

      {/* Cards de medidas */}
      <div className="px-5 grid grid-cols-2 gap-3 mb-4">
        {FIELDS.map(f => {
          const val = latest[f.key]
          const pv = prev[f.key]
          const delta = val && pv ? (val - pv).toFixed(1) : null

          return (
            <div key={f.key} className="rounded-2xl p-4" style={{ background: '#1A1A1A' }}>
              <p className="text-2xl mb-2">{f.icon}</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">{f.label}</p>
              <p className="text-white text-2xl font-black mt-1">
                {val || '—'} <span className="text-gray-500 text-sm font-normal">{val ? f.unit : ''}</span>
              </p>
              {delta && (
                <p className={`text-xs mt-1 font-bold ${parseFloat(delta) < 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {parseFloat(delta) > 0 ? '+' : ''}{delta} {f.unit}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {measures.length === 0 && (
        <div className="mx-5 rounded-2xl p-6 text-center" style={{ background: '#1A1A1A' }}>
          <p className="text-4xl mb-3">📏</p>
          <p className="text-gray-500 text-sm">Nenhuma medida registrada</p>
          <p className="text-gray-600 text-xs mt-1">Clique em "+ Registrar" para começar</p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-end z-50" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-md mx-auto rounded-t-3xl p-6" style={{ background: '#1A1A1A' }}>
            <h2 className="text-white font-black text-xl mb-4">Registrar medidas</h2>
            <div className="flex flex-col gap-3 mb-4">
              {FIELDS.map(f => (
                <div key={f.key} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: '#111' }}>
                  <label className="text-gray-400 text-sm">{f.icon} {f.label} ({f.unit})</label>
                  <input
                    type="number"
                    placeholder={latest[f.key] || '0'}
                    value={form[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="bg-transparent text-white text-right w-20 outline-none font-black"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-xl text-white font-bold" style={{ background: '#2A2A2A' }}>
                Cancelar
              </button>
              <button onClick={handleSave}
                className="flex-1 py-3 rounded-xl text-white font-black"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}