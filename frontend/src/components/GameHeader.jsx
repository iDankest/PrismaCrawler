// .frontend/src/components/GameHeader.jsx

import { useNavigate } from 'react-router-dom'
import { AvatarCircle } from 'pixelarticons/react'

function GameHeader() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

return (
    <header className="w-full bg-[#0D1230] border-b-2 border-[#41424D] p-4 flex justify-between items-center relative overflow-hidden">
      {/* Luz de ambiente en el header */}               
       <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-blue-500"></div>
      <div className="  ">

          <h2 className="text-[#BBC3FF] font-black text-xl tracking-tighter uppercase leading-none">
            PRISMA<br/>
            <span className="text-[#4D61FF] text-sm">CRAWLER</span>
          </h2>

        </div>

      <div className="absolute inset-0 bg-blue-500/5 opacity-50"></div>
      

     
        <button onClick={handleLogout} className="px-4 py-1.5 bg-red-900/20 border border-red-500/50 text-red-400 text-[10px] font-bold hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2">
          <AvatarCircle className="w-4 h-4" />
          Disconnect
        </button>

      
    </header>
    
  )
}

export default GameHeader