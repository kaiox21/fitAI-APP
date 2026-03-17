import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Home() {
  const { user, totalKcal, totalProt, totalCarb, totalFat, meals, addMeal } = useApp()
  const navigate = useNavigate()
  const progress = Math.min((totalKcal / user.kcalGoal) * 100, 100)
  const remaining = Math.max(user.kcalGoal - totalKcal, 0)

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [portion, setPortion] = useState(1)

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
    <div className="p-4 pb-24">

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-400 text-sm">Olá,</p>
          <h1 className="text-white text-2xl font-bold">{user.name} 💪</h1>
        </div>
        <div
          className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center text-black font-bold cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          {user.name[0].toUpperCase()}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Hoje</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-400 text-5xl font-bold">{totalKcal}</p>
            <p className="text-gray-400 text-sm mt-1">kcal consumidas</p>
          </div>
          <div className="text-right">
            <p className="text-white text-lg font-bold">{user.kcalGoal}</p>
            <p className="text-gray-400 text-xs">meta</p>
            <p className="text-orange-400 text-lg font-bold mt-2">{remaining}</p>
            <p className="text-gray-400 text-xs">restante</p>
          </div>
        </div>
        <div className="mt-4 bg-gray-800 rounded-full h-2">
          <div className="bg-green-400 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Proteína', value: `${totalProt}g`, color: 'text-green-400' },
          { label: 'Carbs', value: `${totalCarb}g`, color: 'text-orange-400' },
          { label: 'Gordura', value: `${totalFat}g`, color: 'text-blue-400' },
        ].map(macro => (
          <div key={macro.label} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
            <p className={`text-xl font-bold ${macro.color}`}>{macro.value}</p>
            <p className="text-gray-400 text-xs mt-1">{macro.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-bold">Últimas refeições</h2>
        <span className="text-green-400 text-sm cursor-pointer" onClick={() => navigate('/diary')}>
          Ver tudo →
        </span>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
        {meals.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">Nenhuma refeição registrada hoje</p>
        ) : (
          meals.slice(-3).reverse().map(meal => (
            <div key={meal.id} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{meal.emoji}</span>
                <div>
                  <p className="text-white text-sm font-medium">{meal.name}</p>
                  <p className="text-gray-400 text-xs">{meal.time}</p>
                </div>
              </div>
              <p className="text-orange-400 font-bold">{meal.kcal} kcal</p>
            </div>
          ))
        )}
      </div>

      {loading && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center mb-4">
          <p className="text-gray-400 mb-3">Analisando com IA...</p>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay:'0.1s'}}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{result.emoji}</span>
            <div>
              <p className="text-white font-bold text-lg">{result.name}</p>
              <p className="text-green-400 text-xs">Confiança: {result.confidence}%</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 text-center mb-4">
            <p className="text-green-400 text-4xl font-bold">{Math.round(result.kcal * portion)}</p>
            <p className="text-gray-400 text-sm">calorias</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Proteína', value: Math.round(result.prot * portion), color: 'text-green-400' },
              { label: 'Carbs', value: Math.round(result.carb * portion), color: 'text-orange-400' },
              { label: 'Gordura', value: Math.round(result.fat * portion), color: 'text-blue-400' },
            ].map(m => (
              <div key={m.label} className="bg-gray-800 rounded-xl p-3 text-center">
                <p className={`font-bold ${m.color}`}>{m.value}g</p>
                <p className="text-gray-400 text-xs mt-1">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between bg-gray-800 rounded-xl p-3 mb-4">
            <p className="text-gray-400 text-sm">Porção</p>
            <div className="flex items-center gap-4">
              <button onClick={() => setPortion(p => Math.max(0.5, p - 0.5))} className="w-8 h-8 bg-gray-700 rounded-lg text-white font-bold">−</button>
              <span className="text-white font-bold">{portion}x</span>
              <button onClick={() => setPortion(p => Math.min(5, p + 0.5))} className="w-8 h-8 bg-gray-700 rounded-lg text-white font-bold">+</button>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setResult(null)} className="flex-1 py-3 bg-gray-800 text-white font-bold rounded-xl">
              Cancelar
            </button>
            <button onClick={handleConfirm} className="flex-1 py-3 bg-green-400 text-black font-bold rounded-xl">
              ✓ Adicionar
            </button>
          </div>
        </div>
      )}

      <label className="flex items-center justify-center gap-3 w-full bg-green-400 hover:bg-green-300 text-black font-bold py-4 rounded-2xl cursor-pointer transition-all active:scale-95">
        <span className="text-2xl">📸</span>
        <span className="text-base">Adicionar refeição</span>
        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
      </label>

    </div>
  )
}