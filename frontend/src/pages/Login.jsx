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
    const data = await call('/users/login', {
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
    
    <section className="relative flex flex-col items-center justify-center h-screen bg-[#0D1230] bg-grid text-[#BBC3FF] overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-t from-[#0A0B14] via-transparent to-transparent opacity-80"></div>
      {/* Header */}
      
      <div className="text-center mb-8">
        {/* <img src={bannerImg} alt="Banner" /> */}
       {/*  <img className="w-32 h-32 mx-auto mb-4 border-2 border-[#74768B] shadow-[0_0_15px_rgba(116,118,139,0.3)]" src={logoImg} alt="Logo" /> */}
        
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl uppercase font-bold absolute tracking-tighter text-[#BBC3FF] drop-shadow-[0_0_8px_rgba(187,195,255,0.4)]" style={{ letterSpacing: '2px' }}>
            Prisma <span className="text-[#4D61FF] relative right-15 -top-7 text-xl">Crawler</span>
          </h1>
          <img className="w-16 h-16 relative left-35 top-3" src={personajeGif} alt="Personaje" />
        </div>
        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-[#74768B] to-transparent my-2"></div>
        
        <p className="text-[10px] tracking-[0.4em] uppercase">INITIALIZE LOGIN</p>
      </div>

      <div className="relative z-10 group">
        
        {/* Los Picos de la imagen (Esquinas interiores sólidas) */}
        {/* Top-Left */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-[3px] border-l-[3px] border-[#BBC3FF] z-20"></div>
        {/* Top-Right */}
        <div className="absolute top-2 right-2 w-3 h-3 border-t-[3px] border-r-[3px] border-[#BBC3FF] z-20"></div>
        {/* Bottom-Left */}
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-[3px] border-l-[3px] border-[#BBC3FF] z-20"></div>
        {/* Bottom-Right */}
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-[3px] border-r-[3px] border-[#BBC3FF] z-20"></div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-[#1D2240] p-8 border-4 border-[#74768B] w-96 shadow-lg">
        
        {/* MOSTRAR ERROR SI EXISTE */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 text-xs p-3 rounded mb-2">
            ERROR: {error.toUpperCase()}
          </div>
        )}
        {/* Email Input */}
        <div>
          <label className="block text-xs font-bold mb-2 tracking-widest" htmlFor="email">
            EMAIL LINK
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hero@dungeon.net"
            className="w-full px-4 py-3 bg-slate-900 border-2 border-[#2A2C3E] rounded text-[#6C72A0] text-sm placeholder-[#292A3C] focus:outline-none focus:border-[#6C72A0]"
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-xs font-bold mb-2 tracking-widest" htmlFor="password">
            SECRET CODE
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-slate-900 border-2 border-[#2A2C3E] rounded text-[#6C72A0] text-sm placeholder-[#292A3C] focus:outline-none focus:border-[#6C72A0]"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#BBC3FF] hover:bg-[#A8AFFF] text-slate-900 font-bold rounded border-2 border-[#5B628B] transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-widest text-sm uppercase"
        >
          {loading ? "INITIALIZING..." : "INITIALIZE LOGIN"}
        </button>

        {/* Forgot Password */}
        <a href="#" className=" text-xs text-center hover:text-[#BBC3FF] border-b border-[#3D3E4C] pb-1 tracking-widest">
          FORGOT SCROLL?
        </a>
      </form>
      </div>
    </section>
  )
}

export default Login