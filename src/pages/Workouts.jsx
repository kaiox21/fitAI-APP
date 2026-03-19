import { useState } from 'react'
import { useApp } from '../context/AppContext'

const displayFont = { fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase' }

const WORKOUTS = [
  {
    day: 'Segunda', title: 'Peito & Tríceps', tag: 'Treino A',
    exercises: [
      { name: 'Supino Reto', sets: 4, reps: 12 },
      { name: 'Supino Inclinado', sets: 3, reps: 12 },
      { name: 'Supino Declinado', sets: 3, reps: 12 },
      { name: 'Crucifixo com Halter', sets: 3, reps: 15 },
      { name: 'Crossover', sets: 3, reps: 15 },
      { name: 'Tríceps Pulley', sets: 4, reps: 15 },
      { name: 'Tríceps Testa', sets: 3, reps: 12 },
      { name: 'Tríceps Corda', sets: 3, reps: 15 },
      { name: 'Mergulho', sets: 3, reps: 12 },
    ]
  },
  {
    day: 'Quarta', title: 'Costas & Bíceps', tag: 'Treino B',
    exercises: [
      { name: 'Puxada Frontal', sets: 4, reps: 12 },
      { name: 'Puxada Neutra', sets: 3, reps: 12 },
      { name: 'Remada Curvada', sets: 4, reps: 12 },
      { name: 'Remada Unilateral', sets: 3, reps: 12 },
      { name: 'Remada Baixa', sets: 3, reps: 12 },
      { name: 'Levantamento Terra', sets: 3, reps: 10 },
      { name: 'Rosca Direta', sets: 3, reps: 15 },
      { name: 'Rosca Alternada', sets: 3, reps: 12 },
      { name: 'Rosca Martelo', sets: 3, reps: 12 },
      { name: 'Rosca Concentrada', sets: 3, reps: 12 },
    ]
  },
  {
    day: 'Sexta', title: 'Pernas', tag: 'Treino C',
    exercises: [
      { name: 'Agachamento Livre', sets: 4, reps: 15 },
      { name: 'Agachamento Sumô', sets: 3, reps: 15 },
      { name: 'Leg Press', sets: 4, reps: 15 },
      { name: 'Leg Press 45°', sets: 3, reps: 15 },
      { name: 'Cadeira Extensora', sets: 3, reps: 15 },
      { name: 'Mesa Flexora', sets: 3, reps: 12 },
      { name: 'Cadeira Abdutora', sets: 3, reps: 15 },
      { name: 'Cadeira Adutora', sets: 3, reps: 15 },
      { name: 'Avanço com Halteres', sets: 3, reps: 12 },
      { name: 'Panturrilha em Pé', sets: 4, reps: 20 },
      { name: 'Panturrilha Sentado', sets: 3, reps: 20 },
    ]
  },
  {
    day: 'Sábado', title: 'Ombro & Abdômen', tag: 'Treino D',
    exercises: [
      { name: 'Desenvolvimento com Halter', sets: 4, reps: 12 },
      { name: 'Desenvolvimento Arnold', sets: 3, reps: 12 },
      { name: 'Elevação Lateral', sets: 4, reps: 15 },
      { name: 'Elevação Frontal', sets: 3, reps: 12 },
      { name: 'Encolhimento', sets: 3, reps: 15 },
      { name: 'Abdominal Crunch', sets: 4, reps: 20 },
      { name: 'Abdominal Oblíquo', sets: 3, reps: 20 },
      { name: 'Abdominal Infra', sets: 3, reps: 15 },
      { name: 'Prancha', sets: 3, reps: 45 },
      { name: 'Abdominal Roda', sets: 3, reps: 10 },
    ]
  },
]

const CARDIOS = ['Esteira', 'Bicicleta', 'Escada', 'Elíptico', 'Pular Corda', 'Natação', 'HIIT']

const ChevronIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
  </svg>
)

const inputStyle = {
  background: '#111',
  border: '1px solid #3A3A3A',
  borderRadius: '8px',
  color: 'white',
  padding: '6px 8px',
  outline: 'none',
  textAlign: 'center',
  fontFamily: 'Barlow Condensed, sans-serif',
  fontWeight: 700,
  fontSize: '1rem',
  width: '60px',
}

