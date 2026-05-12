// .frontend/src/components/PhaserGame.jsx

import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import playerImg from '../assets/sprites/Personaje.png'
import enemyImg from '../assets/sprites/Slime.png'
import playerWalkImg from '../assets/sprites/Personaje-Caminar.png'
import playerAttackImg from '../assets/sprites/AtaquePJ.png'
import enemyAttackImg from '../assets/sprites/SmileAttack.png'

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
        this.playerDirection = 1
        this.isAttacking = false
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
            key: 'playerAttack',
            url: playerAttackImg,
            frameConfig: { frameWidth: 64, frameHeight: 64 }
          })

          await this.load.spritesheet({
            key: 'enemy',
            url: enemyImg,
            frameConfig: { frameWidth: 32, frameHeight: 32 }
          })

          await this.load.spritesheet({
            key: 'enemyAttack',
            url: enemyAttackImg,
            frameConfig: { frameWidth: 32, frameHeight: 32 }
          })
        } catch (error) {
          console.error('Error cargando sprites:', error)
        }
      }

      create() {
        this.cameras.main.setBackgroundColor('#1a1a2e')

        // CREAR ANIMACIONES PLAYER
        this.anims.create({
          key: 'idle',
          frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 4 }),
          frameRate: 8,
          repeat: -1
        })

        this.anims.create({
          key: 'walk',
          frames: this.anims.generateFrameNumbers('playerWalk', { start: 0, end: 3 }),
          frameRate: 12,
          repeat: -1
        })

        this.anims.create({
          key: 'attack',
          frames: this.anims.generateFrameNumbers('playerAttack', { start: 0, end: 5 }),
          frameRate: 15,
          repeat: 0
        })

        // CREAR ANIMACIONES ENEMY
        this.anims.create({
          key: 'enemy-idle',
          frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
          frameRate: 8,
          repeat: -1
        })

        this.anims.create({
          key: 'enemy-attack',
          frames: this.anims.generateFrameNumbers('enemyAttack', { start: 0, end: 3 }),
          frameRate: 12,
          repeat: 0
        })

        // CREAR PLAYER
        this.player = this.add.sprite(160, 160, 'playerIdle', 0)
        this.player.play('idle')
        this.player.setScale(1)
        this.player.isWalking = false
        this.player.scaleX = 1
        this.player.hp = 100
        this.player.maxHp = 100

        // CREAR ENEMIGOS
        for (let i = 0; i < 2; i++) {
          let x, y, tooClose
          
          do {
            tooClose = false
            x = Phaser.Math.Between(50, 300)
            y = Phaser.Math.Between(50, 300)
            
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
            height: 32,
            hp: 30,
            maxHp: 30,
            isAttacking: false,
            lastAttackTime: 0,
            attackCooldown: 1000 // 1 segundo entre ataques
          })
        }

        // CONTROLES WASD
        this.keys = this.input.keyboard.addKeys({
          W: Phaser.Input.Keyboard.KeyCodes.W,
          A: Phaser.Input.Keyboard.KeyCodes.A,
          S: Phaser.Input.Keyboard.KeyCodes.S,
          D: Phaser.Input.Keyboard.KeyCodes.D,
          SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE
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
          this.playerDirection = -1
        }
        if (this.keys.D.isDown) {
          nextX += 3
          isMoving = true
          this.playerDirection = 1
        }

        // ATAQUE CON ESPACIO
        if (this.keys.SPACE.isDown && !this.isAttacking) {
          this.attack()
        }

        // COLISIÓN CON ENEMIGOS
        let canMove = true
        this.enemies.forEach((enemy) => {
          const distance = Phaser.Math.Distance.Between(
            nextX,
            nextY,
            enemy.sprite.x,
            enemy.sprite.y
          )

          if (distance < 40) {
            canMove = false
          }
        })

        // Aplicar movimiento
        if (canMove && isMoving && !this.isAttacking) {
          this.player.x = Phaser.Math.Clamp(nextX, 16, 384)
          this.player.y = Phaser.Math.Clamp(nextY, 16, 384)
        } else if (!isMoving && !this.isAttacking) {
          this.player.x = Phaser.Math.Clamp(nextX, 16, 384)
          this.player.y = Phaser.Math.Clamp(nextY, 16, 384)
        }

        // APLICAR FLIP
        this.player.scaleX = this.playerDirection

        // CAMBIAR ANIMACIÓN PLAYER
        if (!this.isAttacking) {
          if (isMoving) {
            if (this.player.anims.currentAnim?.key !== 'walk') {
              this.player.setTexture('playerWalk')
              this.player.play('walk', true)
            }
          } else {
            if (this.player.anims.currentAnim?.key !== 'idle') {
              this.player.setTexture('playerIdle')
              this.player.play('idle', true)
            }
          }
        }

        // IA ENEMIGOS
        this.enemies.forEach((enemy) => {
          const distance = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            enemy.sprite.x,
            enemy.sprite.y
          )

          const currentTime = this.time.now

          // ATAQUE DEL ENEMIGO
          if (distance < 50 && !enemy.isAttacking && currentTime - enemy.lastAttackTime > enemy.attackCooldown) {
            this.enemyAttack(enemy)
          }

          // MOVIMIENTO DEL ENEMIGO
          if (distance > 40 && distance < 200 && !enemy.isAttacking) {
            const angle = Phaser.Math.Angle.Between(
              enemy.sprite.x,
              enemy.sprite.y,
              this.player.x,
              this.player.y
            )
            enemy.sprite.x += Math.cos(angle) * 0.8
            enemy.sprite.y += Math.sin(angle) * 0.8

            // Volver a idle si no ataca
            if (enemy.sprite.anims.currentAnim?.key !== 'enemy-idle') {
              enemy.sprite.play('enemy-idle')
            }
          }

          enemy.sprite.x = Phaser.Math.Clamp(enemy.sprite.x, 16, 384)
          enemy.sprite.y = Phaser.Math.Clamp(enemy.sprite.y, 16, 384)
        })
      }

      attack() {
        this.isAttacking = true
        this.player.setTexture('playerAttack')
        this.player.play('attack', true)

        const attackRange = 80
        this.enemies.forEach((enemy) => {
          const distance = Phaser.Math.Distance.Between(
            this.player.x + (this.playerDirection * 40),
            this.player.y,
            enemy.sprite.x,
            enemy.sprite.y
          )

          if (distance < attackRange) {
            enemy.hp -= 10
            console.log('¡Golpe! Enemigo HP:', enemy.hp)

            if (enemy.hp <= 0) {
              enemy.sprite.destroy()
              this.enemies = this.enemies.filter(e => e !== enemy)
              console.log('¡Enemigo derrotado!')
            }
          }
        })

        this.time.delayedCall(400, () => {
          this.isAttacking = false
          this.player.setTexture('playerIdle')
        })
      }

      enemyAttack(enemy) {
        enemy.isAttacking = true
        enemy.lastAttackTime = this.time.now
        enemy.sprite.setTexture('enemyAttack')
        enemy.sprite.play('enemy-attack', true)

        // Daño al player
        const attackDamage = 5
        this.player.hp -= attackDamage
        console.log('¡Enemigo te muerde! HP del jugador:', this.player.hp)

        if (this.player.hp <= 0) {
          console.log('¡GAME OVER!')
          this.scene.pause()
        }

        this.time.delayedCall(400, () => {
          enemy.isAttacking = false
          enemy.sprite.setTexture('enemy')
          enemy.sprite.play('enemy-idle')
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