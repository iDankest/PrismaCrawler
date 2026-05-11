import { useEffect, useRef } from 'react'

function GameCanvas({ map, playerPos }) {
  const canvasRef = useRef(null)
  const TILE_SIZE = 32

  useEffect(() => {
    if (!canvasRef.current || map.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Limpiar
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Dibujar mapa
    map.forEach((row, y) => {
      row.forEach((tile, x) => {
        const color = tile === 1 ? '#2c3a6b' : '#4b5fd8'
        ctx.fillStyle = color
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
        ctx.strokeStyle = '#1a1a2e'
        ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
      })
    })

    // Dibujar jugador
    ctx.fillStyle = '#7b9fff'
    ctx.fillRect(
      playerPos.x * TILE_SIZE, 
      playerPos.y * TILE_SIZE, 
      TILE_SIZE, 
      TILE_SIZE
    )
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('●', playerPos.x * TILE_SIZE + TILE_SIZE/2, playerPos.y * TILE_SIZE + TILE_SIZE/2 + 5)

  }, [map, playerPos])

  return (
    <canvas 
      ref={canvasRef} 
      width={320} 
      height={320}
      style={{ border: '4px solid #4b5fd8', imageRendering: 'pixelated' }}
    />
  )
}

export default GameCanvas