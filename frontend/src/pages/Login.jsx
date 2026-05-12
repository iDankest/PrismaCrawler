// .frontend/src/pages/Login.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { LoadingScreen } from '../components/loading'
import logoImg from '../assets/Logo.png'
import personajeGif from '../assets/Personaje.gif'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const navigate = useNavigate()
  const { call } = useApi()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login'
      const response = await call(endpoint, {
        method: 'POST',
        body: { email, password }
      })

      // Guardar token y usuario
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      // Espera un poco y navega
      setTimeout(() => {
        navigate('/game')
      }, 2000)

    } catch (err) {
      setLoading(false)
      setError(err.message || 'Error al conectar con el servidor')
    }
  }

  // Si está loading, muestra el componente
  if (loading) {
    return <LoadingScreen />
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-slate-900 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <img 
          className="w-32 h-32 mx-auto mb-6 rounded-sm border-2 border-blue-600 shadow-lg" 
          src={logoImg} 
          alt="Logo" 
        />
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <div>
            <h1 className="text-5xl font-bold text-blue-300" style={{ letterSpacing: '3px' }}>
              PRISMA
            </h1>
            <p className="text-2xl font-bold text-blue-400" style={{ letterSpacing: '2px' }}>
              CRAWLER
            </p>
          </div>
          <img className="w-20 h-20" src={personajeGif} alt="Personaje" />
        </div>
        
        <p className="text-blue-200 text-xs tracking-widest font-semibold">INITIALIZE LOGIN</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-blue-900 p-8 rounded-xl border-4 border-blue-500 w-full max-w-md shadow-2xl">
        
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-900 border-2 border-red-500 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Email Input */}
        <div>
          <label className="block text-blue-200 text-xs font-bold mb-3 tracking-widest" htmlFor="email">
            EMAIL LINK
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hero@dungeon.net"
            className="w-full px-4 py-3 bg-slate-900 border-2 border-blue-500 rounded text-blue-300 text-sm placeholder-blue-600 focus:outline-none focus:border-blue-300"
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-blue-200 text-xs font-bold mb-3 tracking-widest" htmlFor="password">
            SECRET CODE
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-slate-900 border-2 border-blue-500 rounded text-blue-300 text-sm placeholder-blue-600 focus:outline-none focus:border-blue-300"
            required
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-slate-900 font-bold rounded-lg border-2 border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-widest text-sm uppercase shadow-lg"
        >
          {loading ? 'INITIALIZING...' : isRegistering ? 'CREATE ACCOUNT' : 'INITIALIZE LOGIN'}
        </button>

        {/* Toggle Register/Login */}
        <button
          type="button"
          onClick={() => {
            setIsRegistering(!isRegistering)
            setError(null)
          }}
          className="text-blue-300 text-xs text-center hover:text-blue-200 border-b-2 border-blue-400 hover:border-blue-300 pb-1 tracking-widest transition"
        >
          {isRegistering ? 'Already have an account? LOGIN' : 'New player? REGISTER'}
        </button>

        {/* Forgot Password */}
        {!isRegistering && (
          <a href="#" className="text-blue-300 text-xs text-center hover:text-blue-200 border-b-2 border-blue-400 pb-1 tracking-widest">
            FORGOT SCROLL?
          </a>
        )}
      </form>
    </section>
  )
}

export default Login