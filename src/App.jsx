import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Diary from './pages/Diary'
import Measures from './pages/Measures'
import Workouts from './pages/Workouts'
import Profile from './pages/Profile'
import BottomNav from './components/BottomNav'

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-950 min-h-screen max-w-md mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/measures" element={<Measures />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}