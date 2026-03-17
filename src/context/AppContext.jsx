import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Atleta',
    age: 25,
    weight: 75,
    height: 175,
    sex: 'M',
    goal: 'loss',
    kcalGoal: 2000,
  })

  const [meals, setMeals] = useState([])

  function addMeal(meal) {
    setMeals(prev => [...prev, {
      ...meal,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }])
  }

  const totalKcal = meals.reduce((sum, m) => sum + m.kcal, 0)
  const totalProt = meals.reduce((sum, m) => sum + m.prot, 0)
  const totalCarb = meals.reduce((sum, m) => sum + m.carb, 0)
  const totalFat = meals.reduce((sum, m) => sum + m.fat, 0)

  return (
    <AppContext.Provider value={{
      user, setUser,
      meals, addMeal,
      totalKcal, totalProt, totalCarb, totalFat,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}