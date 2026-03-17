import { useState } from 'react'

const WORKOUTS = [
  {
    day: 'Segunda', title: 'Peito & Tríceps', icon: '💪', tag: 'Treino A',
    exercises: [
      { name: 'Supino Reto', sets: '4', reps: '12', rest: '60s' },
      { name: 'Crucifixo com Halter', sets: '3', reps: '15', rest: '45s' },
      { name: 'Tríceps Pulley', sets: '3', reps: '15', rest: '45s' },
      { name: 'Tríceps Testa', sets: '3', reps: '12', rest: '60s' },
      { name: 'Cardio — Esteira', sets: '1', reps: '20min', rest: '—' },
    ]
  },
  {
    day: 'Quarta', title: 'Costas & Bíceps', icon: '🏋️', tag: 'Treino B',
    exercises: [
      { name: 'Puxada Frontal', sets: '4', reps: '12', rest: '60s' },
      { name: 'Remada Curvada', sets: '4', reps: '12', rest: '60s' },
      { name: 'Rosca Direta', sets: '3', reps: '15', rest: '45s' },
      { name: 'Rosca Alternada', sets: '3', reps: '12', rest: '45s' },
      { name: 'Cardio — Bicicleta', sets: '1', reps: '15min', rest: '—' },
    ]
  },
  {
    day: 'Sexta', title: 'Pernas', icon: '🦵', tag: 'Treino C',
    exercises: [
      { name: 'Agachamento Livre', sets: '4', reps: '15', rest: '90s' },
      { name: 'Leg Press', sets: '4', reps: '15', rest: '90s' },
      { name: 'Cadeira Extensora', sets: '3', reps: '15', rest: '60s' },
      { name: 'Mesa Flexora', sets: '3', reps: '12', rest: '60s' },
      { name: 'Panturrilha', sets: '4', reps: '20', rest: '30s' },
    ]
  },
  {
    day: 'Sábado', title: 'Ombro & Abdômen', icon: '🔥', tag: 'Treino D',
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

export default function Workouts() {
  const [open, setOpen] = useState(null)
  const [done, setDone] = useState({})

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

  const todayIndex = [1, 3, 5, 6].indexOf(new Date().getDay())

  return (
    <div className="pb-24">

      <div className="px-5 pt-8 pb-6">
        <h1 className="text-white text-3xl font-black">Treinos.</h1>
        <p className="text-gray-500 text-sm mt-1">Plano personalizado semanal</p>
      </div>

      <div className="px-5 flex flex-col gap-4">
        {WORKOUTS.map((wt, wi) => (
          <div key={wi} className="rounded-2xl overflow-hidden" style={{ background: '#1A1A1A' }}>

            <div
              className="p-4 cursor-pointer"
              onClick={() => setOpen(open === wi ? null : wi)}
              style={wi === todayIndex ? { background: 'linear-gradient(135deg, #7C3AED22, #5B21B611)' } : {}}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
                    {wt.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-black">{wt.title}</p>
                      {wi === todayIndex && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{ background: 'rgba(124,58,237,0.3)', color: '#A78BFA' }}>
                          Hoje
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs">{wt.tag} · {wt.day} · {wt.exercises.length} exercícios</p>
                  </div>
                </div>
                <span className="text-gray-500">{open === wi ? '▲' : '▼'}</span>
              </div>
            </div>

            {open === wi && (
              <div style={{ borderTop: '1px solid #2A2A2A' }}>
                {wt.exercises.map((ex, ei) => (
                  <div key={ei} className="flex items-center gap-3 p-4"
                    style={{ borderBottom: '1px solid #2A2A2A' }}>
                    <button
                      onClick={() => toggleExercise(wi, ei)}
                      className="w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        background: done[`${wi}-${ei}`] ? '#7C3AED' : 'transparent',
                        borderColor: done[`${wi}-${ei}`] ? '#7C3AED' : '#2A2A2A'
                      }}
                    >
                      {done[`${wi}-${ei}`] && <span className="text-white text-xs font-black">✓</span>}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${done[`${wi}-${ei}`] ? 'text-gray-600 line-through' : 'text-white'}`}>
                        {ex.name}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">{ex.sets} séries · {ex.reps} reps · Descanso: {ex.rest}</p>
                    </div>
                  </div>
                ))}

                <div className="p-4">
                  {isWorkoutDone(wi) ? (
                    <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                      <p className="text-purple-400 font-black">✅ Treino concluído!</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => markAllDone(wi)}
                      className="w-full py-3 rounded-xl text-white font-black"
                      style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
                    >
                      Marcar tudo como concluído
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