// .frontend/src/components/Sidebar.jsx
import { useNavigate } from 'react-router-dom'
import { Logout, Play, Trophy } from 'pixelarticons/react'
import Perfil from '../assets/Perfil.png'

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


      <nav className="w-32 h-screen bg-[#292E4C] flex flex-col  relative z-30">
        {/* Picos decorativos estilo HUD */}
        <div className="bg-[#0E1535] border-b-2 border-[#42424D] p-2 h-19">
          {/* Detalle estético: El cuadradito en la esquina */}
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#4D61FF] group-hover:bg-[#BBC3FF] transition-colors"></div>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#4D61FF] group-hover:bg-[#BBC3FF] transition-colors"></div>
          

            <img src={Perfil} alt="Perfil" className="w-10 h-10 mx-auto pixelated" />


          <div className="text-center overflow-hidden">
            <p className="text-[7px] text-[#74768B] font-mono leading-none mb-1">UNIT_DATA</p>
            <p className="text-[#BBC3FF] font-black text-[10px] truncate uppercase tracking-tighter">
              {user.name || 'GUEST'}
            </p>
          </div>
        </div>
      

        <div className="absolute bottom-4 left-4 w-2 h-2 border-b-2 border-l-2 border-blue-500"></div>

        {/* Logo / Título */}

        {/* Botones de Navegación Verticales */}
        <div className="flex flex-col gap-4 flex-1 items-center justify-evenly relative">
          {[{icon: <Play />, label: 'PLAY'}, {icon: <Trophy />, label: 'RANK'}].map((item) => (
            <button 
              key={item.label}
              className="group relative flex items-center text-[#B9C1FD] hover:text-[#BBC3FF] transition-all cursor-pointer"
            >
              <div className="absolute left-[-1.7em] w-1 h-1 bg-[#BBC3FF] group-hover:h-full transition-all duration-300"></div>
              <div className="flex justify-center flex-col items-center gap-4">
                <span className="flex items-center">{item.icon}</span>
                <span className=" text-xl tracking-[0.3em] uppercase">{item.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Info del Usuario (Abajo, según tu boceto) */}
          <div className="p-4 mt-auto">
        <div className="relative">
          {/* Decoración de esquina inferior */}
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#4D61FF]/40"></div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex flex-col items-center gap-1 py-3 border border-red-500/20 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all group"
            title="DISCONNECT_SESSION"
          >
            <Logout size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="text-[8px] font-black tracking-widest uppercase">EJECT</span>
          </button>
        </div>
      </div>

      {/* Grid de fondo sutil solo para el sidebar */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-grid z-[-1]"></div>
    </nav>
      </section>
    </> // 2. CERRAMOS EL FRAGMENTO
  )
}