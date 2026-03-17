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

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-xl font-bold">Medidas Corporais</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-400 text-black text-sm font-bold px-4 py-2 rounded-xl"
        >
          + Registrar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {FIELDS.map(f => {
          const val = latest[f.key]
          const pv = prev[f.key]
          const delta = val && pv ? (val - pv).toFixed(1) : null

          return (
            <div key={f.key} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <p className="text-xl mb-2">{f.icon}</p>
              <p className="text-gray-400 text-xs uppercase tracking-widest">{f.label}</p>
              <p className="text-white text-2xl font-bold mt-1">
                {val || '—'} <span className="text-gray-400 text-sm">{val ? f.unit : ''}</span>
              </p>
              {delta && (
                <p className={`text-xs mt-1 font-medium ${parseFloat(delta) < 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {parseFloat(delta) > 0 ? '+' : ''}{delta} {f.unit}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {measures.length === 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
          <p className="text-4xl mb-3">📏</p>
          <p className="text-gray-400 text-sm">Nenhuma medida registrada ainda</p>
          <p className="text-gray-500 text-xs mt-1">Clique em "+ Registrar" para começar</p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end z-50">
          <div className="bg-gray-900 border-t border-gray-800 rounded-t-3xl p-6 w-full max-w-md mx-auto">
            <h2 className="text-white font-bold text-lg mb-4">Registrar medidas</h2>
            <div className="flex flex-col gap-3 mb-4">
              {FIELDS.map(f => (
                <div key={f.key} className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3">
                  <label className="text-gray-400 text-sm">{f.icon} {f.label} ({f.unit})</label>
                  <input
                    type="number"
                    placeholder={latest[f.key] || '0'}
                    value={form[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="bg-transparent text-white text-right w-20 outline-none font-bold"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 bg-gray-800 text-white font-bold rounded-xl">
                Cancelar
              </button>
              <button onClick={handleSave} className="flex-1 py-3 bg-green-400 text-black font-bold rounded-xl">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}