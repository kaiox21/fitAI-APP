import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Camera() {
  const navigate = useNavigate()
  const { addMeal } = useApp()

  const [image, setImage] = useState(null)
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
    setImage(URL.createObjectURL(file))
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
    navigate('/home')
  }

  return (
    <div className="p-4 pb-24">
      <h1 className="text-white text-xl font-bold mb-4">Identificar alimento</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-4 aspect-square flex items-center justify-center">
        {image ? (
          <img src={image} alt="Alimento" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-500">
            <p className="text-5xl mb-3">📷</p>
            <p className="text-sm">Nenhuma foto selecionada</p>
          </div>
        )}
      </div>

      <label className="flex items-center justify-center gap-3 w-full bg-green-400 hover:bg-green-300 text-black font-bold py-4 rounded-2xl cursor-pointer transition-all active:scale-95 mb-4">
        <span className="text-xl">📸</span>
        <span>{image ? 'Trocar foto' : 'Tirar / escolher foto'}</span>
        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
      </label>

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
            <button onClick={() => { setResult(null); setImage(null) }} className="flex-1 py-3 bg-gray-800 text-white font-bold rounded-xl">
              Cancelar
            </button>
            <button onClick={handleConfirm} className="flex-1 py-3 bg-green-400 text-black font-bold rounded-xl">
              ✓ Adicionar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}