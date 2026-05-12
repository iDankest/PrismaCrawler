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
        this.gameOver = false
        this.pendingTimers = []
        
        // ✅ SISTEMA DE OLEADAS
        this.currentWave = 0
        this.waveActive = false
        this.enemiesPerWave = 2
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
          frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 3 }),
          frameRate: 8,
          repeat: -1
        })

        this.anims.create({
          key: 'walk',
          frames: this.anims.generateFrameNumbers('playerWalk', { start: 0, end: 2 }),
          frameRate: 12,
          repeat: -1
        })

        this.anims.create({
          key: 'attack',
          frames: this.anims.generateFrameNumbers('playerAttack', { start: 0, end: 3 }),
          frameRate: 15,
          repeat: 0
        })

        // CREAR ANIMACIONES ENEMY
        this.anims.create({
          key: 'enemy-idle',
          frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 2 }),
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

        // ✅ INICIAR PRIMERA OLEADA
        this.startWave()
      }

      update() {
        // Si el juego ha terminado, no continuar update
        if (this.gameOver) return

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

      // ✅ SISTEMA DE OLEADAS
      startWave() {
        this.currentWave++
        this.waveActive = true
        console.log(`\n🌊 OLEADA ${this.currentWave} INICIADA!`)
        
        // Limpiar enemigos previos (si los hay)
        this.enemies.forEach(enemy => {
          if (enemy.sprite.active) {
            enemy.sprite.destroy()
          }
        })
        this.enemies = []

        // Calcular dificultad: más enemigos y más fuertes cada oleada
        const enemyCount = this.enemiesPerWave + Math.floor(this.currentWave / 2)
        const enemyHpMultiplier = 1 + (this.currentWave - 1) * 0.3
        const enemyDamageMultiplier = 1 + (this.currentWave - 1) * 0.2

        // Crear enemigos de la oleada
        for (let i = 0; i < enemyCount; i++) {
          this.spawnEnemy(enemyHpMultiplier, enemyDamageMultiplier)
        }

        console.log(`📊 Enemigos: ${enemyCount} | HP x${enemyHpMultiplier.toFixed(1)} | Daño x${enemyDamageMultiplier.toFixed(1)}`)
      }

      // ✅ SPAWN UN ENEMIGO CON PARÁMETROS DE DIFICULTAD
      spawnEnemy(hpMultiplier = 1, damageMultiplier = 1) {
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

        const baseHp = 30
        const baseDamage = 5
        const attackCooldown = Math.max(600, 1000 - this.currentWave * 50) // Más rápido conforme avanza

        this.enemies.push({
          sprite: enemy,
          x: enemy.x,
          y: enemy.y,
          width: 32,
          height: 32,
          hp: Math.round(baseHp * hpMultiplier),
          maxHp: Math.round(baseHp * hpMultiplier),
          isAttacking: false,
          lastAttackTime: 0,
          attackCooldown: attackCooldown,
          baseDamage: baseDamage,
          damage: Math.round(baseDamage * damageMultiplier)
        })
      }

      // ✅ Helper para crear timers rastreados
      addTrackedTimer(delay, callback) {
        const timer = this.time.delayedCall(delay, () => {
          if (!this.gameOver) {
            callback()
          }
          this.pendingTimers = this.pendingTimers.filter(t => t !== timer)
        })
        this.pendingTimers.push(timer)
        return timer
      }

      // ✅ Cancelar todos los timers pendientes
      cancelAllTimers() {
        this.pendingTimers.forEach(timer => {
          if (timer && timer.elapsed < timer.delay) {
            this.time.removeEvent(timer)
          }
        })
        this.pendingTimers = []
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
            console.log(`⚔️ ¡Golpe! Enemigo HP: ${enemy.hp}/${enemy.maxHp}`)

            if (enemy.hp <= 0) {
              enemy.sprite.destroy()
              this.enemies = this.enemies.filter(e => e !== enemy)
              console.log(`💀 ¡Enemigo derrotado! (${this.enemies.length} quedan)`)

              // ✅ Si no quedan enemigos EN ESTA OLEADA, siguiente oleada
              if (this.enemies.length === 0) {
                this.waveActive = false
                console.log(`🎉 ¡OLEADA ${this.currentWave} COMPLETADA!`)
                
                // Esperar 2 segundos antes de la siguiente oleada
                this.addTrackedTimer(2000, () => {
                  if (!this.gameOver) {
                    this.startWave()
                  }
                })
              }
            }
          }
        })

        this.addTrackedTimer(400, () => {
          if (this.player.active) {
            this.isAttacking = false
            this.player.setTexture('playerIdle')
          }
        })
      }

      enemyAttack(enemy) {
        if (this.gameOver) return

        enemy.isAttacking = true
        enemy.lastAttackTime = this.time.now
        enemy.sprite.setTexture('enemyAttack')
        enemy.sprite.play('enemy-attack', true)

        // Daño al player (aumenta con oleadas)
        const attackDamage = enemy.damage
        this.player.hp -= attackDamage
        console.log(`🩸 ¡Enemigo te muerde! HP: ${this.player.hp}/${this.player.maxHp} (-${attackDamage})`)

        if (this.player.hp <= 0) {
          console.log(`💀 ¡GAME OVER! Derrotado en la oleada ${this.currentWave}`)
          this.gameOver = true
          this.cancelAllTimers()
          this.scene.pause()
          return
        }

        this.addTrackedTimer(400, () => {
          if (enemy.sprite.active) {
            enemy.isAttacking = false
            enemy.sprite.setTexture('enemy')
            enemy.sprite.play('enemy-idle')
          }
        })
      }

      // CONTROLES (al final del create)
      // Se mueve al final para asegurar que todo esté creado
      createControls() {
        this.keys = this.input.keyboard.addKeys({
          W: Phaser.Input.Keyboard.KeyCodes.W,
          A: Phaser.Input.Keyboard.KeyCodes.A,
          S: Phaser.Input.Keyboard.KeyCodes.S,
          D: Phaser.Input.Keyboard.KeyCodes.D,
          SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE
        })
      }

      shutdown() {
        this.cancelAllTimers()
      }
    }

    // Parchear el método create para asegurar que los controles se crean al final
    const originalCreate = GameScene.prototype.create
    GameScene.prototype.create = function() {
      originalCreate.call(this)
      this.createControls()
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