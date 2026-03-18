import { useNavigate } from 'react-router-dom'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0F0F0F' }}>

      {/* Top gradient */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-8"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}>
          🏋️
        </div>

        <h1 className="text-white text-5xl font-black mb-2">FitAI</h1>
        <p className="text-gray-500 text-lg mb-2">Sua evolução começa aqui.</p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Conte calorias por foto, registre medidas e siga treinos personalizados com IA.
        </p>
      </div>

      {/* Buttons */}
      <div className="px-8 pb-12 flex flex-col gap-3">
        <button
          onClick={() => navigate('/register')}
          className="w-full py-4 rounded-2xl text-white font-black text-lg"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
        >
          Criar conta
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg"
          style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
        >
          Já tenho conta
        </button>
      </div>

    </div>
  )
}