import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const MEAL_TYPES = [
  { label: 'Café da manhã', icon: '☕' },
  { label: 'Almoço', icon: '🍽️' },
  { label: 'Jantar', icon: '🌙' },
  { label: 'Lanche', icon: '🥪' },
]

export default function Diary() {
  const { meals, totalKcal, user } = useApp()
  const navigate = useNavigate()
  const progress = Math.min((totalKcal / user.kcalGoal) * 100, 100)

  return (
    <div className="pb-24">

      <div className="px-5 pt-8 pb-4">
        <h1 className="text-white text-3xl font-black">Diário.</h1>
        <p className="text-gray-500 text-sm mt-1">Registro alimentar de hoje</p>
      </div>

      <div className="mx-5 rounded-2xl p-4 mb-6" style={{ background: '#1A1A1A' }}>
        <div className="flex justify-between mb-3">
          <div className="text-center">
            <p className="text-white font-black text-xl">{totalKcal}</p>
            <p className="text-gray-500 text-xs">consumido</p>
          </div>
          <div className="text-center">
            <p className="text-white font-black text-xl">{user.kcalGoal}</p>
            <p className="text-gray-500 text-xs">meta</p>
          </div>
          <div className="text-center">
            <p className="text-purple-400 font-black text-xl">{Math.max(user.kcalGoal - totalKcal, 0)}</p>
            <p className="text-gray-500 text-xs">restante</p>
          </div>
        </div>
        <div className="rounded-full h-2" style={{ background: '#2A2A2A' }}>
          <div className="h-2 rounded-full transition-all"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7C3AED, #A78BFA)' }}></div>
        </div>
      </div>

      <div className="px-5">
        {MEAL_TYPES.map(type => {
          const typeMeals = meals.filter(m => m.type === type.label)
          const typeKcal = typeMeals.reduce((s, m) => s + m.kcal, 0)

          return (
            <div key={type.label} className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{type.icon}</span>
                  <div>
                    <p className="text-white font-bold text-sm">{type.label}</p>
                    <p className="text-gray-500 text-xs">{typeKcal > 0 ? `${typeKcal} kcal` : 'Vazio'}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/home')}
                  className="w-8 h-8 rounded-lg font-bold text-white text-lg"
                  style={{ background: 'rgba(124, 58, 237, 0.3)' }}
                >+</button>
              </div>

              {typeMeals.length > 0 && (
                <div className="rounded-2xl overflow-hidden" style={{ background: '#1A1A1A' }}>
                  {typeMeals.map(meal => (
                    <div key={meal.id} className="flex items-center justify-between p-4 border-b border-gray-800 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                          style={{ background: 'rgba(124, 58, 237, 0.2)' }}>
                          {meal.emoji}
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold">{meal.name}</p>
                          <p className="text-gray-500 text-xs">P:{meal.prot}g C:{meal.carb}g G:{meal.fat}g</p>
                        </div>
                      </div>
                      <p className="text-purple-400 font-black text-sm">{meal.kcal} kcal</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="px-5 mt-2">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-white"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
        >
          <span className="text-xl">📸</span>
          Adicionar refeição
        </button>
      </div>
    </div>
  )
}