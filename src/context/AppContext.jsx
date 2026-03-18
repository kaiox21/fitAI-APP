import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

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

  useEffect(() => {
    localStorage.setItem('fitai_user', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem('fitai_meals', JSON.stringify(meals))
  }, [meals])

  useEffect(() => {
    localStorage.setItem('fitai_measures', JSON.stringify(measures))
  }, [measures])

  function addMeal(meal) {
    const hour = new Date().getHours()
    let type = 'Lanche'
    if (hour >= 6 && hour < 10) type = 'Café da manhã'
    else if (hour >= 11 && hour < 15) type = 'Almoço'
    else if (hour >= 18 && hour < 22) type = 'Jantar'

    setMeals(prev => [...prev, {
      ...meal,
      id: Date.now(),
      type,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }])
  }

  function addMeasure(entry) {
    setMeasures(prev => [...prev, {
      ...entry,
      date: new Date().toISOString().split('T')[0]
    }])
  }

  function logout() {
    setUser(null)
    setMeals([])
    setMeasures([])
    localStorage.clear()
  }

  const today = new Date().toISOString().split('T')[0]
  const todayMeals = meals.filter(m => m.date === today)

  const totalKcal = todayMeals.reduce((sum, m) => sum + m.kcal, 0)
  const totalProt = todayMeals.reduce((sum, m) => sum + m.prot, 0)
  const totalCarb = todayMeals.reduce((sum, m) => sum + m.carb, 0)
  const totalFat = todayMeals.reduce((sum, m) => sum + m.fat, 0)

  return (
    <AppContext.Provider value={{
      user, setUser,
      meals, addMeal,
      measures, addMeasure,
      totalKcal, totalProt, totalCarb, totalFat,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}