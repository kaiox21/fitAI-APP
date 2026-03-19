import { useState } from 'react'
import { useApp } from '../context/AppContext'

const displayFont = { fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase' }

const WORKOUTS = [
  {
    day: 'Segunda', title: 'Peito & Tríceps', tag: 'Treino A',
    exercises: [
      { name: 'Supino Reto', sets: '4', reps: '12', rest: '60s' },
      { name: 'Supino Inclinado', sets: '3', reps: '12', rest: '60s' },
      { name: 'Supino Declinado', sets: '3', reps: '12', rest: '60s' },
      { name: 'Crucifixo com Halter', sets: '3', reps: '15', rest: '45s' },
      { name: 'Crossover', sets: '3', reps: '15', rest: '45s' },
      { name: 'Tríceps Pulley', sets: '4', reps: '15', rest: '45s' },
      { name: 'Tríceps Testa', sets: '3', reps: '12', rest: '60s' },
      { name: 'Tríceps Corda', sets: '3', reps: '15', rest: '45s' },
      { name: 'Mergulho', sets: '3', reps: '12', rest: '60s' },
    ]
  },
  {
    day: 'Quarta', title: 'Costas & Bíceps', tag: 'Treino B',
    exercises: [
      { name: 'Puxada Frontal', sets: '4', reps: '12', rest: '60s' },
      { name: 'Puxada Neutra', sets: '3', reps: '12', rest: '60s' },
      { name: 'Remada Curvada', sets: '4', reps: '12', rest: '60s' },
      { name: 'Remada Unilateral', sets: '3', reps: '12', rest: '60s' },
      { name: 'Remada Baixa', sets: '3', reps: '12', rest: '60s' },
      { name: 'Levantamento Terra', sets: '3', reps: '10', rest: '90s' },
      { name: 'Rosca Direta', sets: '3', reps: '15', rest: '45s' },
      { name: 'Rosca Alternada', sets: '3', reps: '12', rest: '45s' },
      { name: 'Rosca Martelo', sets: '3', reps: '12', rest: '45s' },
      { name: 'Rosca Concentrada', sets: '3', reps: '12', rest: '45s' },
    ]
  },
  {
    day: 'Sexta', title: 'Pernas', tag: 'Treino C',
    exercises: [
      { name: 'Agachamento Livre', sets: '4', reps: '15', rest: '90s' },
      { name: 'Agachamento Sumô', sets: '3', reps: '15', rest: '60s' },
      { name: 'Leg Press', sets: '4', reps: '15', rest: '90s' },
      { name: 'Leg Press 45°', sets: '3', reps: '15', rest: '90s' },
      { name: 'Cadeira Extensora', sets: '3', reps: '15', rest: '60s' },
      { name: 'Mesa Flexora', sets: '3', reps: '12', rest: '60s' },
      { name: 'Cadeira Abdutora', sets: '3', reps: '15', rest: '45s' },
      { name: 'Cadeira Adutora', sets: '3', reps: '15', rest: '45s' },
      { name: 'Avanço com Halteres', sets: '3', reps: '12', rest: '60s' },
      { name: 'Panturrilha em Pé', sets: '4', reps: '20', rest: '30s' },
      { name: 'Panturrilha Sentado', sets: '3', reps: '20', rest: '30s' },
    ]
  },
  {
    day: 'Sábado', title: 'Ombro & Abdômen', tag: 'Treino D',
    exercises: [
      { name: 'Desenvolvimento com Halter', sets: '4', reps: '12', rest: '60s' },
      { name: 'Desenvolvimento Arnold', sets: '3', reps: '12', rest: '60s' },
      { name: 'Elevação Lateral', sets: '4', reps: '15', rest: '45s' },
      { name: 'Elevação Frontal', sets: '3', reps: '12', rest: '45s' },
      { name: 'Encolhimento', sets: '3', reps: '15', rest: '45s' },
      { name: 'Abdominal Crunch', sets: '4', reps: '20', rest: '30s' },
      { name: 'Abdominal Oblíquo', sets: '3', reps: '20', rest: '30s' },
      { name: 'Abdominal Infra', sets: '3', reps: '15', rest: '30s' },
      { name: 'Prancha', sets: '3', reps: '45s', rest: '30s' },
      { name: 'Abdominal Roda', sets: '3', reps: '10', rest: '45s' },
    ]
  },
]

const CARDIOS = [
  { name: 'Esteira', met: 8 },
  { name: 'Bicicleta', met: 7 },
  { name: 'Escada', met: 9 },
  { name: 'Elíptico', met: 7 },
  { name: 'Pular Corda', met: 10 },
  { name: 'Natação', met: 8 },
  { name: 'HIIT', met: 12 },
]

const ChevronIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function Workouts() {
  const { user, addWorkoutLog } = useApp()
  const [open, setOpen] = useState(null)
  const [done, setDone] = useState({})
  const [cardioMinutes, setCardioMinutes] = useState({})
  const [selectedCardio, setSelectedCardio] = useState({})
  const [calculating, setCalculating] = useState(null)
  const [completedLogs, setCompletedLogs] = useState({})
  const todayIndex = [1, 3, 5, 6].indexOf(new Date().getDay())

  function toggleExercise(wi, ei) {
    const key = `${wi}-${ei}`
    setDone(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function isWorkoutDone(wi) {
    return WORKOUTS[wi].exercises.every((_, ei) => done[`${wi}-${ei}`])
  }

  function markAllDone(wi) {
    WORKOUTS[wi].exercises.forEach((_, ei) => {
      setDone(prev => ({ ...prev, [`${wi}-${ei}`]: true }))
    })
  }

  async function calculateAndSave(wi) {
    setCalculating(wi)
    const wt = WORKOUTS[wi]
    const completedExercises = wt.exercises.filter((_, ei) => done[`${wi}-${ei}`])
    const cardio = selectedCardio[wi]
    const minutes = parseInt(cardioMinutes[wi]) || 0
    const weight = parseFloat(user.weight) || 75

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: `Calcule as calorias queimadas neste treino. Responda APENAS com JSON sem texto extra:
{"caloriesBurned": number, "duration": number}

Dados:
- Peso do usuário: ${weight}kg
- Exercícios realizados: ${completedExercises.map(e => `${e.name} ${e.sets}x${e.reps}`).join(', ')}
- Cardio: ${cardio ? `${cardio} por ${minutes} minutos` : 'nenhum'}

Estime as calorias totais queimadas (musculação + cardio) com base no peso e volume de treino.`
          }]
        })
      })
      const data = await response.json()
      const text = data.content?.find(b => b.type === 'text')?.text || ''
      const result = JSON.parse(text.replace(/```json|```/g, '').trim())

      addWorkoutLog({
        workout: wt.title,
        tag: wt.tag,
        exercises: completedExercises.length,
        cardio: cardio || null,
        cardioMinutes: minutes,
        caloriesBurned: result.caloriesBurned,
        duration: result.duration,
      })

      setCompletedLogs(prev => ({ ...prev, [wi]: result }))
    } catch {
      // Fallback: cálculo local
      const musculacaoKcal = completedExercises.length * weight * 0.08
      const cardioObj = CARDIOS.find(c => c.name === cardio)
      const cardioKcal = cardioObj ? (cardioObj.met * weight * minutes) / 60 : 0
      const total = Math.round(musculacaoKcal + cardioKcal)

      addWorkoutLog({
        workout: wt.title,
        tag: wt.tag,
        exercises: completedExercises.length,
        cardio: cardio || null,
        cardioMinutes: minutes,
        caloriesBurned: total,
        duration: minutes + completedExercises.length * 4,
      })

      setCompletedLogs(prev => ({ ...prev, [wi]: { caloriesBurned: total } }))
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
                  {wt.tag} &nbsp;·&nbsp; {wt.day} &nbsp;·&nbsp; {wt.exercises.length} exercícios
                  {completedLogs[wi] && ` · ${completedLogs[wi].caloriesBurned} kcal queimadas`}
                </p>
              </div>
              <ChevronIcon open={open === wi} />
            </div>

            {open === wi && (
              <div style={{ borderTop: '1px solid #2A2A2A' }}>

                {wt.exercises.map((ex, ei) => (
                  <div key={ei} className="flex items-center gap-3 px-4 py-3"
                    style={{ borderBottom: '1px solid #2A2A2A' }}>
                    <button onClick={() => toggleExercise(wi, ei)}
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        background: done[`${wi}-${ei}`] ? '#7C3AED' : 'transparent',
                        border: `2px solid ${done[`${wi}-${ei}`] ? '#7C3AED' : '#3A3A3A'}`
                      }}>
                      {done[`${wi}-${ei}`] && <CheckIcon />}
                    </button>
                    <div className="flex-1">
                      <p style={{
                        fontSize: '0.9rem', fontWeight: 600,
                        color: done[`${wi}-${ei}`] ? '#4B5563' : 'white',
                        textDecoration: done[`${wi}-${ei}`] ? 'line-through' : 'none'
                      }}>
                        {ex.name}
                      </p>
                      <p style={{ ...displayFont, fontSize: '0.65rem', color: '#6B7280', letterSpacing: '0.05em', marginTop: '2px' }}>
                        {ex.sets} séries &nbsp;·&nbsp; {ex.reps} reps &nbsp;·&nbsp; {ex.rest}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Cardio */}
                <div className="px-4 py-4" style={{ borderBottom: '1px solid #2A2A2A' }}>
                  <p style={{ ...displayFont, fontSize: '0.8rem', fontWeight: 800, color: '#A78BFA', letterSpacing: '0.08em', marginBottom: '12px' }}>
                    Cardio
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {CARDIOS.map(c => (
                      <button key={c.name}
                        onClick={() => setSelectedCardio(prev => ({
                          ...prev, [wi]: prev[wi] === c.name ? null : c.name
                        }))}
                        className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                        style={{
                          fontFamily: 'Barlow Condensed, sans-serif',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          background: selectedCardio[wi] === c.name ? '#7C3AED' : '#2A2A2A',
                          color: selectedCardio[wi] === c.name ? 'white' : '#6B7280',
                        }}>
                        {c.name}
                      </button>
                    ))}
                  </div>

                  {selectedCardio[wi] && (
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#111' }}>
                      <div className="flex-1">
                        <p style={{ ...displayFont, fontSize: '0.75rem', color: '#A78BFA', letterSpacing: '0.05em' }}>
                          {selectedCardio[wi]}
                        </p>
                        <p style={{ ...displayFont, fontSize: '0.65rem', color: '#6B7280', marginTop: '2px' }}>
                          Minutos realizados
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="0"
                          value={cardioMinutes[wi] || ''}
                          onChange={e => setCardioMinutes(prev => ({ ...prev, [wi]: e.target.value }))}
                          className="text-right outline-none font-black"
                          style={{
                            background: 'transparent', color: 'white', width: '50px',
                            fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.3rem',
                            borderBottom: '1px solid #3A3A3A'
                          }}
                        />
                        <p style={{ ...displayFont, fontSize: '0.75rem', color: '#6B7280' }}>min</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botão concluir */}
                <div className="p-4">
                  {completedLogs[wi] ? (
                    <div className="rounded-xl p-4 text-center"
                      style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)' }}>
                      <p style={{ ...displayFont, fontSize: '0.75rem', color: '#34D399', letterSpacing: '0.08em' }}>
                        Treino concluído
                      </p>
                      <p style={{ ...displayFont, fontSize: '2rem', fontWeight: 900, color: '#34D399', lineHeight: 1, marginTop: '4px' }}>
                        {completedLogs[wi].caloriesBurned} kcal
                      </p>
                      <p style={{ ...displayFont, fontSize: '0.7rem', color: '#6B7280', marginTop: '4px' }}>
                        queimadas
                      </p>
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
                      onClick={() => {
                        markAllDone(wi)
                        calculateAndSave(wi)
                      }}
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