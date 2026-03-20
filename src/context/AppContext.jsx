import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext()

function calcTMB(user) {
  const w = parseFloat(user.weight)
  const h = parseFloat(user.height)
  const a = parseInt(user.age)
  if (user.sex === 'M') return 88.36 + 13.4 * w + 4.8 * h - 5.7 * a
  return 447.6 + 9.2 * w + 3.1 * h - 4.3 * a
}

// Calorias que o corpo queima só existindo + atividades do dia a dia (sem treino)
function calcTDEEBase(user) {
  return Math.round(calcTMB(user) * 1.2)
}

// TDEE com fator de atividade do perfil
function calcTDEEActivity(user) {
  return Math.round(calcTMB(user) * (parseFloat(user.activity) || 1.55))
}

// Calorias que pode consumir = TDEE com atividade ± ajuste de objetivo
function calcKcalAllowed(user) {
  const tdee = calcTDEEActivity(user)
  if (user.goal === 'loss') return tdee - 500
  if (user.goal === 'gain') return tdee + 300
  return tdee
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [meals, setMeals] = useState([])
  const [measures, setMeasures] = useState([])
  const [workoutLogs, setWorkoutLogs] = useState([])
  const [loading, setLoading] = useState(true)

  // Ao iniciar, verifica se há sessão ativa no Supabase e carrega perfil do banco
  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await loadProfile(session.user.id, session.user.email)
      } else {
        setLoading(false)
      }
    }
    init()

    // Listener para mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadProfile(session.user.id, session.user.email)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setMeals([])
        setMeasures([])
        setWorkoutLogs([])
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Carrega perfil do banco
  async function loadProfile(userId, email) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (!error && profile) {
        setUser({
          id: profile.id,
          name: profile.name,
          email: email,
          age: profile.age,
          weight: profile.weight,
          height: profile.height,
          sex: profile.sex,
          goal: profile.goal,
          activity: profile.activity,
          kcalGoal: profile.kcal_goal,
        })
        await loadData(userId)
      } else {
        setLoading(false)
      }
    } catch (err) {
      console.error('Erro ao carregar perfil:', err)
      setLoading(false)
    }
  }

  // Carrega refeições, medidas e treinos do banco
  async function loadData(userId) {
    setLoading(true)
    try {
      const [mealsRes, measuresRes, logsRes] = await Promise.all([
        supabase.from('meals').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('measures').select('*').eq('user_id', userId).order('date', { ascending: true }),
        supabase.from('workout_logs').select('*').eq('user_id', userId).order('date', { ascending: false }),
      ])

      if (mealsRes.data) setMeals(mealsRes.data.map(m => ({
        id: m.id, name: m.name, kcal: m.kcal, prot: m.prot,
        carb: m.carb, fat: m.fat, type: m.type, date: m.date, time: m.time
      })))

      if (measuresRes.data) setMeasures(measuresRes.data.map(m => ({
        id: m.id, weight: m.weight, waist: m.waist, arm: m.arm,
        chest: m.chest, leg: m.leg, date: m.date
      })))

      if (logsRes.data) setWorkoutLogs(logsRes.data.map(l => ({
        id: l.id, workout: l.workout, tag: l.tag, exercises: l.exercises,
        cardio: l.cardio, cardioMinutes: l.cardio_minutes,
        caloriesBurned: l.calories_burned, duration: l.duration, date: l.date
      })))
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addMeal(meal) {
    const hour = new Date().getHours()
    let type = 'Lanche'
    if (hour >= 6 && hour < 10) type = 'Café da manhã'
    else if (hour >= 11 && hour < 15) type = 'Almoço'
    else if (hour >= 18 && hour < 22) type = 'Jantar'

    const date = new Date().toISOString().split('T')[0]
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    const { data, error } = await supabase.from('meals').insert({
      user_id: user.id,
      name: meal.name, kcal: meal.kcal, prot: meal.prot,
      carb: meal.carb, fat: meal.fat, type, date, time
    }).select().single()

    if (!error && data) {
      setMeals(prev => [...prev, {
        id: data.id, name: data.name, kcal: data.kcal, prot: data.prot,
        carb: data.carb, fat: data.fat, type: data.type, date: data.date, time: data.time
      }])
    }
  }

  async function removeMeal(id) {
    await supabase.from('meals').delete().eq('id', id)
    setMeals(prev => prev.filter(m => m.id !== id))
  }

  async function addMeasure(entry) {
    const date = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase.from('measures').insert({
      user_id: user.id,
      weight: entry.weight, waist: entry.waist, arm: entry.arm,
      chest: entry.chest, leg: entry.leg, date
    }).select().single()

    if (!error && data) {
      setMeasures(prev => [...prev, {
        id: data.id, weight: data.weight, waist: data.waist, arm: data.arm,
        chest: data.chest, leg: data.leg, date: data.date
      }])
    }
  }

  async function addWorkoutLog(log) {
    const date = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase.from('workout_logs').insert({
      user_id: user.id,
      workout: log.workout, tag: log.tag, exercises: log.exercises,
      cardio: log.cardio, cardio_minutes: log.cardioMinutes,
      calories_burned: log.caloriesBurned, duration: log.duration, date
    }).select().single()

    if (!error && data) {
      setWorkoutLogs(prev => [...prev, {
        id: data.id, workout: data.workout, tag: data.tag, exercises: data.exercises,
        cardio: data.cardio, cardioMinutes: data.cardio_minutes,
        caloriesBurned: data.calories_burned, duration: data.duration, date: data.date
      }])
    }
  }

  async function removeWorkoutLog(id) {
    await supabase.from('workout_logs').delete().eq('id', id)
    setWorkoutLogs(prev => prev.filter(w => w.id !== id))
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
    setMeals([])
    setMeasures([])
    setWorkoutLogs([])
  }

  const today = new Date().toISOString().split('T')[0]
  const todayMeals = meals.filter(m => m.date === today)
  const todayLogs = workoutLogs.filter(w => w.date === today)

  const totalKcal = todayMeals.reduce((sum, m) => sum + m.kcal, 0)
  const totalProt = todayMeals.reduce((sum, m) => sum + m.prot, 0)
  const totalCarb = todayMeals.reduce((sum, m) => sum + m.carb, 0)
  const totalFat = todayMeals.reduce((sum, m) => sum + m.fat, 0)

  const burnedFromWorkout = todayLogs.reduce((sum, w) => sum + w.caloriesBurned, 0)

  // Queimado: só metabolismo + dia a dia (sem treino)
  const tdeeBase = user ? calcTDEEBase(user) : 0

  // Restante: TDEE com atividade ± objetivo + treino real - já consumido
  const kcalAllowed = user ? calcKcalAllowed(user) + burnedFromWorkout : 0
  const remaining = Math.max(kcalAllowed - totalKcal, 0)

  // Déficit real: (metabolismo + treino real) - consumido
  const totalBurned = tdeeBase + burnedFromWorkout
  const dailyDeficit = totalBurned - totalKcal

  // Meta calórica base (sem treino do dia)
  const kcalGoal = user ? calcKcalAllowed(user) : 0

  // Dados semanais
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().split('T')[0]
    const dayMeals = meals.filter(m => m.date === key)
    const dayLogs = workoutLogs.filter(w => w.date === key)
    const consumed = dayMeals.reduce((s, m) => s + m.kcal, 0)
    const workoutBurned = dayLogs.reduce((s, w) => s + w.caloriesBurned, 0)
    const hasData = dayMeals.length > 0 || dayLogs.length > 0
    const burned = hasData ? (user ? calcTDEEBase(user) : 0) + workoutBurned : 0
    return { date: key, consumed, burned, deficit: hasData ? burned - consumed : 0 }
  })

  return (
    <AppContext.Provider value={{
      user, setUser,
      meals, addMeal, removeMeal,
      measures, addMeasure,
      workoutLogs, addWorkoutLog, removeWorkoutLog,
      totalKcal, totalProt, totalCarb, totalFat,
      burnedFromWorkout, totalBurned, tdeeBase,
      remaining, kcalGoal, dailyDeficit,
      weeklyData, loading, logout,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}