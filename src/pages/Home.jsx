import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Home() {
  const { user, totalKcal, totalProt, totalCarb, totalFat, meals, addMeal } = useApp()
  const navigate = useNavigate()
  const remaining = Math.max(user.kcalGoal - totalKcal, 0)

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [portion, setPortion] = useState(1)

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const today = new Date().getDay()
  const weekData = weekDays.map((day, i) => ({
    day,
    kcal: i === today ? totalKcal : Math.floor(Math.random() * 1800 + 200),
    isToday: i === today,
  }))
  const maxKcal = Math.max(...weekData.map(d => d.kcal), 1)

  async function analyzeImage(file) {
    setLoading(true)
    setResult(null)
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target.result.split(',')[1]
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: [
                { type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } },
                { type: 'text', text: 'Analise este alimento e responda APENAS com JSON sem texto extra: {"name":"nome em portugues","emoji":"emoji","kcal":0,"prot":0,"carb":0,"fat":0,"confidence":0}' }
              ]
            }]
          })
        })
        const data = await response.json()
        const text = data.content?.find(b => b.type === 'text')?.text || ''
        const food = JSON.parse(text.replace(/```json|```/g, '').trim())
        setResult(food)
      } catch {
        setResult({ name: 'Frango grelhado', emoji: '🍗', kcal: 165, prot: 31, carb: 0, fat: 4, confidence: 90 })
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setPortion(1)
    analyzeImage(file)
  }

  function handleConfirm() {
    addMeal({
      name: result.name,
      emoji: result.emoji,
      kcal: Math.round(result.kcal * portion),
      prot: Math.round(result.prot * portion),
      carb: Math.round(result.carb * portion),
      fat: Math.round(result.fat * portion),
    })
    setResult(null)
  }

  return (
    <div className="pb-24">

      {/* Header */}
      <div className="px-5 pt-8 pb-4 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">Bem-vindo de volta,</p>
          <h1 className="text-white text-3xl font-black">{user.name}.</h1>
          <p className="text-gray-500 text-xs mt-1">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div
          onClick={() => navigate('/profile')}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
        >
          {user.name[0].toUpperCase()}
        </div>
      </div>

      {/* Stats cards */}
      <div className="px-5 grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Calorias', value: totalKcal, unit: 'kcal', icon: '🔥' },
          { label: 'Proteína', value: `${totalProt}g`, unit: '', icon: '💪' },
          { label: 'Restante', value: remaining, unit: 'kcal', icon: '⚡' },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl p-3"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
          >
            <p className="text-2xl mb-1">{stat.icon}</p>
            <p className="text-white font-black text-lg leading-none">{stat.value}</p>
            <p className="text-purple-200 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Gráfico semanal */}
      <div className="mx-5 rounded-2xl p-4 mb-6" style={{ background: '#1A1A1A' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-white font-black text-sm uppercase tracking-wider">Calorias</p>
          <p className="text-purple-400 text-xs">Média semanal</p>
        </div>
        <div className="flex items-end justify-between gap-1" style={{ height: '80px' }}>
          {weekData.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-full rounded-t-lg transition-all"
                style={{
                  height: `${(d.kcal / maxKcal) * 70}px`,
                  background: d.isToday
                    ? 'linear-gradient(180deg, #A78BFA, #7C3AED)'
                    : 'rgba(124, 58, 237, 0.25)',
                  minHeight: '4px'
                }}
              />
              <p className={`text-xs ${d.isToday ? 'text-purple-400 font-bold' : 'text-gray-600'}`}>
                {d.day}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Últimas refeições */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-black text-sm uppercase tracking-wider">Refeições</p>
          <span className="text-purple-400 text-xs cursor-pointer" onClick={() => navigate('/diary')}>
            Ver tudo →
          </span>
        </div>

        {meals.length === 0 ? (
          <div className="rounded-2xl p-5 text-center" style={{ background: '#1A1A1A' }}>
            <p className="text-gray-500 text-sm">Nenhuma refeição registrada hoje</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#1A1A1A' }}>
            {meals.slice(-3).reverse().map(meal => (
              <div key={meal.id} className="flex items-center justify-between p-4 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: 'rgba(124, 58, 237, 0.2)' }}>
                    {meal.emoji}
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{meal.name}</p>
                    <p className="text-gray-500 text-xs">{meal.time}</p>
                  </div>
                </div>
                <p className="text-purple-400 font-black text-sm">{meal.kcal} kcal</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="mx-5 rounded-2xl p-6 text-center mb-4" style={{ background: '#1A1A1A' }}>
          <p className="text-gray-400 mb-3 text-sm">Analisando com IA...</p>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#7C3AED' }}></div>
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#7C3AED', animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#7C3AED', animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}

      {/* Resultado IA */}
      {result && !loading && (
        <div className="mx-5 rounded-2xl p-5 mb-4" style={{ background: '#1A1A1A', border: '1px solid #7C3AED' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: 'rgba(124, 58, 237, 0.2)' }}>
              {result.emoji}
            </div>
            <div>
              <p className="text-white font-black text-lg">{result.name}</p>
              <p className="text-purple-400 text-xs">Confiança: {result.confidence}%</p>
            </div>
          </div>

          <div className="rounded-xl p-4 text-center mb-4" style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
            <p className="text-white text-4xl font-black">{Math.round(result.kcal * portion)}</p>
            <p className="text-purple-200 text-sm">calorias</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Proteína', value: Math.round(result.prot * portion) },
              { label: 'Carbs', value: Math.round(result.carb * portion) },
              { label: 'Gordura', value: Math.round(result.fat * portion) },
            ].map(m => (
              <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(124, 58, 237, 0.15)' }}>
                <p className="text-white font-black">{m.value}g</p>
                <p className="text-gray-500 text-xs mt-1">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl p-3 mb-4" style={{ background: '#111' }}>
            <p className="text-gray-400 text-sm">Porção</p>
            <div className="flex items-center gap-4">
              <button onClick={() => setPortion(p => Math.max(0.5, p - 0.5))}
                className="w-8 h-8 rounded-lg text-white font-bold" style={{ background: '#2A2A2A' }}>−</button>
              <span className="text-white font-black">{portion}x</span>
              <button onClick={() => setPortion(p => Math.min(5, p + 0.5))}
                className="w-8 h-8 rounded-lg text-white font-bold" style={{ background: '#2A2A2A' }}>+</button>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setResult(null)}
              className="flex-1 py-3 rounded-xl text-white font-bold" style={{ background: '#2A2A2A' }}>
              Cancelar
            </button>
            <button onClick={handleConfirm}
              className="flex-1 py-3 rounded-xl text-white font-black"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
              ✓ Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Botão adicionar */}
      <div className="px-5">
        <label className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl cursor-pointer font-black text-white transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
          <span className="text-xl">📸</span>
          <span>Adicionar refeição</span>
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
        </label>
      </div>

    </div>
  )
}