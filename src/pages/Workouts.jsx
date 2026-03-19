import { useState } from 'react'

const displayFont = { fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase' }

const WORKOUTS = [
  {
    day: 'Segunda', title: 'Peito & Tríceps', tag: 'Treino A',
    exercises: [
      { name: 'Supino Reto', sets: '4', reps: '12', rest: '60s' },
      { name: 'Crucifixo com Halter', sets: '3', reps: '15', rest: '45s' },
      { name: 'Tríceps Pulley', sets: '3', reps: '15', rest: '45s' },
      { name: 'Tríceps Testa', sets: '3', reps: '12', rest: '60s' },
      { name: 'Cardio — Esteira', sets: '1', reps: '20min', rest: '—' },
    ]
  },
  {
    day: 'Quarta', title: 'Costas & Bíceps', tag: 'Treino B',
    exercises: [
      { name: 'Puxada Frontal', sets: '4', reps: '12', rest: '60s' },
      { name: 'Remada Curvada', sets: '4', reps: '12', rest: '60s' },
      { name: 'Rosca Direta', sets: '3', reps: '15', rest: '45s' },
      { name: 'Rosca Alternada', sets: '3', reps: '12', rest: '45s' },
      { name: 'Cardio — Bicicleta', sets: '1', reps: '15min', rest: '—' },
    ]
  },
  {
    day: 'Sexta', title: 'Pernas', tag: 'Treino C',
    exercises: [
      { name: 'Agachamento Livre', sets: '4', reps: '15', rest: '90s' },
      { name: 'Leg Press', sets: '4', reps: '15', rest: '90s' },
      { name: 'Cadeira Extensora', sets: '3', reps: '15', rest: '60s' },
      { name: 'Mesa Flexora', sets: '3', reps: '12', rest: '60s' },
      { name: 'Panturrilha', sets: '4', reps: '20', rest: '30s' },
    ]
  },
  {
    day: 'Sábado', title: 'Ombro & Abdômen', tag: 'Treino D',
    exercises: [
      { name: 'Desenvolvimento com Halter', sets: '4', reps: '12', rest: '60s' },
      { name: 'Elevação Lateral', sets: '3', reps: '15', rest: '45s' },
      { name: 'Elevação Frontal', sets: '3', reps: '12', rest: '45s' },
      { name: 'Abdominal Crunch', sets: '4', reps: '20', rest: '30s' },
      { name: 'Prancha', sets: '3', reps: '45s', rest: '30s' },
      { name: 'Abdominal Oblíquo', sets: '3', reps: '20', rest: '30s' },
    ]
  },
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
  const [open, setOpen] = useState(null)
  const [done, setDone] = useState({})
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
                  {isWorkoutDone(wi) && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(52,211,153,0.15)', color: '#34D399', fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Concluído
                    </span>
                  )}
                </div>
                <p style={{ ...displayFont, fontSize: '0.7rem', color: '#6B7280', letterSpacing: '0.08em' }}>
                  {wt.tag} &nbsp;·&nbsp; {wt.day} &nbsp;·&nbsp; {wt.exercises.length} exercícios
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
                        fontSize: '0.9rem', fontWeight: 600, color: done[`${wi}-${ei}`] ? '#4B5563' : 'white',
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

                <div className="p-4">
                  {isWorkoutDone(wi) ? (
                    <div className="rounded-xl p-3 text-center"
                      style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)' }}>
                      <p style={{ ...displayFont, fontSize: '1rem', color: '#34D399' }}>Treino concluído!</p>
                    </div>
                  ) : (
                    <button onClick={() => markAllDone(wi)}
                      className="w-full py-3 rounded-full text-white font-black uppercase"
                      style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.08em', fontSize: '0.95rem' }}>
                      Marcar como concluído
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