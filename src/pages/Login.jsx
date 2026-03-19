import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'

export default function Login() {
  const navigate = useNavigate()
  const { setUser } = useApp()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const inputStyle = {
    background: 'transparent',
    borderBottom: '1px solid #3A3A3A',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderRadius: 0,
    color: 'white',
    padding: '12px 0',
    width: '100%',
    outline: 'none',
    fontSize: '1rem',
  }

  async function handleLogin() {
    if (!form.email || !form.password) {
      setError('Preencha todos os campos.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })

      if (authError) {
        setError('Email ou senha incorretos.')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile) {
        setError('Perfil não encontrado.')
        return
      }

      setUser({
        id: profile.id,
        name: profile.name,
        email: form.email,
        age: profile.age,
        weight: profile.weight,
        height: profile.height,
        sex: profile.sex,
        goal: profile.goal,
        activity: profile.activity,
        kcalGoal: profile.kcal_goal,
      })

      navigate('/home')
    } catch (_error) {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col px-6 pt-12 pb-8" style={{ background: '#0F0F0F' }}>

      <button onClick={() => navigate('/')} className="text-gray-500 text-xl mb-12">←</button>

      <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', color: 'white', marginBottom: '2rem' }}>
        Login to Your<br />Account
      </h1>

      <div className="flex flex-col gap-6 flex-1">
        <div>
          <p className="text-gray-500 text-xs mb-2 uppercase tracking-widest">Email</p>
          <input
            type="email"
            placeholder="seu@email.com"
            style={inputStyle}
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          />
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-2 uppercase tracking-widest">Senha</p>
          <input
            type="password"
            placeholder="••••••••"
            style={inputStyle}
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          />
        </div>

        {error && (
          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.85rem', color: '#F87171', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {error}
          </p>
        )}
      </div>

      <div className="mt-auto">
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 rounded-full text-white font-bold mb-4 transition-all"
          style={{ background: loading ? '#4B5563' : 'linear-gradient(135deg, #7C3AED, #5B21B6)', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
        >
          {loading ? 'Entrando...' : 'Sign In'}
        </button>

        <p className="text-center text-gray-500 text-sm">
          Não tem conta?{' '}
          <span className="font-bold cursor-pointer" style={{ color: '#A78BFA' }}
            onClick={() => navigate('/register')}>
            Sign up
          </span>
        </p>
      </div>

    </div>
  )
}