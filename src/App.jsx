import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Diary from './pages/Diary'
import Measures from './pages/Measures'
import Workouts from './pages/Workouts'
import Profile from './pages/Profile'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Register from './pages/Register'
import BottomNav from './components/BottomNav'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={
          <div className="bg-dark min-h-screen max-w-md mx-auto relative">
            <Home />
            <BottomNav />
          </div>
        } />
        <Route path="/diary" element={
          <div className="bg-dark min-h-screen max-w-md mx-auto relative">
            <Diary />
            <BottomNav />
          </div>
        } />
        <Route path="/measures" element={
          <div className="bg-dark min-h-screen max-w-md mx-auto relative">
            <Measures />
            <BottomNav />
          </div>
        } />
        <Route path="/workouts" element={
          <div className="bg-dark min-h-screen max-w-md mx-auto relative">
            <Workouts />
            <BottomNav />
          </div>
        } />
        <Route path="/profile" element={
          <div className="bg-dark min-h-screen max-w-md mx-auto relative">
            <Profile />
            <BottomNav />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}