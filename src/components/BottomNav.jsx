import { useNavigate, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname

  const items = [
    { label: 'Início', icon: '🏠', route: '/home' },
    { label: 'Diário', icon: '📖', route: '/diary' },
    { label: 'Foto', icon: '📸', route: '/camera' },
    { label: 'Medidas', icon: '📏', route: '/measures' },
    { label: 'Treinos', icon: '🏋️', route: '/workouts' },
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gray-900 border-t border-gray-800 flex justify-around items-center px-2 py-3">
      {items.map(item => (
        <button
          key={item.route}
          onClick={() => navigate(item.route)}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
            path === item.route ? 'text-green-400' : 'text-gray-500'
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}