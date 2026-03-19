import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const displayFont = { fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase' }

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)

export default function Diary() {
  const { meals, removeMeal, workoutLogs, removeWorkoutLog, totalKcal, totalBurned, dailyDeficit, user } = useApp()
  const navigate = useNavigate()
  const [dayOffset, setDayOffset] = useState(0)

  const getDate = (offset) => {
    const d = new Date()
    d.setDate(d.getDate() + offset)
    return d.toISOString().split('T')[0]
  }

  const selectedDate = getDate(dayOffset)
  const isToday = dayOffset === 0

  const dayMeals = meals.filter(m => m.date === selectedDate)
  const dayLogs = workoutLogs.filter(w => w.date === selectedDate)
  const dayConsumed = dayMeals.reduce((s, m) => s + m.kcal, 0)
  const dayBurned = dayLogs.reduce((s, w) => s + w.caloriesBurned, 0)
  const dayDeficit = dayBurned - dayConsumed

  const dateLabel = isToday ? 'Hoje' : new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return (
    <div className="pb-24">

      <div className="px-5 pt-8 pb-4">
        <p className="text-gray-500 text-xs uppercase tracking-widest">Registro completo</p>
        <h1 style={{ ...displayFont, fontSize: '2.2rem', fontWeight: 900, color: 'white', lineHeight: 1.1 }}>
          Histórico.
        </h1>
      </div>

      {/* Navegação de datas */}
      <div className="px-5 flex items-center justify-between mb-4">
        <button onClick={() => setDayOffset(d => d - 1)}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <p style={{ ...displayFont, fontSize: '0.9rem', fontWeight: 700, color: 'white', letterSpacing: '0.05em' }}>
          {dateLabel}
        </p>
        <button onClick={() => setDayOffset(d => Math.min(0, d + 1))}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', opacity: dayOffset === 0 ? 0.3 : 1 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Resumo do dia */}
      <div className="mx-5 rounded-2xl p-4 mb-5" style={{ background: '#1A1A1A' }}>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[
            { label: 'Consumido', value: dayConsumed, color: '#F87171' },
            { label: 'Queimado', value: dayBurned, color: '#34D399' },
            { label: 'Déficit', value: dayDeficit, color: dayDeficit >= 0 ? '#34D399' : '#F87171' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p style={{ ...displayFont, fontSize: '1.2rem', fontWeight: 900, color: item.color, lineHeight: 1 }}>
                {item.label === 'Déficit' && item.value > 0 ? '+' : ''}{item.value}
              </p>
              <p style={{ ...displayFont, fontSize: '0.6rem', color: '#6B7280', letterSpacing: '0.08em', marginTop: '3px' }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-full h-1.5" style={{ background: '#2A2A2A' }}>
          <div className="h-1.5 rounded-full transition-all"
            style={{ width: `${Math.min((dayConsumed / user.kcalGoal) * 100, 100)}%`, background: 'linear-gradient(90deg, #7C3AED, #A78BFA)' }} />
        </div>
      </div>

      {/* Refeições */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <p style={{ ...displayFont, fontSize: '1rem', fontWeight: 800, color: 'white' }}>Refeições</p>
          {isToday && (
            <button onClick={() => navigate('/home')}
              className="px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(124,58,237,0.3)', color: '#A78BFA', fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              + Adicionar
            </button>
          )}
        </div>

        {dayMeals.length === 0 ? (
          <div className="rounded-2xl p-5 text-center" style={{ background: '#1A1A1A' }}>
            <p className="text-gray-500 text-sm">Nenhuma refeição registrada</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#1A1A1A' }}>
            {dayMeals.map(meal => (
              <div key={meal.id} className="flex items-center justify-between p-4 border-b border-gray-800 last:border-0">
                <div className="flex-1">
                  <p className="text-white text-sm font-bold">{meal.name}</p>
                  <p style={{ ...displayFont, fontSize: '0.65rem', color: '#6B7280', letterSpacing: '0.05em', marginTop: '2px' }}>
                    {meal.time} &nbsp;·&nbsp; P:{meal.prot}g C:{meal.carb}g G:{meal.fat}g
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p style={{ ...displayFont, fontSize: '1rem', fontWeight: 700, color: '#A78BFA' }}>
                    {meal.kcal} kcal
                  </p>
                  <button onClick={() => {
                    if (window.confirm('Remover esta refeição?')) removeMeal(meal.id)
                  }}>
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Treinos */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <p style={{ ...displayFont, fontSize: '1rem', fontWeight: 800, color: 'white' }}>Treinos</p>
          {isToday && (
            <button onClick={() => navigate('/workouts')}
              className="px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(124,58,237,0.3)', color: '#A78BFA', fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              + Treinar
            </button>
          )}
        </div>

        {dayLogs.length === 0 ? (
          <div className="rounded-2xl p-5 text-center" style={{ background: '#1A1A1A' }}>
            <p className="text-gray-500 text-sm">Nenhum treino registrado</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#1A1A1A' }}>
            {dayLogs.map(log => (
              <div key={log.id} className="flex items-center justify-between p-4 border-b border-gray-800 last:border-0">
                <div className="flex-1">
                  <p className="text-white text-sm font-bold">{log.workout}</p>
                  <p style={{ ...displayFont, fontSize: '0.65rem', color: '#6B7280', letterSpacing: '0.05em', marginTop: '2px' }}>
                    {log.tag} &nbsp;·&nbsp; {log.exercises} exercícios
                    {log.cardio ? ` · ${log.cardio} ${log.cardioMinutes}min` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p style={{ ...displayFont, fontSize: '1rem', fontWeight: 700, color: '#34D399' }}>
                    {log.caloriesBurned} kcal
                  </p>
                  <button onClick={() => {
                    if (window.confirm('Remover este treino?')) removeWorkoutLog(log.id)
                  }}>
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}