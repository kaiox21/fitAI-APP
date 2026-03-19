import { useNavigate } from 'react-router-dom'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#0F0F0F' }}>

      {/* Background com gradiente simulando imagem de academia */}
      <div className="flex-1 relative flex flex-col justify-end"
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f0f0f 100%)',
          minHeight: '70vh'
        }}>

        {/* Overlay escuro na parte de baixo */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, transparent 30%, #0F0F0F 100%)' }} />

        {/* Conteúdo */}
        <div className="relative px-6 pb-8">
          <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Bem-vindo ao
          </p>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '4rem', fontWeight: 900, lineHeight: 1, textTransform: 'uppercase', color: 'white' }}>
            THE PERFECT<br />
            <span style={{ color: '#A78BFA' }}>FITNESS APP</span>
          </h1>
          <p className="text-gray-400 mt-3 text-sm leading-relaxed">
            Conte calorias por foto, registre medidas e siga treinos personalizados com IA.
          </p>
        </div>
      </div>

      {/* Botões */}
      <div className="px-6 pb-12 flex flex-col gap-3" style={{ background: '#0F0F0F' }}>
        <button
          onClick={() => navigate('/register')}
          className="w-full py-4 rounded-full text-white font-bold text-lg uppercase tracking-wider"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.1rem', letterSpacing: '0.1em' }}
        >
          Start Training
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 rounded-full font-bold uppercase tracking-wider"
          style={{ background: 'transparent', border: '2px solid #2A2A2A', color: '#6B7280', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.1rem', letterSpacing: '0.1em' }}
        >
          Já tenho conta
        </button>
      </div>

    </div>
  )
}