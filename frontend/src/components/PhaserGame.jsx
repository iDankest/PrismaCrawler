// .frontend/src/components/PhaserGame.jsx

import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import playerImg from '../assets/sprites/Personaje.png'
import enemyImg from '../assets/sprites/Slime.png'
import playerWalkImg from '../assets/sprites/Personaje-Caminar.png'

function PhaserGame() {
  const gameContainer = useRef(null)
  const gameRef = useRef(null)

  useEffect(() => {
    if (!gameContainer.current || gameRef.current) return

    class GameScene extends Phaser.Scene {
      constructor() {
        super('GameScene')
        this.player = null
        this.enemies = []
        this.keys = null
      }

      async preload() {
        try {
          await this.load.spritesheet({
            key: 'playerIdle',
            url: playerImg,
            frameConfig: { frameWidth: 64, frameHeight: 64 }
          })

          await this.load.spritesheet({
            key: 'playerWalk',
            url: playerWalkImg,
            frameConfig: { frameWidth: 64, frameHeight: 64 }
          })

          await this.load.spritesheet({
            key: 'enemy',
            url: enemyImg,
            frameConfig: { frameWidth: 32, frameHeight: 32 }
          })
        } catch (error) {
          console.error('Error cargando sprites:', error)
        }
      }

      create() {
        this.cameras.main.setBackgroundColor('#1a1a2e')

        // CREAR ANIMACIONES
        this.anims.create({
          key: 'idle',
          frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 4 }),
          frameRate: 8,
          repeat: -1
        })

        this.anims.create({
          key: 'walk',
          frames: this.anims.generateFrameNumbers('playerWalk', { start: 0, end: 7 }),
          frameRate: 12,
          repeat: -1
        })

        this.anims.create({
          key: 'enemy-idle',
          frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
          frameRate: 8,
          repeat: -1
        })

        // CREAR PLAYER
        this.player = this.add.sprite(160, 160, 'playerIdle', 0)
        this.player.play('idle')
        this.player.setScale(1)
        this.player.isWalking = false

        // CREAR ENEMIGOS
        for (let i = 0; i < 2; i++) {
          let x, y, tooClose
          
          // Generar posición que no sea donde está el player
          do {
            tooClose = false
            x = Phaser.Math.Between(50, 300)
            y = Phaser.Math.Between(50, 300)
            
            // Si está muy cerca del player (menos de 100px), volver a generar
            const dist = Phaser.Math.Distance.Between(x, y, 160, 160)
            if (dist < 100) {
              tooClose = true
            }
          } while (tooClose)

          const enemy = this.add.sprite(x, y, 'enemy', 0)
          enemy.play('enemy-idle')
          enemy.setScale(1.5)
          this.enemies.push({
            sprite: enemy,
            x: enemy.x,
            y: enemy.y,
            width: 32,
            height: 32
          })
        }

        // CONTROLES WASD
        this.keys = this.input.keyboard.addKeys({
          W: Phaser.Input.Keyboard.KeyCodes.W,
          A: Phaser.Input.Keyboard.KeyCodes.A,
          S: Phaser.Input.Keyboard.KeyCodes.S,
          D: Phaser.Input.Keyboard.KeyCodes.D
        })
      }

      update() {
        let isMoving = false
        let nextX = this.player.x
        let nextY = this.player.y

        // MOVIMIENTO CON WASD
        if (this.keys.W.isDown) {
          nextY -= 3
          isMoving = true
        }
        if (this.keys.S.isDown) {
          nextY += 3
          isMoving = true
        }
        if (this.keys.A.isDown) {
          nextX -= 3
          isMoving = true
        }
        if (this.keys.D.isDown) {
          nextX += 3
          isMoving = true
        }

        // COLISIÓN CON ENEMIGOS - Evitar que se superpongan
        let canMove = true
        this.enemies.forEach((enemy) => {
          const distance = Phaser.Math.Distance.Between(
            nextX,
            nextY,
            enemy.sprite.x,
            enemy.sprite.y
          )

          // Si está muy cerca (menos de 40px), no se mueve
          if (distance < 40) {
            canMove = false
          }
        })

        // Aplicar movimiento si es válido
        if (canMove && isMoving) {
          this.player.x = Phaser.Math.Clamp(nextX, 16, 384)
          this.player.y = Phaser.Math.Clamp(nextY, 16, 384)
        } else if (!isMoving) {
          // Si no se está moviendo, igual actualizamos la posición sin restricciones
          this.player.x = Phaser.Math.Clamp(nextX, 16, 384)
          this.player.y = Phaser.Math.Clamp(nextY, 16, 384)
        }

        // CAMBIAR ANIMACIÓN basada en si se está moviendo
        if (isMoving) {
          if (this.player.anims.currentAnim?.key !== 'walk') {
            this.player.setTexture('playerWalk')
            this.player.play('walk', true)
            this.player.isWalking = true
          }
        } else {
          if (this.player.anims.currentAnim?.key !== 'idle') {
            this.player.setTexture('playerIdle')
            this.player.play('idle', true)
            this.player.isWalking = false
          }
        }

        // IA ENEMIGOS (persiguen pero no atraviesan al player)
        this.enemies.forEach((enemy) => {
          const distance = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            enemy.sprite.x,
            enemy.sprite.y
          )

          // Si está a menos de 40px, no se mueve más
          if (distance > 40) {
            if (distance < 200) {
              const angle = Phaser.Math.Angle.Between(
                enemy.sprite.x,
                enemy.sprite.y,
                this.player.x,
                this.player.y
              )
              enemy.sprite.x += Math.cos(angle) * 0.8
              enemy.sprite.y += Math.sin(angle) * 0.8
            }
          }

          // Mantener dentro de límites
          enemy.sprite.x = Phaser.Math.Clamp(enemy.sprite.x, 16, 384)
          enemy.sprite.y = Phaser.Math.Clamp(enemy.sprite.y, 16, 384)
        })
      }
    }

    const config = {
      type: Phaser.AUTO,
      parent: gameContainer.current,
      width: 400,
      height: 400,
      render: {
        pixelArt: true,
        antialias: false
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: GameScene
    }

    gameRef.current = new Phaser.Game(config)

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])

  return (
    <div 
      ref={gameContainer} 
      style={{ 
        border: '4px solid #4b5fd8',
        borderRadius: '8px',
        overflow: 'hidden'
      }} 
    />
  )
}

export default PhaserGame