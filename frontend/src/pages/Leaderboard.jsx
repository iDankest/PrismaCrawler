import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API_URL}/api/game/leaderboard`);
        if (!response.ok) throw new Error("Error al cargar el Leaderboard");
        const data = await response.json();
        setScores(data.data);
      } catch (error) {
        console.error("❌ Fallo al obtener rankings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-cyan-400 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-black mb-8 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
        🏆 Salón de la Infamia
      </h1>

      {loading ? (
        <div className="text-xl animate-pulse">Invocando a los héroes caídos...</div>
      ) : (
        <div className="w-full max-w-4xl bg-slate-800/80 border-2 border-cyan-500 rounded-xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-cyan-500/50">
                <th className="p-3">Rank</th>
                <th className="p-3">Héroe</th>
                <th className="p-3 text-center">Floor</th>
                <th className="p-3 text-center">XP</th>
                <th className="p-3 text-center">Kills</th>
                <th className="p-3 text-right">Daño Dealt</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={score.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                  <td className="p-3 font-bold">{index === 0 ? '🥇 1º' : index === 1 ? '🥈 2º' : index === 2 ? '🥉 3º' : `${index + 1}º`}</td>
                  <td className="p-3 font-bold text-white">{score.user?.name || 'Guerrero Anónimo'}</td>
                  <td className="p-3 text-center text-purple-400 font-mono">{score.floor}</td>
                  <td className="p-3 text-center text-yellow-400 font-mono">{score.xp}</td>
                  <td className="p-3 text-center text-red-400 font-mono">{score.kills}</td>
                  <td className="p-3 text-right text-orange-400 font-mono">{score.totalDamageDealt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={() => navigate(-1)} className="mt-8 px-6 py-3 bg-slate-800 text-cyan-400 border border-cyan-500 rounded hover:bg-cyan-900/40 transition-all uppercase tracking-wider font-bold">⬅ Volver a la Mazmorra</button>
    </div>
  );
}