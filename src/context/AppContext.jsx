import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

function calcTMB(user) {
  const w = parseFloat(user.weight)
  const h = parseFloat(user.height)
  const a = parseInt(user.age)
  if (user.sex === 'M') return 88.36 + 13.4 * w + 4.8 * h - 5.7 * a
  return 447.6 + 9.2 * w + 3.1 * h - 4.3 * a
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fitai_user')
    return saved ? JSON.parse(saved) : null
  })

  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem('fitai_meals')
    return saved ? JSON.parse(saved) : []
  })

  const [measures, setMeasures] = useState(() => {
    const saved = localStorage.getItem('fitai_measures')
    return saved ? JSON.parse(saved) : []
  })

  const [workoutLogs, setWorkoutLogs] = useState(() => {
    const saved = localStorage.getItem('fitai_workoutlogs')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => { localStorage.setItem('fitai_user', JSON.stringify(user)) }, [user])
  useEffect(() => { localStorage.setItem('fitai_meals', JSON.stringify(meals)) }, [meals])
  useEffect(() => { localStorage.setItem('fitai_measures', JSON.stringify(measures)) }, [measures])
  useEffect(() => { localStorage.setItem('fitai_workoutlogs', JSON.stringify(workoutLogs)) }, [workoutLogs])

  function addMeal(meal) {
    const hour = new Date().getHours()
    let type = 'Lanche'
    if (hour >= 6 && hour < 10) type = 'Café da manhã'
    else if (hour >= 11 && hour < 15) type = 'Almoço'
    else if (hour >= 18 && hour < 22) type = 'Jantar'
    setMeals(prev => [...prev, {
      ...meal, id: Date.now(), type,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }])
  }

  function removeMeal(id) {
    setMeals(prev => prev.filter(m => m.id !== id))
  }

  function addMeasure(entry) {
    setMeasures(prev => [...prev, { ...entry, date: new Date().toISOString().split('T')[0] }])
  }

  function addWorkoutLog(log) {
    setWorkoutLogs(prev => [...prev, { ...log, date: new Date().toISOString().split('T')[0], id: Date.now() }])
  }

  function removeWorkoutLog(id) {
    setWorkoutLogs(prev => prev.filter(w => w.id !== id))
  }

  function logout() {
    setUser(null)
    setMeals([])
    setMeasures([])
    setWorkoutLogs([])
    localStorage.clear()
  }

  const today = new Date().toISOString().split('T')[0]
  const todayMeals = meals.filter(m => m.date === today)
  const todayLogs = workoutLogs.filter(w => w.date === today)

  const totalKcal = todayMeals.reduce((sum, m) => sum + m.kcal, 0)
  const totalProt = todayMeals.reduce((sum, m) => sum + m.prot, 0)
  const totalCarb = todayMeals.reduce((sum, m) => sum + m.carb, 0)
  const totalFat = todayMeals.reduce((sum, m) => sum + m.fat, 0)

  // Calorias queimadas no treino
  const burnedFromWorkout = todayLogs.reduce((sum, w) => sum + w.caloriesBurned, 0)

  // Gasto real = TMB × 1.2 (corpo existindo, sem contar treino) + treino feito
  const tdeeBase = user ? Math.round(calcTMB(user) * 1.2) : 0
  const totalBurned = tdeeBase + burnedFromWorkout

  // Déficit = gasto real - consumido
  const dailyDeficit = totalBurned - totalKcal

  // Dados semanais
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().split('T')[0]
    const dayMeals = meals.filter(m => m.date === key)
    const dayLogs = workoutLogs.filter(w => w.date === key)
    const consumed = dayMeals.reduce((s, m) => s + m.kcal, 0)
    const burned = (user ? Math.round(calcTMB(user) * 1.2) : 0)
      + dayLogs.reduce((s, w) => s + w.caloriesBurned, 0)
    return { date: key, consumed, burned, deficit: burned - consumed }
  })

  return (
    <AppContext.Provider value={{
      user, setUser,
      meals, addMeal, removeMeal,
      measures, addMeasure,
      workoutLogs, addWorkoutLog, removeWorkoutLog,
      totalKcal, totalProt, totalCarb, totalFat,
      burnedFromWorkout, totalBurned, tdeeBase, dailyDeficit,
      weeklyData, logout,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}