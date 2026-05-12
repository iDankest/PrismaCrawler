// .frontend/src/pages/Login.jsx

import { useState } from 'react'
import { LoadingScreen } from '../components/loading'
import logoImg from '../assets/Logo.png'
import personajeGif from '../assets/Personaje.gif'
import {useNavigate} from 'react-router-dom'
import { useApi } from '../hooks/useApi.js'

function Login() {
const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  
  // 2. Inicializamos el hook
  const { call, loading, error } = useApi()
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Limpiamos errores previos si los hay
  console.log("🚀 Intentando login para:", email);

  try {
    const data = await call('/api/users/login', {
      method: 'POST',
      body: { email, password }
    });

    console.log("✅ Respuesta del servidor:", data);

    if (data && data.token) {
      localStorage.setItem('token', data.token);
      navigate('/game');
    }
  } catch (err) {
    // El hook useApi ya gestiona el error, pero forzamos un log aquí
    console.error("❌ Fallo crítico en el login:", err.message);
  }
};

  /* if (loading) return <LoadingScreen /> */

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        {/* <img src={bannerImg} alt="Banner" /> */}
        <img className="w-32 h-32 mx-auto mb-4 rounded-sm border-2 border-blue-600" src={logoImg} alt="Logo" />
        
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl uppercase font-bold text-blue-300 absolute" style={{ letterSpacing: '2px' }}>
            Prisma <span className="text-blue-500 relative right-15 -top-7 text-xl">Crawler</span>
          </h1>
          <img className="w-16 h-16 relative left-35 top-3" src={personajeGif} alt="Personaje" />
        </div>
        
        <p className="text-blue-200 text-xs tracking-widest">INITIALIZE LOGIN</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-blue-900 p-8 rounded-lg border-4 border-blue-600 w-96 shadow-lg">
        
        {/* MOSTRAR ERROR SI EXISTE */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 text-xs p-3 rounded mb-2">
            ERROR: {error.toUpperCase()}
          </div>
        )}
        {/* Email Input */}
        <div>
          <label className="block text-blue-300 text-xs font-bold mb-2 tracking-widest" htmlFor="email">
            EMAIL LINK
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hero@dungeon.net"
            className="w-full px-4 py-3 bg-slate-900 border-2 border-blue-600 rounded text-blue-400 text-sm placeholder-blue-700 focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-blue-300 text-xs font-bold mb-2 tracking-widest" htmlFor="password">
            SECRET CODE
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-slate-900 border-2 border-blue-600 rounded text-blue-400 text-sm placeholder-blue-700 focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-slate-900 font-bold rounded border-2 border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-widest text-sm uppercase"
        >
          {loading ? "INITIALIZING..." : "INITIALIZE LOGIN"}
        </button>

        {/* Forgot Password */}
        <a href="#" className="text-blue-400 text-xs text-center hover:text-blue-300 border-b border-blue-400 pb-1 tracking-widest">
          FORGOT SCROLL?
        </a>
      </form>
    </section>
  )
}

export default Login