export default function Workouts() {
  const { user, addWorkoutLog } = useApp()
  const [open, setOpen] = useState(null)
  const [openExercise, setOpenExercise] = useState(null)

  // séries por exercício: { "wi-ei": [{reps, weight}, ...] }
  const [seriesData, setSeriesData] = useState({})

  // cardio por treino: { wi: { type, minutes, speed } }
  const [cardioData, setCardioData] = useState({})

  const [calculating, setCalculating] = useState(null)
  const [completedLogs, setCompletedLogs] = useState({})

  const todayIndex = [1, 3, 5, 6].indexOf(new Date().getDay())

  function getSeriesKey(wi, ei) { return `${wi}-${ei}` }

  function getSeries(wi, ei) {
    const key = getSeriesKey(wi, ei)
    if (!seriesData[key]) {
      const defaultSets = WORKOUTS[wi].exercises[ei].sets
      return Array.from({ length: defaultSets }, () => ({ reps: '', weight: '' }))
    }
    return seriesData[key]
  }

  function updateSeries(wi, ei, si, field, value) {
    const key = getSeriesKey(wi, ei)
    const current = getSeries(wi, ei)
    const updated = current.map((s, i) => i === si ? { ...s, [field]: value } : s)
    setSeriesData(prev => ({ ...prev, [key]: updated }))
  }

  function addSerie(wi, ei) {
    const key = getSeriesKey(wi, ei)
    const current = getSeries(wi, ei)
    setSeriesData(prev => ({ ...prev, [key]: [...current, { reps: '', weight: '' }] }))
  }

  function removeSerie(wi, ei, si) {
    const key = getSeriesKey(wi, ei)
    const current = getSeries(wi, ei)
    if (current.length <= 1) return
    setSeriesData(prev => ({ ...prev, [key]: current.filter((_, i) => i !== si) }))
  }

  function updateCardio(wi, field, value) {
    setCardioData(prev => ({ ...prev, [wi]: { ...prev[wi], [field]: value } }))
  }

  async function calculateAndSave(wi) {
    setCalculating(wi)
    const wt = WORKOUTS[wi]
    const weight = parseFloat(user.weight) || 75
    const cardio = cardioData[wi] || {}

    const exerciseSummary = wt.exercises.map((ex, ei) => {
      const series = getSeries(wi, ei).filter(s => s.reps || s.weight)
      if (series.length === 0) return null
      return `${ex.name}: ${series.map((s, i) => `série ${i + 1} - ${s.reps || '?'} reps x ${s.weight || '?'}kg`).join(', ')}`
    }).filter(Boolean)

    const cardioSummary = cardio.type
      ? `${cardio.type} por ${cardio.minutes || 0} minutos a ${cardio.speed || 0} km/h`
      : 'nenhum'

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Você é um personal trainer e nutricionista esportivo. Calcule as calorias queimadas com precisão. Responda APENAS com JSON sem texto extra:
{"caloriesBurned": number, "duration": number, "feedback": "feedback motivacional curto em portugues"}

Dados do atleta:
- Peso: ${weight}kg
- Exercícios realizados: ${exerciseSummary.join(' | ')}
- Cardio: ${cardioSummary}

Calcule as calorias totais queimadas levando em conta o volume, intensidade e peso do atleta.`
              }]
            }]
          })
        }
      )
      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const result = JSON.parse(text.replace(/```json|```/g, '').trim())

      addWorkoutLog({
        workout: wt.title,
        tag: wt.tag,
        exercises: exerciseSummary.length,
        cardio: cardio.type || null,
        cardioMinutes: parseInt(cardio.minutes) || 0,
        caloriesBurned: result.caloriesBurned,
        duration: result.duration,
      })

      setCompletedLogs(prev => ({ ...prev, [wi]: result }))
    } catch {
      const totalVolume = wt.exercises.reduce((sum, ex, ei) => {
        const series = getSeries(wi, ei)
        return sum + series.reduce((s, serie) => s + (parseFloat(serie.weight) || 0) * (parseInt(serie.reps) || 0), 0)
      }, 0)
      const musculacaoKcal = Math.round((totalVolume / 1000) * weight * 0.15)
      const cardioKcal = cardio.type ? Math.round((parseInt(cardio.minutes) || 0) * (parseFloat(cardio.speed) || 8) * weight * 0.005) : 0
      const total = musculacaoKcal + cardioKcal || 300

      addWorkoutLog({
        workout: wt.title,
        tag: wt.tag,
        exercises: exerciseSummary.length,
        cardio: cardio.type || null,
        cardioMinutes: parseInt(cardio.minutes) || 0,
        caloriesBurned: total,
        duration: (parseInt(cardio.minutes) || 0) + exerciseSummary.length * 5,
      })

      setCompletedLogs(prev => ({ ...prev, [wi]: { caloriesBurned: total, feedback: 'Treino concluído!' } }))
    } finally {
      setCalculating(null)
    }
  }

  return (
    <div className="pb-24">

      <div className="px-5 pt-8 pb-6">
        <p className="text-gray-500 text-xs uppercase tracking-widest">Plano personalizado</p>
        <h1 style={{ ...displayFont, fontSize: '2.2rem', fontWeight: 900, color: 'white', lineHeight: 1.1 }}>
          Treinos.
        </h1>
      </div>

      <div className="px-5 flex flex-col gap-3">
        {WORKOUTS.map((wt, wi) => (
          <div key={wi} className="rounded-2xl overflow-hidden" style={{ background: '#1A1A1A' }}>

            {/* Header do treino */}
            <div className="p-4 cursor-pointer flex items-center justify-between"
              onClick={() => setOpen(open === wi ? null : wi)}
              style={wi === todayIndex ? { borderLeft: '3px solid #7C3AED' } : {}}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p style={{ ...displayFont, fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>
                    {wt.title}
                  </p>
                  {wi === todayIndex && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(124,58,237,0.3)', color: '#A78BFA', fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Hoje
                    </span>
                  )}
                  {completedLogs[wi] && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(52,211,153,0.15)', color: '#34D399', fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Concluído
                    </span>
                  )}
                </div>
                <p style={{ ...displayFont, fontSize: '0.7rem', color: '#6B7280', letterSpacing: '0.08em' }}>
                  {wt.tag} · {wt.day} · {wt.exercises.length} exercícios
                  {completedLogs[wi] && ` · ${completedLogs[wi].caloriesBurned} kcal`}
                </p>
              </div>
              <ChevronIcon open={open === wi} />
            </div>

            {open === wi && (
              <div style={{ borderTop: '1px solid #2A2A2A' }}>

                {/* Lista de exercícios */}
                {wt.exercises.map((ex, ei) => {
                  const series = getSeries(wi, ei)
                  const isExOpen = openExercise === `${wi}-${ei}`

                  return (
                    <div key={ei} style={{ borderBottom: '1px solid #2A2A2A' }}>

                      {/* Header do exercício */}
                      <div className="flex items-center justify-between px-4 py-3 cursor-pointer"
                        onClick={() => setOpenExercise(isExOpen ? null : `${wi}-${ei}`)}>
                        <div>
                          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>{ex.name}</p>
                          <p style={{ ...displayFont, fontSize: '0.65rem', color: '#6B7280', letterSpacing: '0.05em', marginTop: '2px' }}>
                            {ex.sets} séries · {ex.reps} reps
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {series.some(s => s.reps || s.weight) && (
                            <span style={{ ...displayFont, fontSize: '0.65rem', color: '#34D399', letterSpacing: '0.05em' }}>
                              ✓ registrado
                            </span>
                          )}
                          <ChevronIcon open={isExOpen} />
                        </div>
                      </div>

                      {/* Séries do exercício */}
                      {isExOpen && (
                        <div className="px-4 pb-4">

                          {/* Header das colunas */}
                          <div className="flex items-center gap-2 mb-2 px-1">
                            <p style={{ ...displayFont, fontSize: '0.6rem', color: '#4B5563', letterSpacing: '0.08em', width: '40px' }}>Série</p>
                            <p style={{ ...displayFont, fontSize: '0.6rem', color: '#4B5563', letterSpacing: '0.08em', width: '60px', textAlign: 'center' }}>Reps</p>
                            <p style={{ ...displayFont, fontSize: '0.6rem', color: '#4B5563', letterSpacing: '0.08em', width: '60px', textAlign: 'center' }}>Peso (kg)</p>
                          </div>

                          {/* Linhas de séries */}
                          {series.map((serie, si) => (
                            <div key={si} className="flex items-center gap-2 mb-2">
                              <p style={{ ...displayFont, fontSize: '0.85rem', fontWeight: 700, color: '#A78BFA', width: '40px' }}>
                                {si + 1}ª
                              </p>
                              <input
                                type="number"
                                placeholder={String(ex.reps)}
                                value={serie.reps}
                                onChange={e => updateSeries(wi, ei, si, 'reps', e.target.value)}
                                style={inputStyle}
                              />
                              <input
                                type="number"
                                placeholder="0"
                                value={serie.weight}
                                onChange={e => updateSeries(wi, ei, si, 'weight', e.target.value)}
                                style={inputStyle}
                              />
                              <button onClick={() => removeSerie(wi, ei, si)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center"
                                style={{ background: '#2A2A2A' }}>
                                <TrashIcon />
                              </button>
                            </div>
                          ))}

                          {/* Botão adicionar série */}
                          <button onClick={() => addSerie(wi, ei)}
                            className="flex items-center gap-2 mt-1 px-3 py-1.5 rounded-lg"
                            style={{ background: 'rgba(124,58,237,0.2)' }}>
                            <PlusIcon />
                            <p style={{ ...displayFont, fontSize: '0.75rem', color: '#A78BFA', letterSpacing: '0.05em' }}>
                              Adicionar série
                            </p>
                          </button>

                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Cardio */}
                <div className="px-4 py-4" style={{ borderBottom: '1px solid #2A2A2A' }}>
                  <p style={{ ...displayFont, fontSize: '0.8rem', fontWeight: 800, color: '#A78BFA', letterSpacing: '0.08em', marginBottom: '12px' }}>
                    Cardio
                  </p>

                  {/* Seleção do tipo */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {CARDIOS.map(c => (
                      <button key={c}
                        onClick={() => updateCardio(wi, 'type', cardioData[wi]?.type === c ? null : c)}
                        className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                        style={{
                          fontFamily: 'Barlow Condensed, sans-serif',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          background: cardioData[wi]?.type === c ? '#7C3AED' : '#2A2A2A',
                          color: cardioData[wi]?.type === c ? 'white' : '#6B7280',
                        }}>
                        {c}
                      </button>
                    ))}
                  </div>

                  {/* Campos de tempo e velocidade */}
                  {cardioData[wi]?.type && (
                    <div className="flex gap-3">
                      <div className="flex-1 rounded-xl p-3" style={{ background: '#111' }}>
                        <p style={{ ...displayFont, fontSize: '0.65rem', color: '#6B7280', letterSpacing: '0.08em', marginBottom: '6px' }}>
                          Tempo
                        </p>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            placeholder="0"
                            value={cardioData[wi]?.minutes || ''}
                            onChange={e => updateCardio(wi, 'minutes', e.target.value)}
                            style={{ ...inputStyle, width: '100%', textAlign: 'left' }}
                          />
                          <p style={{ ...displayFont, fontSize: '0.75rem', color: '#6B7280' }}>min</p>
                        </div>
                      </div>
                      <div className="flex-1 rounded-xl p-3" style={{ background: '#111' }}>
                        <p style={{ ...displayFont, fontSize: '0.65rem', color: '#6B7280', letterSpacing: '0.08em', marginBottom: '6px' }}>
                          Velocidade
                        </p>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            placeholder="0"
                            value={cardioData[wi]?.speed || ''}
                            onChange={e => updateCardio(wi, 'speed', e.target.value)}
                            style={{ ...inputStyle, width: '100%', textAlign: 'left' }}
                          />
                          <p style={{ ...displayFont, fontSize: '0.75rem', color: '#6B7280' }}>km/h</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botão concluir */}
                <div className="p-4">
                  {completedLogs[wi] ? (
                    <div className="rounded-xl p-4" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <p style={{ ...displayFont, fontSize: '0.75rem', color: '#34D399', letterSpacing: '0.08em' }}>
                          Treino concluído
                        </p>
                        <p style={{ ...displayFont, fontSize: '2rem', fontWeight: 900, color: '#34D399', lineHeight: 1 }}>
                          {completedLogs[wi].caloriesBurned} kcal
                        </p>
                      </div>
                      {completedLogs[wi].feedback && (
                        <p style={{ fontSize: '0.8rem', color: '#6B7280', fontStyle: 'italic', marginTop: '4px' }}>
                          "{completedLogs[wi].feedback}"
                        </p>
                      )}
                    </div>
                  ) : calculating === wi ? (
                    <div className="rounded-xl p-4 text-center" style={{ background: '#111' }}>
                      <p style={{ ...displayFont, fontSize: '0.8rem', color: '#A78BFA', letterSpacing: '0.08em', marginBottom: '8px' }}>
                        Calculando com IA...
                      </p>
                      <div className="flex justify-center gap-2">
                        {[0, 0.1, 0.2].map((delay, i) => (
                          <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                            style={{ background: '#7C3AED', animationDelay: `${delay}s` }} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => calculateAndSave(wi)}
                      className="w-full py-3 rounded-full text-white font-black uppercase"
                      style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.08em', fontSize: '0.95rem' }}>
                      Concluir treino
                    </button>
                  )}
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}