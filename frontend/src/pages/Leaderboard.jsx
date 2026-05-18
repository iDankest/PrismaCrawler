import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import personajeGif from '../assets/Personaje.gif'
import { Sword, Heart, Shield, Skull } from 'pixelarticons/react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('totalDamageDealt')

  useEffect(() => {
    // Obtenemos los datos de la DB usando fetch nativo
    fetch(`${API_URL}/game/leaderboard`)
      .then(res => {
        if (!res.ok) throw new Error("Fallo al conectar con el archivo")
        return res.json()
      })
      .then(data => {
        const scoresList = data.data || data || []
        setScores(scoresList)
        setLoading(false)
      })
      .catch(err => {
        console.error("❌ Fallo crítico al invocar registros:", err)
        setLoading(false)
      })
  }, [])

  // --- ORDENACIÓN EN FRONTEND (Reactivo e instantáneo) ---
  const sortedScores = useMemo(() => {
    const list = [...scores]
    return list.sort((a, b) => {
      if (activeFilter === 'totalDamageDealt') {
        return (b.totalDamageDealt || 0) - (a.totalDamageDealt || 0)
      }
      if (activeFilter === 'totalDamageTaken') {
        return (b.totalDamageTaken || 0) - (a.totalDamageTaken || 0)
      }
      if (activeFilter === 'kills') {
        return (b.kills || 0) - (a.kills || 0)
      }
      return 0
    })
  }, [scores, activeFilter])

  return (
    <div className="min-h-screen bg-[#0D1230] bg-grid text-[#BBC3FF] p-8 flex flex-col items-center justify-center relative select-none font-mono">
      <div className="absolute inset-0 bg-linear-to-t from-[#0A0B14] via-transparent to-transparent opacity-80"></div>
      
      {/* Fondo con degradado sutil de rejilla */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B14] via-transparent to-transparent opacity-85 pointer-events-none z-0"></div>

      {/* TÍTULO CON GLOW IGUAL AL LOGIN */}
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
        
        <p className="text-[10px] tracking-[0.4em] uppercase">Ranking</p>
      </div>

      {/* MARCO CONTENEDOR EXACTO AL DEL LOGIN */}
      <div className="w-full max-w-4xl bg-[#12162E]/90 border border-[#74768B]/40 p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative z-10">
        
        {/* Esquinas pixeladas decorativas del Login ┌ ┐ └ ┘ */}
        <div className="absolute -top-[3px] -left-[3px] w-3 h-3 border-t-2 border-l-2 border-[#BBC3FF]"></div>
        <div className="absolute -top-[3px] -right-[3px] w-3 h-3 border-t-2 border-r-2 border-[#BBC3FF]"></div>
        <div className="absolute -bottom-[3px] -left-[3px] w-3 h-3 border-b-2 border-l-2 border-[#BBC3FF]"></div>
        <div className="absolute -bottom-[3px] -right-[3px] w-3 h-3 border-b-2 border-r-2 border-[#BBC3FF]"></div>

        {/* 1. BOTONES DE FILTRO SUPERIORES */}
        <div className="grid grid-cols-3 gap-2 mb-6 border-b border-[#74768B]/20 pb-6">
          <button 
            onClick={() => setActiveFilter('totalDamageDealt')}
            className={`py-2 px-3 text-[9px] flex items-center justify-center gap-1 font-black tracking-widest uppercase border transition-all duration-150 ${
              activeFilter === 'totalDamageDealt' 
                ? 'bg-[#BBC3FF] text-[#0A0B14] border-[#BBC3FF]' 
                : 'bg-transparent text-[#74768B] border-[#74768B]/40 hover:text-[#BBC3FF] hover:border-[#BBC3FF]/60'
            }`}
          >
            {<Sword className="w-4 h-4" />} Damage_Dealt
          </button>
          <button 
            onClick={() => setActiveFilter('totalDamageTaken')}
            className={`py-2 px-3 text-[9px] flex items-center justify-center gap-1 font-black tracking-widest uppercase border transition-all duration-150 ${
              activeFilter === 'totalDamageTaken' 
                ? 'bg-[#BBC3FF] text-[#0A0B14] border-[#BBC3FF]' 
                : 'bg-transparent text-[#74768B] border-[#74768B]/40 hover:text-[#BBC3FF] hover:border-[#BBC3FF]/60'
            }`}
          >
            {<Shield className="w-4 h-4" />} Damage_Taken
          </button>
          <button 
            onClick={() => setActiveFilter('kills')}
            className={`py-2 px-3 flex items-center justify-center gap-1 text-[9px] font-black tracking-widest uppercase border transition-all duration-150 ${
              activeFilter === 'kills' 
                ? 'bg-[#BBC3FF] text-[#0A0B14] border-[#BBC3FF]' 
                : 'bg-transparent text-[#74768B] border-[#74768B]/40 hover:text-[#BBC3FF] hover:border-[#BBC3FF]/60'
            }`}
          >
            {<Skull className="w-4 h-4" />} Kill_Score
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-1 bg-[#1D2240] overflow-hidden relative">
              <div className="h-full bg-[#BBC3FF] animate-pulse"></div>
            </div>
            <p className="text-[9px] text-[#74768B] animate-pulse tracking-widest uppercase">
              QUERYING_ARCHIVE_DATA...
            </p>
          </div>
        ) : sortedScores.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xs text-[#74768B] uppercase tracking-wider">No deceased operators found in local registers.</p>
          </div>
        ) : (
          /* TABLA DE CLASIFICACIÓN */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#74768B]/20 text-[#74768B] text-[8px] uppercase tracking-[0.2em]">
                  <th className="p-3">Rank</th>
                  <th className="p-3">Operator</th>
                  <th className={`p-3 text-center transition-colors ${activeFilter === 'totalDamageDealt' ? 'text-[#BBC3FF]' : ''}`}>Damage Dealt</th>
                  <th className={`p-3 text-center transition-colors ${activeFilter === 'totalDamageTaken' ? 'text-[#BBC3FF]' : ''}`}>Damage Taken</th>
                  <th className={`p-3 text-center transition-colors ${activeFilter === 'kills' ? 'text-[#BBC3FF]' : ''}`}>Kills</th>
                  <th className="p-3 text-right">Sector</th>
                </tr>
              </thead>
              <tbody>
                {sortedScores.map((s, index) => {
                  const isTop3 = index < 3
                  const rankStyles = [
                    'text-yellow-400 font-bold',
                    'text-slate-300 font-bold',
                    'text-amber-600 font-bold'
                  ]
                  const rankClass = isTop3 ? rankStyles[index] : 'text-[#74768B]'

                  return (
                    <tr 
                      key={s.id || index} 
                      className="border-b border-[#74768B]/10 hover:bg-[#BBC3FF]/5 transition-colors duration-100"
                    >
                      {/* POSICIÓN */}
                      <td className="p-3 text-xs">
                        <span className={`${rankClass} font-mono`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </td>

                      {/* NOMBRE JUGADOR */}
                      <td className="p-3 text-xs font-bold text-white uppercase tracking-tighter">
                        {s.playerName || 'GUEST_UNIT'}
                      </td>

                      {/* DAÑO DADO */}
                      <td className={`p-3 text-center text-xs font-mono font-bold transition-opacity ${
                        activeFilter === 'totalDamageDealt' ? 'text-orange-400' : 'text-orange-400/40'
                      }`}>
                        {(s.totalDamageDealt || 0).toLocaleString()}
                      </td>

                      {/* DAÑO RECIBIDO */}
                      <td className={`p-3 text-center text-xs font-mono font-bold transition-opacity ${
                        activeFilter === 'totalDamageTaken' ? 'text-red-400' : 'text-red-400/40'
                      }`}>
                        {(s.totalDamageTaken || 0).toLocaleString()}
                      </td>

                      {/* KILLS */}
                      <td className={`p-3 text-center text-xs font-mono font-bold transition-opacity ${
                        activeFilter === 'kills' ? 'text-cyan-400' : 'text-cyan-400/40'
                      }`}>
                        {s.kills || 0}
                      </td>

                      {/* PISO */}
                      <td className="p-3 text-right text-xs font-black text-[#BBC3FF]">
                        SEC_{String(s.floor || 1).padStart(2, '0')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. BOTÓN DE RETORNO ESTILO LOGIN "INITIALIZE LOGIN" */}
        <div className="mt-8 pt-6 border-t border-[#74768B]/20 flex justify-center">
          <button 
            onClick={() => navigate(-1)}
            className="w-full max-w-xs py-3.5 bg-[#B9C1FD] hover:bg-[#BBC3FF] text-[#12162E] font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(185,193,253,0.2)] active:scale-98"
          >
            Return
          </button>
        </div>

      </div>

      {/* Marca de agua cibernética */}
      <div className="absolute bottom-4 right-4 opacity-3 pointer-events-none select-none z-0">
        <span className="text-[120px] font-black tracking-tighter">RIP</span>
      </div>
    </div>
  )
}
