// .frontend/src/components/Sidebar.jsx
import { useNavigate } from 'react-router-dom'

export default function Sidebar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    // 1. AÑADIMOS EL FRAGMENTO PARA ENVOLVER TODO
    <>
    <section className="flex ">


      <nav className="w-64 h-screen bg-[#0D1230] flex flex-col p-6 relative z-30 border-r-1 border-[#74768B]">
        {/* Picos decorativos estilo HUD */}
        <div className="absolute top-4 left-4 w-2 h-2 border-t-2 border-l-2 border-blue-500"></div>
        <div className="absolute bottom-4 left-4 w-2 h-2 border-b-2 border-l-2 border-blue-500"></div>

        {/* Logo / Título */}
        <div className="mb-12">
          <h2 className="text-[#BBC3FF] font-black text-xl tracking-tighter uppercase leading-none">
            PRISMA<br/>
            <span className="text-[#4D61FF] text-sm">CRAWLER</span>
          </h2>
          <div className="w-full h-[1px] bg-gradient-to-r from-[#74768B] to-transparent mt-4"></div>
        </div>

        {/* Botones de Navegación Verticales */}
        <div className="flex flex-col gap-4 flex-1">
          {['PLAY', 'ITEMS', 'RANK', 'INFO'].map((item) => (
            <button 
              key={item}
              className="group relative flex items-center p-3 text-[#74768B] hover:text-[#BBC3FF] transition-all"
            >
              <div className="absolute left-0 w-1 h-0 bg-[#BBC3FF] group-hover:h-full transition-all duration-300"></div>
              <span className="font-mono text-xs tracking-[0.3em] ml-4 uppercase">{item}</span>
            </button>
          ))}
        </div>

        {/* Info del Usuario (Abajo, según tu boceto) */}
        <div className="mt-auto pt-6 border-t border-[#74768B]/30">
          <div className="bg-[#1D2240] p-4 border border-[#74768B]/50 relative">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#BBC3FF]"></div>
            
            <p className="text-[9px] text-[#74768B] font-mono mb-1">OPERATOR_ID</p>
            <p className="text-[#BBC3FF] font-bold text-xs truncate mb-4">
              {user.name?.toUpperCase() || 'GUEST_UNIT'}
            </p>
            
            <button 
              onClick={handleLogout}
              className="w-full py-2 bg-red-900/20 border border-red-500/40 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              Terminate_Session
            </button>
          </div>
        </div>
      </nav>

{/*           <header className="w-[100vw] h-10 bg-[#0D1230] border-b-4 border-[#74768B] p-4 flex justify-between items-center bg-grid relative overflow-hidden">

      <div className="absolute inset-0 bg-blue-500/5 opacity-50"></div>
      

      <div className="flex items-center gap-4 z-10">
        <span className="text-blue-300 font-mono text-[10px] tracking-widest bg-blue-950/50 px-3 py-1 border border-blue-800/50">
          USER: {user.name?.toUpperCase() || 'UNKNOWN_UNIT'}
        </span>
        <button onClick={handleLogout} className="px-4 py-1.5 bg-red-900/20 border border-red-500/50 text-red-400 text-[10px] font-bold hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest">
          Disconnect
        </button>
      </div>
    </header> */}
      </section>
    </> // 2. CERRAMOS EL FRAGMENTO
  )
}