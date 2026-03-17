import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const MEAL_TYPES = [
  { label: 'Café da manhã', icon: '☕' },
  { label: 'Almoço', icon: '🍽️' },
  { label: 'Jantar', icon: '🌙' },
  { label: 'Lanche', icon: '🥪' },
]

export default function Diario() {
  const { meals, totalKcal, user } = useApp()
  const navigate = useNavigate()
  const progress = Math.min((totalKcal / user.kcalGoal) * 100, 100)

  return (
    <div className="p-4 pb-24">
      <h1 className="text-white text-xl font-bold mb-4">Diário Alimentar</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6">
        <div className="flex justify-between mb-3">
          <div className="text-center">
            <p className="text-green-400 text-xl font-bold">{totalKcal}</p>
            <p className="text-gray-400 text-xs">consumido</p>
          </div>
          <div className="text-center">
            <p className="text-white text-xl font-bold">{user.kcalGoal}</p>
            <p className="text-gray-400 text-xs">meta</p>
          </div>
          <div className="text-center">
            <p className="text-orange-400 text-xl font-bold">{Math.max(user.kcalGoal - totalKcal, 0)}</p>
            <p className="text-gray-400 text-xs">restante</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-full h-2">
          <div className="bg-green-400 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {MEAL_TYPES.map(type => {
        const typeMeals = meals.filter(m => m.type === type.label)
        const typeKcal = typeMeals.reduce((s, m) => s + m.kcal, 0)

        return (
          <div key={type.label} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{type.icon}</span>
                <div>
                  <p className="text-white font-bold text-sm">{type.label}</p>
                  <p className="text-gray-400 text-xs">{typeKcal > 0 ? `${typeKcal} kcal` : 'Vazio'}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/home')}
                className="w-8 h-8 bg-green-400 bg-opacity-20 text-green-400 rounded-lg font-bold text-lg"
              >
                +
              </button>
            </div>

            {typeMeals.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                {typeMeals.map(meal => (
                  <div key={meal.id} className="flex items-center justify-between p-3 border-b border-gray-800 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{meal.emoji}</span>
                      <div>
                        <p className="text-white text-sm font-medium">{meal.name}</p>
                        <p className="text-gray-400 text-xs">P:{meal.prot}g C:{meal.carb}g G:{meal.fat}g</p>
                      </div>
                    </div>
                    <p className="text-orange-400 font-bold text-sm">{meal.kcal} kcal</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <button
        onClick={() => navigate('/home')}
        className="flex items-center justify-center gap-3 w-full bg-green-400 hover:bg-green-300 text-black font-bold py-4 rounded-2xl transition-all active:scale-95"
      >
        <span className="text-xl">📸</span>
        Adicionar refeição
      </button>
    </div>
  )
}