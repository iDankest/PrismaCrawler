import { motion } from 'framer-motion'
import personajeGif from '../assets/Personaje.gif'

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900">
      
      {/* Personaje saltando */}
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-8"
      >
        <img 
          src={personajeGif} 
          alt="Personaje" 
          className="w-24 h-24"
        />
      </motion.div>

      {/* Texto "LOADING" */}
      <h2 className="text-3xl font-bold text-blue-300 mb-6 tracking-widest">
        LOADING...
      </h2>

      {/* Barra de progreso animada */}
      <div className="w-64 h-2 bg-slate-800 rounded-full border-2 border-blue-500 overflow-hidden">
        <motion.div
          className="h-full bg-blue-500"
          animate={{ width: ['0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Dots animados */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-blue-400 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>
    </div>
  )
}