import { useState } from 'react'
import { useApp } from '../context/AppContext'

const displayFont = { fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase' }

const FIELDS = [
  { key: 'weight', label: 'Peso', unit: 'kg' },
  { key: 'waist', label: 'Cintura', unit: 'cm' },
  { key: 'arm', label: 'Braço', unit: 'cm' },
  { key: 'chest', label: 'Peito', unit: 'cm' },
  { key: 'leg', label: 'Perna', unit: 'cm' },
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

  const weightHistory = measures.slice(-6)
  const maxW = Math.max(...weightHistory.map(w => w.weight), 1)
  const minW = Math.min(...weightHistory.map(w => w.weight), 0)
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

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
          <p className="text-gray-500 text-xs uppercase tracking-widest">Acompanhe sua</p>
          <h1 style={{ ...displayFont, fontSize: '2.2rem', fontWeight: 900, color: 'white', lineHeight: 1.1 }}>
            Evolução.
          </h1>
        </div>
        <button onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-full text-white font-bold"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          + Registrar
        </button>
      </div>

      {/* Gráfico de peso */}
      {weightHistory.length > 1 && (
        <div className="mx-5 rounded-2xl p-5 mb-5"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p style={{ ...displayFont, fontSize: '0.7rem', color: '#DDD6FE', letterSpacing: '0.1em' }}>Peso atual</p>
              <p style={{ ...displayFont, fontSize: '2rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                {latest.weight} <span style={{ fontSize: '1rem', fontWeight: 400 }}>kg</span>
              </p>
            </div>
            <div className="text-right">
              <p style={{ ...displayFont, fontSize: '0.7rem', color: '#DDD6FE', letterSpacing: '0.1em' }}>Peso inicial</p>
              <p style={{ ...displayFont, fontSize: '2rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                {measures[0]?.weight} <span style={{ fontSize: '1rem', fontWeight: 400 }}>kg</span>
              </p>
            </div>
          </div>

          <div style={{ position: 'relative', height: '80px' }}>
            <svg width="100%" height="80" preserveAspectRatio="none"
              viewBox={`0 0 ${Math.max(weightHistory.length * 50, 100)} 80`}>
              <polyline
                points={weightHistory.map((w, i) => {
                  const x = i * 50 + 25
                  const y = 70 - ((w.weight - minW) / (maxW - minW + 1)) * 60
                  return `${x},${y}`
                }).join(' ')}
                fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
              />
              {weightHistory.map((w, i) => {
                const x = i * 50 + 25
                const y = 70 - ((w.weight - minW) / (maxW - minW + 1)) * 60
                return <circle key={i} cx={x} cy={y} r="5" fill="white" />
              })}
            </svg>
          </div>

          <div className="flex justify-between mt-2">
            {weightHistory.map((w, i) => (
              <p key={i} style={{ ...displayFont, fontSize: '0.6rem', color: '#DDD6FE', letterSpacing: '0.05em' }}>
                {months[new Date(w.date).getMonth()]}
              </p>
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
              <p style={{ ...displayFont, fontSize: '0.65rem', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '6px' }}>
                {f.label}
              </p>
              <p style={{ ...displayFont, fontSize: '1.8rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                {val || '—'} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: '#6B7280' }}>{val ? f.unit : ''}</span>
              </p>
              {delta && (
                <p style={{ ...displayFont, fontSize: '0.7rem', fontWeight: 700, marginTop: '4px', color: parseFloat(delta) < 0 ? '#34D399' : '#F87171' }}>
                  {parseFloat(delta) > 0 ? '+' : ''}{delta} {f.unit}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {measures.length === 0 && (
        <div className="mx-5 rounded-2xl p-8 text-center" style={{ background: '#1A1A1A' }}>
          <p style={{ ...displayFont, fontSize: '1rem', color: '#6B7280', letterSpacing: '0.05em' }}>
            Nenhuma medida registrada
          </p>
          <p className="text-gray-600 text-xs mt-1">Clique em Registrar para começar</p>
        </div>
      )}

      {/* Modal de registro */}
      {showForm && (
        <div className="fixed inset-0 flex items-end z-50" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="w-full max-w-md mx-auto rounded-t-3xl p-6" style={{ background: '#111' }}>
            <h2 style={{ ...displayFont, fontSize: '1.5rem', fontWeight: 900, color: 'white', marginBottom: '1.5rem' }}>
              Registrar Medidas
            </h2>
            <div className="flex flex-col gap-4 mb-6">
              {FIELDS.map(f => (
                <div key={f.key} className="flex items-center justify-between">
                  <label style={{ ...displayFont, fontSize: '0.8rem', color: '#6B7280', letterSpacing: '0.08em' }}>
                    {f.label} ({f.unit})
                  </label>
                  <input type="number"
                    placeholder={latest[f.key] || '0'}
                    value={form[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ ...inputStyle, width: '80px', textAlign: 'right', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-full text-white font-bold uppercase"
                style={{ background: '#2A2A2A', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.05em' }}>
                Cancelar
              </button>
              <button onClick={handleSave}
                className="flex-1 py-3 rounded-full text-white font-black uppercase"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.05em' }}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}