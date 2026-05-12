// ./frontend/components/Gamecanvas.jsx

import { useEffect, useRef } from 'react'
import personajeGif from '../assets/Personaje.gif'

// 1. Inicializamos la imagen FUERA del componente. 
// Así evitamos que el navegador la recargue cada vez que el jugador da un paso.
const playerImage = new Image()
playerImage.src = personajeGif


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
    // ctx.fillStyle = '#7b9fff'
    // ctx.fillRect(
    //   playerPos.x * TILE_SIZE, 
    //   playerPos.y * TILE_SIZE, 
    //   TILE_SIZE, 
    //   TILE_SIZE
    // )
    // ctx.fillStyle = '#ffffff'
    // ctx.font = 'bold 20px Arial'
    // ctx.textAlign = 'center'
    // ctx.fillText('●', playerPos.x * TILE_SIZE + TILE_SIZE/2, playerPos.y * TILE_SIZE + TILE_SIZE/2 + 5) // Imagen Jugador


// 2. Eliminamos el texto '●' y creamos una función para dibujar la imagen
    const drawPlayer = () => {
      ctx.drawImage(
        playerImage, 
        playerPos.x * TILE_SIZE, 
        playerPos.y * TILE_SIZE, 
        TILE_SIZE, // Ancho de la imagen
        TILE_SIZE  // Alto de la imagen
      )
    }

    // 3. Comprobamos si la imagen ya se descargó.
    // Si ya está lista, la dibujamos al instante. Si no, esperamos a que cargue.
    if (playerImage.complete) {
      drawPlayer()
    } else {
      playerImage.onload = () => drawPlayer()
    }
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