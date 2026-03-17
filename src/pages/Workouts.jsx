import { useState } from 'react'

const WORKOUTS = [
  {
    day: 'Segunda', title: 'Treino A — Peito & Tríceps', icon: '💪',
    exercises: [
      { name: 'Supino Reto', sets: '4', reps: '12', rest: '60s' },
      { name: 'Crucifixo com Halter', sets: '3', reps: '15', rest: '45s' },
      { name: 'Tríceps Pulley', sets: '3', reps: '15', rest: '45s' },
      { name: 'Tríceps Testa', sets: '3', reps: '12', rest: '60s' },
      { name: 'Cardio — Esteira', sets: '1', reps: '20min', rest: '—' },
    ]
  },
  {
    day: 'Quarta', title: 'Treino B — Costas & Bíceps', icon: '🏋️',
    exercises: [
      { name: 'Puxada Frontal', sets: '4', reps: '12', rest: '60s' },
      { name: 'Remada Curvada', sets: '4', reps: '12', rest: '60s' },
      { name: 'Rosca Direta', sets: '3', reps: '15', rest: '45s' },
      { name: 'Rosca Alternada', sets: '3', reps: '12', rest: '45s' },
      { name: 'Cardio — Bicicleta', sets: '1', reps: '15min', rest: '—' },
    ]
  },
  {
    day: 'Sexta', title: 'Treino C — Pernas', icon: '🦵',
    exercises: [
      { name: 'Agachamento Livre', sets: '4', reps: '15', rest: '90s' },
      { name: 'Leg Press', sets: '4', reps: '15', rest: '90s' },
      { name: 'Cadeira Extensora', sets: '3', reps: '15', rest: '60s' },
      { name: 'Mesa Flexora', sets: '3', reps: '12', rest: '60s' },
      { name: 'Panturrilha', sets: '4', reps: '20', rest: '30s' },
    ]
  },
  {
    day: 'Sábado', title: 'Treino D — Ombro & Abdômen', icon: '🔥',
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

  return (
    <div className="p-4 pb-24">
      <h1 className="text-white text-xl font-bold mb-6">Treinos</h1>

      {WORKOUTS.map((wt, wi) => (
        <div key={wi} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-4">

          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setOpen(open === wi ? null : wi)}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{wt.icon}</span>
              <div>
                <p className="text-white font-bold">{wt.title}</p>
                <p className="text-gray-400 text-xs">{wt.day} · {wt.exercises.length} exercícios</p>
              </div>
            </div>
            <span className="text-gray-400">{open === wi ? '▲' : '▼'}</span>
          </div>

          {open === wi && (
            <div className="border-t border-gray-800">
              {wt.exercises.map((ex, ei) => (
                <div key={ei} className="flex items-center gap-3 p-3 border-b border-gray-800 last:border-0">
                  <button
                    onClick={() => toggleExercise(wi, ei)}
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      done[`${wi}-${ei}`] ? 'bg-green-400 border-green-400' : 'border-gray-600'
                    }`}
                  >
                    {done[`${wi}-${ei}`] && <span className="text-black text-xs font-bold">✓</span>}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${done[`${wi}-${ei}`] ? 'text-gray-500 line-through' : 'text-white'}`}>
                      {ex.name}
                    </p>
                    <p className="text-gray-400 text-xs">{ex.sets} séries · {ex.reps} reps · Descanso: {ex.rest}</p>
                  </div>
                </div>
              ))}

              <div className="p-4">
                {isWorkoutDone(wi) ? (
                  <div className="bg-green-400 bg-opacity-10 border border-green-400 border-opacity-30 rounded-xl p-3 text-center">
                    <p className="text-green-400 font-bold">✅ Treino concluído!</p>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      WORKOUTS[wi].exercises.forEach((_, ei) => {
                        setDone(prev => ({ ...prev, [`${wi}-${ei}`]: true }))
                      })
                    }}
                    className="w-full py-3 bg-green-400 text-black font-bold rounded-xl"
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
  )
}