// .frontend/src/components/GameHeader.jsx

import { useNavigate } from 'react-router-dom'

function GameHeader() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

return (
    <header className="w-full bg-[#0D1230] border-b-2 border-[#74768B] p-4 flex justify-between items-center bg-grid relative overflow-hidden">
      {/* Luz de ambiente en el header */}
      <div className="absolute inset-0 bg-blue-500/5 opacity-50"></div>
      

      <div className="flex items-center gap-4 z-10 justify-between w-full">
        <span className="text-blue-300 font-mono text-[10px] tracking-widest bg-blue-950/50 px-3 py-1 border border-blue-800/50">
          USER: {user.name?.toUpperCase() || 'UNKNOWN_UNIT'}
        </span>
        <button onClick={handleLogout} className="px-4 py-1.5 bg-red-900/20 border border-red-500/50 text-red-400 text-[10px] font-bold hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest">
          Disconnect
        </button>
      </div>
    </header>
  )
}

export default GameHeader