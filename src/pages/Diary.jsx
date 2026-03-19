import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const displayFont = { fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase' }

const MEAL_TYPES = [
  { label: 'Café da manhã', icon: '☕' },
  { label: 'Almoço', icon: '🍽️' },
  { label: 'Jantar', icon: '🌙' },
  { label: 'Lanche', icon: '🥪' },
]

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
)

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
  </svg>
)

export default function Diary() {
  const { meals, totalKcal, user, removeMeal } = useApp()
  const navigate = useNavigate()
  const progress = Math.min((totalKcal / user.kcalGoal) * 100, 100)
  const [confirmDelete, setConfirmDelete] = useState(null)

  function handleDelete(id) {
    if (confirmDelete === id) {
      removeMeal(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  return (
    <div className="pb-24">

      <div className="px-5 pt-8 pb-4">
        <p className="text-gray-500 text-xs uppercase tracking-widest">Registro alimentar</p>
        <h1 style={{ ...displayFont, fontSize: '2.2rem', fontWeight: 900, color: 'white', lineHeight: 1.1 }}>
          Diário.
        </h1>
      </div>

      {/* Resumo calórico */}
      <div className="mx-5 rounded-2xl p-4 mb-5" style={{ background: '#1A1A1A' }}>
        <div className="flex justify-between mb-3">
          {[
            { label: 'Consumido', value: totalKcal, color: 'white' },
            { label: 'Meta', value: user.kcalGoal, color: 'white' },
            { label: 'Restante', value: Math.max(user.kcalGoal - totalKcal, 0), color: '#A78BFA' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p style={{ ...displayFont, fontSize: '1.4rem', fontWeight: 900, color: item.color }}>{item.value}</p>
              <p style={{ ...displayFont, fontSize: '0.65rem', color: '#6B7280', letterSpacing: '0.08em', marginTop: '2px' }}>{item.label}</p>
            </div>
          ))}
        </div>
        <div className="rounded-full h-1.5" style={{ background: '#2A2A2A' }}>
          <div className="h-1.5 rounded-full transition-all"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7C3AED, #A78BFA)' }} />
        </div>
      </div>

      {/* Refeições por tipo */}
      <div className="px-5">
        {MEAL_TYPES.map(type => {
          const typeMeals = meals.filter(m => m.type === type.label)
          const typeKcal = typeMeals.reduce((s, m) => s + m.kcal, 0)

          return (
            <div key={type.label} className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p style={{ ...displayFont, fontSize: '1rem', fontWeight: 800, color: 'white' }}>{type.label}</p>
                  <p style={{ ...displayFont, fontSize: '0.7rem', color: typeKcal > 0 ? '#A78BFA' : '#4B5563', letterSpacing: '0.05em' }}>
                    {typeKcal > 0 ? `${typeKcal} kcal` : 'Vazio'}
                  </p>
                </div>
                <button onClick={() => navigate('/home')}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(124,58,237,0.3)' }}>
                  <PlusIcon />
                </button>
              </div>

              {typeMeals.length > 0 && (
                <div className="rounded-2xl overflow-hidden" style={{ background: '#1A1A1A' }}>
                  {typeMeals.map(meal => (
                    <div key={meal.id} className="flex items-center justify-between p-4 border-b border-gray-800 last:border-0">
                      <div className="flex-1">
                        <p className="text-white text-sm font-bold">{meal.name}</p>
                        <p style={{ ...displayFont, fontSize: '0.65rem', color: '#6B7280', letterSpacing: '0.05em', marginTop: '2px' }}>
                          P:{meal.prot}g &nbsp; C:{meal.carb}g &nbsp; G:{meal.fat}g
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p style={{ ...displayFont, fontSize: '1rem', fontWeight: 700, color: '#A78BFA' }}>
                          {meal.kcal} kcal
                        </p>
                        <button
                          onClick={() => handleDelete(meal.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                          style={{
                            background: confirmDelete === meal.id ? 'rgba(248,113,113,0.2)' : '#2A2A2A',
                            border: confirmDelete === meal.id ? '1px solid rgba(248,113,113,0.5)' : '1px solid transparent'
                          }}>
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Aviso de confirmação */}
              {typeMeals.some(m => confirmDelete === m.id) && (
                <p style={{ ...displayFont, fontSize: '0.65rem', color: '#F87171', letterSpacing: '0.05em', marginTop: '6px', textAlign: 'right' }}>
                  Clique novamente para confirmar exclusão
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Botão adicionar */}
      <div className="px-5 mt-2">
        <button onClick={() => navigate('/home')}
          className="flex items-center justify-center gap-3 w-full py-4 rounded-full text-white transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
          <CameraIcon />
          Add Meal
        </button>
      </div>

    </div>
  )
}