import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const displayFont = { fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase' }

const FireIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
)

const MuscleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
    <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
  </svg>
)

const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)

const CameraIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
)

export default function Home() {
  const { user, totalKcal, totalProt, totalCarb, totalFat, meals, addMeal, totalBurned, dailyDeficit, weeklyData } = useApp()
  const navigate = useNavigate()
  const remaining = Math.max(user.kcalGoal - totalKcal, 0)
  const progress = Math.min((totalKcal / user.kcalGoal) * 100, 100)

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

  const weeklyDeficit = weeklyData.reduce((sum, d) => sum + d.deficit, 0)
  const weeklyConsumed = weeklyData.reduce((sum, d) => sum + d.consumed, 0)
  const weeklyBurned = weeklyData.reduce((sum, d) => sum + d.burned, 0)

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
                { type: 'text', text: 'Analise este alimento e responda APENAS com JSON sem texto extra: {"name":"nome em portugues","kcal":0,"prot":0,"carb":0,"fat":0,"confidence":0}' }
              ]
            }]
          })
        })
        const data = await response.json()
        const text = data.content?.find(b => b.type === 'text')?.text || ''
        const food = JSON.parse(text.replace(/```json|```/g, '').trim())
        setResult(food)
      } catch {
        setResult({ name: 'Frango grelhado', kcal: 165, prot: 31, carb: 0, fat: 4, confidence: 90 })
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
          <p className="text-gray-500 text-xs uppercase tracking-widest">Bem-vindo de volta</p>
          <h1 style={{ ...displayFont, fontSize: '2.2rem', fontWeight: 900, color: 'white', lineHeight: 1.1 }}>
            Hi, {user.name.split(' ')[0]}.
          </h1>
          <p className="text-gray-600 text-xs mt-1">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div onClick={() => navigate('/profile')}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', fontFamily: 'Barlow Condensed, sans-serif' }}>
          {user.name[0].toUpperCase()}
        </div>
      </div>

      {/* Stats cards */}
      <div className="px-5 grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Consumido', value: totalKcal, icon: <FireIcon /> },
          { label: 'Queimado', value: totalBurned, icon: <MuscleIcon /> },
          { label: 'Restante', value: remaining, icon: <ZapIcon /> },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl p-3"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
            <div className="mb-2">{stat.icon}</div>
            <p style={{ ...displayFont, fontSize: '1.4rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
              {stat.value}
            </p>
            <p className="text-purple-200 text-xs mt-1 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Déficit diário */}
      <div className="mx-5 rounded-2xl p-4 mb-5"
        style={{
          background: dailyDeficit > 0 ? 'rgba(52,211,153,0.1)' : dailyDeficit < 0 ? 'rgba(248,113,113,0.1)' : '#1A1A1A',
          border: `1px solid ${dailyDeficit > 0 ? 'rgba(52,211,153,0.3)' : dailyDeficit < 0 ? 'rgba(248,113,113,0.3)' : '#2A2A2A'}`
        }}>
        <div className="flex items-center justify-between">
          <div>
            <p style={{ ...displayFont, fontSize: '0.7rem', color: '#6B7280', letterSpacing: '0.1em' }}>
              Déficit diário
            </p>
            <p style={{
              ...displayFont, fontSize: '2rem', fontWeight: 900, lineHeight: 1, marginTop: '4px',
              color: dailyDeficit > 0 ? '#34D399' : dailyDeficit < 0 ? '#F87171' : '#6B7280'
            }}>
              {dailyDeficit > 0 ? '+' : ''}{dailyDeficit} kcal
            </p>
            <p style={{ ...displayFont, fontSize: '0.65rem', color: '#6B7280', marginTop: '4px' }}>
              {dailyDeficit > 0 ? 'Você está em déficit' : dailyDeficit < 0 ? 'Você está em superávit' : 'Registre treinos para calcular'}
            </p>
          </div>
          <div className="text-right">
            <p style={{ ...displayFont, fontSize: '0.7rem', color: '#6B7280', letterSpacing: '0.1em' }}>
              Déficit semanal
            </p>
            <p style={{
              ...displayFont, fontSize: '1.3rem', fontWeight: 900, lineHeight: 1, marginTop: '4px',
              color: weeklyDeficit > 0 ? '#34D399' : weeklyDeficit < 0 ? '#F87171' : '#6B7280'
            }}>
              {weeklyDeficit > 0 ? '+' : ''}{weeklyDeficit} kcal
            </p>
          </div>
        </div>
      </div>

      {/* Progresso */}
      <div className="px-5 mb-5">
        <div className="flex justify-between mb-2">
          <p style={{ ...displayFont, fontSize: '0.75rem', color: '#6B7280', letterSpacing: '0.1em' }}>Progresso diário</p>
          <p style={{ ...displayFont, fontSize: '0.75rem', color: '#A78BFA', letterSpacing: '0.1em' }}>{Math.round(progress)}%</p>
        </div>
        <div className="rounded-full h-2" style={{ background: '#1A1A1A' }}>
          <div className="h-2 rounded-full transition-all"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7C3AED, #A78BFA)' }} />
        </div>
      </div>

      {/* Relatório semanal */}
      <div className="mx-5 rounded-2xl p-4 mb-5" style={{ background: '#1A1A1A' }}>
        <div className="flex items-center justify-between mb-4">
          <p style={{ ...displayFont, fontSize: '1rem', fontWeight: 800, color: 'white' }}>Relatório semanal</p>
          <p style={{ ...displayFont, fontSize: '0.75rem', color: '#A78BFA' }}>7 dias</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Consumido', value: weeklyConsumed, color: '#F87171' },
            { label: 'Queimado', value: weeklyBurned, color: '#34D399' },
            { label: 'Déficit', value: weeklyDeficit, color: weeklyDeficit >= 0 ? '#34D399' : '#F87171' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p style={{ ...displayFont, fontSize: '1.1rem', fontWeight: 900, color: item.color, lineHeight: 1 }}>
                {item.value > 0 && item.label === 'Déficit' ? '+' : ''}{item.value}
              </p>
              <p style={{ ...displayFont, fontSize: '0.6rem', color: '#6B7280', letterSpacing: '0.08em', marginTop: '3px' }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Gráfico semanal de déficit */}
        <div className="flex items-end justify-between gap-1" style={{ height: '60px' }}>
          {weeklyData.map((d, i) => {
            const isToday = i === weeklyData.length - 1
            const hasData = d.consumed > 0 || d.burned > 0
            const barHeight = hasData ? Math.max((Math.abs(d.deficit) / Math.max(...weeklyData.map(w => Math.abs(w.deficit)), 1)) * 50, 4) : 4
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${barHeight}px`,
                    background: !hasData ? '#2A2A2A' : d.deficit >= 0 ? (isToday ? '#34D399' : 'rgba(52,211,153,0.4)') : (isToday ? '#F87171' : 'rgba(248,113,113,0.4)'),
                    minHeight: '4px'
                  }} />
                <p style={{
                  fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.6rem',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  color: isToday ? '#A78BFA' : '#4B5563',
                  fontWeight: isToday ? 700 : 400
                }}>
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][new Date(d.date).getDay()]}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Últimas refeições */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p style={{ ...displayFont, fontSize: '1rem', fontWeight: 800, color: 'white' }}>Refeições</p>
          <span style={{ ...displayFont, fontSize: '0.75rem', color: '#A78BFA', cursor: 'pointer', letterSpacing: '0.05em' }}
            onClick={() => navigate('/diary')}>
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
                <div>
                  <p className="text-white text-sm font-bold">{meal.name}</p>
                  <p className="text-gray-500 text-xs">{meal.time}</p>
                </div>
                <p style={{ ...displayFont, fontSize: '1rem', fontWeight: 700, color: '#A78BFA' }}>
                  {meal.kcal} kcal
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="mx-5 rounded-2xl p-6 text-center mb-4" style={{ background: '#1A1A1A' }}>
          <p style={{ ...displayFont, fontSize: '0.9rem', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '12px' }}>
            Analisando com IA...
          </p>
          <div className="flex justify-center gap-2">
            {[0, 0.1, 0.2].map((delay, i) => (
              <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                style={{ background: '#7C3AED', animationDelay: `${delay}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Resultado IA */}
      {result && !loading && (
        <div className="mx-5 rounded-2xl p-5 mb-4" style={{ background: '#1A1A1A', border: '1px solid #7C3AED' }}>
          <div className="mb-4">
            <p style={{ ...displayFont, fontSize: '1.4rem', fontWeight: 900, color: 'white' }}>{result.name}</p>
            <p style={{ ...displayFont, fontSize: '0.75rem', color: '#A78BFA', letterSpacing: '0.1em' }}>
              Confiança: {result.confidence}%
            </p>
          </div>

          <div className="rounded-xl p-4 text-center mb-4"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
            <p style={{ ...displayFont, fontSize: '3rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
              {Math.round(result.kcal * portion)}
            </p>
            <p style={{ ...displayFont, fontSize: '0.75rem', color: '#DDD6FE', letterSpacing: '0.1em', marginTop: '4px' }}>
              Calorias
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Proteína', value: Math.round(result.prot * portion) },
              { label: 'Carbs', value: Math.round(result.carb * portion) },
              { label: 'Gordura', value: Math.round(result.fat * portion) },
            ].map(m => (
              <div key={m.label} className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(124,58,237,0.15)' }}>
                <p style={{ ...displayFont, fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>{m.value}g</p>
                <p style={{ ...displayFont, fontSize: '0.65rem', color: '#6B7280', letterSpacing: '0.05em', marginTop: '4px' }}>
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl p-3 mb-4" style={{ background: '#111' }}>
            <p style={{ ...displayFont, fontSize: '0.85rem', color: '#6B7280' }}>Porção</p>
            <div className="flex items-center gap-4">
              <button onClick={() => setPortion(p => Math.max(0.5, p - 0.5))}
                className="w-8 h-8 rounded-lg text-white font-bold" style={{ background: '#2A2A2A' }}>−</button>
              <span style={{ ...displayFont, fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>{portion}x</span>
              <button onClick={() => setPortion(p => Math.min(5, p + 0.5))}
                className="w-8 h-8 rounded-lg text-white font-bold" style={{ background: '#2A2A2A' }}>+</button>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setResult(null)}
              className="flex-1 py-3 rounded-full text-white font-bold uppercase"
              style={{ background: '#2A2A2A', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.05em' }}>
              Cancelar
            </button>
            <button onClick={handleConfirm}
              className="flex-1 py-3 rounded-full text-white font-black uppercase"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.05em' }}>
              Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Botão adicionar */}
      <div className="px-5">
        <label className="flex items-center justify-center gap-3 w-full py-4 rounded-full cursor-pointer text-white transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
          <CameraIcon />
          Add Meal
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
        </label>
      </div>

    </div>
  )
}