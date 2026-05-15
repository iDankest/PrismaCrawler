import { useEffect, useState } from 'react'
import api from '../api/axios' // Ruta corregida para resolver el error de compilación

export default function Leaderboard() {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Llamada a la API para obtener el Top 10 de destructores
    api.get('/game/leaderboard')
      .then(res => {
        // En tu backend, la respuesta viene en res.data.data
        setScores(res.data.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error("Error al cargar el Salón de la Infamia:", err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-[#1a120b] p-8 font-serif text-[#d4ad60]">
      <div className="max-w-2xl mx-auto border-4 border-double border-[#5c4033] bg-[#2c1e14] p-6 shadow-2xl">
        <h1 className="text-4xl text-center mb-8 uppercase tracking-widest font-black border-b-2 border-[#5c4033] pb-4">
          📜 Salón de la Infamia
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-12 h-12 border-4 border-t-[#d4ad60] border-[#5c4033] rounded-full animate-spin mb-4"></div>
            <p className="text-center animate-pulse">Consultando los archivos reales...</p>
          </div>
        ) : scores.length === 0 ? (
          <p className="text-center py-10 italic text-slate-500">Aún no hay registros de batallas en este pergamino.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[#8b4513] border-b border-[#5c4033]">
                  <th className="p-2">Héroe</th>
                  <th className="p-2 text-center">Daño Dado</th>
                  <th className="p-2 text-center">Daño Recibido</th>
                  <th className="p-2 text-right">Piso</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, index) => (
                  <tr key={s.id || index} className="hover:bg-[#3d2b1f] transition-colors border-b border-[#5c4033]/30">
                    <td className="p-3 font-bold">
                      <span className="text-[#8b4513] mr-2">
                        {index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                      </span>
                      {s.user?.name || 'Desconocido'}
                    </td>
                    <td className="p-3 text-center text-orange-600 font-mono font-bold">
                      {s.totalDamageDealt}
                    </td>
                    <td className="p-3 text-center text-red-700 font-mono">
                      {s.totalDamageTaken}
                    </td>
                    <td className="p-3 text-right text-cyan-700 font-bold">
                      {s.floor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-[#5c4033] text-[#d4ad60] border border-[#d4ad60]/30 hover:bg-[#8b4513] hover:text-white transition-all rounded shadow-lg uppercase text-xs font-black tracking-widest"
          >
            Regresar al combate
          </button>
        </div>
      </div>

      {/* Decoración de esquina tipo mazmorra */}
      <div className="fixed bottom-4 right-4 opacity-20 pointer-events-none">
        <span className="text-6xl">🏰</span>
      </div>
    </div>
  )
}