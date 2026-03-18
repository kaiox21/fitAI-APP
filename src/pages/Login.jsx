import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  function handleLogin() {
    navigate('/home')
  }

  return (
    <div className="min-h-screen flex flex-col px-8 pt-16" style={{ background: '#0F0F0F' }}>
      <button onClick={() => navigate('/')} className="text-gray-500 text-sm mb-8">← Voltar</button>

      <h1 className="text-white text-4xl font-black mb-2">Entrar.</h1>
      <p className="text-gray-500 text-sm mb-10">Bem-vindo de volta!</p>

      <div className="flex flex-col gap-4 mb-8">
        <div>
          <p className="text-gray-500 text-xs mb-2">Email</p>
          <input
            type="email"
            placeholder="seu@email.com"
            className="w-full rounded-2xl px-4 py-4 outline-none text-white"
            style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          />
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-2">Senha</p>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-2xl px-4 py-4 outline-none text-white"
            style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          />
        </div>
      </div>

      <button
        onClick={handleLogin}
        className="w-full py-4 rounded-2xl text-white font-black text-lg mb-4"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
      >
        Entrar
      </button>

      <p className="text-center text-gray-500 text-sm">
        Não tem conta?{' '}
        <span className="text-purple-400 font-bold cursor-pointer" onClick={() => navigate('/register')}>
          Criar conta
        </span>
      </p>
    </div>
  )
}