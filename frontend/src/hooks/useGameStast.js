// src/hooks/useGameStats.js

import { useState, useCallback } from 'react'

export const useGameStats = () => {
  const [stats, setStats] = useState({
    hp: 100,
    maxHp: 100,
    floor: 1,
    kills: 0,
    money: 0,
    damageMultiplier: 1.0,
    speedMultiplier: 1.0,
    attackSpeedMultiplier: 1.0
  })

  // Callback que Phaser llamará cada frame para actualizar stats
  const updateStats = useCallback((newStats) => {
    setStats(prev => ({
      ...prev,
      ...newStats
    }))
  }, [])

  return { stats, updateStats }
}