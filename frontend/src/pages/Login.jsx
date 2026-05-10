import { useState } from 'react'
import { LoadingScreen } from '../components/loading'
import logoImg from '../assets/Logo.png'
import personajeGif from '../assets/Personaje.gif'
import {useNavigate} from 'react-router-dom'
/* import bannerImg from '../assets/BannerPlay.png'
 */function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simula login (luego será tu API)
    setTimeout(() => {
      setLoading(false)
      // Navega a /game o lo que sea
      navigate('/game')
    }, 2000)
  }

  // Si está loading, muestra el componente
  if (loading) {
    return <LoadingScreen />
  }

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