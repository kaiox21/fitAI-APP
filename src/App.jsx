import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Home from './pages/Home'
import Diary from './pages/Diary'
import Measures from './pages/Measures'
import Workouts from './pages/Workouts'
import Profile from './pages/Profile'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Register from './pages/Register'
import BottomNav from './components/BottomNav'

function PrivateRoute({ children }) {
  const { user } = useApp()
  return user ? (
    <div className="min-h-screen max-w-md mx-auto relative" style={{ background: '#0F0F0F' }}>
      {children}
      <BottomNav />
    </div>
  ) : <Navigate to="/" />
}

function PublicRoute({ children }) {
  const { user } = useApp()
  return !user ? children : <Navigate to="/home" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><Welcome /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/diary" element={<PrivateRoute><Diary /></PrivateRoute>} />
        <Route path="/measures" element={<PrivateRoute><Measures /></PrivateRoute>} />
        <Route path="/workouts" element={<PrivateRoute><Workouts /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}