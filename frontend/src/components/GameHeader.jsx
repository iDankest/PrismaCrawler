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
    <header className="w-full bg-blue-900 border-b-4 border-blue-600 p-4 flex justify-between items-center">
      <div className="flex gap-6">
        <button className="text-blue-300 hover:text-blue-100 font-bold tracking-widest">
          PLAY
        </button>
        <button className="text-blue-300 hover:text-blue-100 font-bold tracking-widest">
          ITEMS
        </button>
        <button className="text-blue-300 hover:text-blue-100 font-bold tracking-widest">
          LEADERBOARD
        </button>
        <button className="text-blue-300 hover:text-blue-100 font-bold tracking-widest">
          INFO
        </button>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-blue-200 text-sm">{user.name || user.email}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold tracking-widest text-xs"
        >
          LOGOUT
        </button>
      </div>
    </header>
  )
}

export default GameHeader