// src/scenes/gameScene.js - VERSIÓN MERGEADA (Backend Maps + Cache + DB Items)

import Phaser from 'phaser'
import Personaje from '../assets/sprites/Personaje.png'
import PersonajeCaminar from '../assets/sprites/Personaje-Caminar.png'
import AtaquePJ from '../assets/sprites/AtaquePJ.png'
import Slime from '../assets/sprites/Slime.png'
import SmileAttack from '../assets/sprites/SmileAttack.png'
import Espada from '../assets/sprites/items/espada.png'
import Beer from '../assets/sprites/items/beer.png'
import Taza from '../assets/sprites/items/taza.png'
import Saco from '../assets/sprites/items/saco.png'
import Potion from '../assets/sprites/items/potion.png'
import Cofre from '../assets/sprites/items/Cofre.png'
import Suelo from '../assets/Entorno/Suelo.png'
import { getRandomItem } from '../data/itemsDatabase'

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
    this.player = null
    this.enemies = []
    this.obstacles = []
    this.floorTiles = []
    this.items = []
    this.chests = []
    this.keys = null
    this.playerDirection = 1
    this.isAttacking = false
    this.gameOver = false
    this.isDashing = false
    this.lastDashTime = 0
    this.pendingTimers = []
    
    this.currentFloor = 0
    this.floorActive = false
    this.enemiesPerFloor = 2
    
    this.stats = {
      kills: 0,
      money: 0,
      damageMultiplier: 1.0,
      speedMultiplier: 1.0,
      attackSpeedMultiplier: 1.0,
      itemsCollected: [],
      hp: 100,
      maxHp: 100,
      xp: 0,
      totalDamageDealt: 0,
      totalDamageTaken: 0
    }

    this.lastStateStr = ""
    this.onGameStateUpdate = null
    this.onGameOver = null
    this.onInventoryUpdate = null
    this.onLevelExit = null // Callback para React
  }

  preload() {
    console.log('⏳ Cargando sprites...')
    
    // SPRITES PERSONAJES Y ENEMIGOS
    this.load.spritesheet('playerIdle', Personaje, { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('playerWalk', PersonajeCaminar, { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('playerAttack', AtaquePJ, { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('enemy', Slime, { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('enemyAttack', SmileAttack, { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('chest', Cofre, { frameWidth: 32, frameHeight: 32 })
    
    // Carga de textura de suelo respetando su tamaño original (32x32)
    this.load.spritesheet('floor', Suelo, { frameWidth: 16, frameHeight: 16 })

    // SPRITES ITEMS
    this.load.image('item_sword', Espada)
    this.load.image('item_beer', Beer)
    this.load.image('item_mug', Taza)
    this.load.image('item_sack', Saco)
    this.load.image('item_potion', Potion)
    
    console.log('✅ Sprites cargados')
  }

  create() {
    this.cameras.main.setBackgroundColor('#0f172a')
    this.createAnimations()

    this.player = this.add.sprite(320, 180, 'playerIdle', 0)
    this.player.play('idle')
    this.player.setScale(1)
    this.player.scaleX = 1
    this.player.hp = 100
    this.player.maxHp = 100
    this.player.setDepth(100)

    // Fallback inicial
    this.createDungeonObstacles()

    this.keys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      SHIFT: Phaser.Input.Keyboard.KeyCodes.SHIFT
    })

    this.startFloor()
    console.log('✅ Juego iniciado')
  }

  /** Inicializa el nivel procesando la matriz y el diccionario JSON procedentes del servidor */
  setupBackendMap(mapData) {
    if (!mapData || !mapData.layout) return;
    console.log("Generando nivel a partir del esquema de red:", mapData);

    this.obstacles.forEach((obs) => {
      obs.sprite.destroy();
      obs.crystal.destroy();
    });
    this.obstacles = [];

    this.enemies.forEach((enemy) => {
      enemy.sprite.destroy();
    });
    this.enemies = [];
    
    // Limpieza de entidades residuales (entidades no recolectadas en el nivel previo)
    this.items.forEach(item => {
      if (item.sprite && item.sprite.active) item.sprite.destroy();
    });
    this.items = [];

    this.chests.forEach(chest => {
      if (chest.sprite && chest.sprite.active) chest.sprite.destroy();
    });
    this.chests = [];
    
    this.drawFloor();

    this.currentFloor = mapData.level || 1;
    this.floorActive = true;

    const rows = mapData.layout.length;
    const cols = mapData.layout[0].length;
    const cellWidth = 640 / cols;
    const cellHeight = 360 / rows;

    mapData.layout.forEach((rowString, y) => {
      rowString.split("").forEach((char, x) => {
        const posX = x * cellWidth + cellWidth / 2;
        const posY = y * cellHeight + cellHeight / 2;

        if (char === "#") {
          this.createObstacleAt(posX, posY, cellWidth, cellHeight);
        } else if (char === "D") {
          this.createObstacleAt(posX, posY, cellWidth, cellHeight, true);
        } else if (char === "r") {
          this.createObstacleAt(posX, posY, cellWidth, cellHeight);
        } else if (char === "T") {
          this.spawnChest(posX, posY);
        } else if (char === "P") {
          this.player.x = posX;
          this.player.y = posY;
        } else if (char === "M") {
          const stats = mapData.dictionary[char] || { hp: 30, damage: 5 };
          this.spawnEnemyAt(posX, posY, stats);
        }
      });
    });
  }

  /** Genera y renderiza la textura del suelo aplicando variaciones aleatorias para romper la monotonía visual */
  drawFloor() {
    // Destrucción de mosaicos previos para prevenir fugas de memoria
    this.floorTiles.forEach(tile => { if (tile && tile.active) tile.destroy() })
    this.floorTiles = []

    // Renderizado del terreno iterando por bloques adaptados a la escala del sprite principal (64x64)
    for (let x = 0; x < 640; x += 64) {
      for (let y = 0; y < 360; y += 64) {
        const frame = Phaser.Math.Between(0, 7) // Variación de textura
        const tile = this.add.sprite(x + 32, y + 32, 'floor', frame)
        tile.setScale(4) // 32x32 escalado x2 = 64x64 píxeles reales
        tile.setDepth(-1) // Lo mandamos al fondo del todo
        this.floorTiles.push(tile)
      }
    }
  }

  createObstacleAt(x, y, w, h, isDoor = false) {
    const renderW = w + 1; 
    const renderH = h + 1;

    const color = isDoor ? 0x475569 : 0x1e293b;
    const obstacle = this.add.rectangle(x, y, renderW, renderH, color);
    obstacle.setStrokeStyle(1, 0x0ea5e9);
    obstacle.setDepth(5);

    const crystalColor = isDoor ? 0x94a3b8 : 0x3b82f6;
    const crystal = this.add.rectangle(x, y, renderW - 4, renderH - 4, crystalColor);
    crystal.setAlpha(0.15);
    crystal.setDepth(4);

    this.obstacles.push({
      sprite: obstacle,
      crystal: crystal,
      x: x,
      y: y,
      width: w,
      height: h,
      isDoor: isDoor
    });
  }

  spawnEnemyAt(x, y, stats) {
    const enemy = this.add.sprite(x, y, "enemy", 0);
    enemy.play("enemy-idle");
    enemy.setScale(1.5);
    enemy.setDepth(50);

    const attackCooldown = Math.max(600, 1000 - this.currentFloor * 50);

    this.enemies.push({
      sprite: enemy,
      hp: stats.hp || 30,
      maxHp: stats.hp || 30,
      isAttacking: false,
      lastAttackTime: 0,
      attackCooldown: attackCooldown,
      damage: stats.damage || 5,
    });
  }

  /** Registro de animaciones y spritesheets para entidades interactivas */
  createAnimations() {
    if (!this.anims.exists('idle')) {
      this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      })
    }
    if (!this.anims.exists('walk')) {
      this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('playerWalk', { start: 0, end: 2 }),
        frameRate: 12,
        repeat: -1
      })
    }
    if (!this.anims.exists('attack')) {
      this.anims.create({
        key: 'attack',
        frames: this.anims.generateFrameNumbers('playerAttack', { start: 0, end: 3 }),
        frameRate: 15,
        repeat: 0
      })
    }
    if (!this.anims.exists('enemy-idle')) {
      this.anims.create({
        key: 'enemy-idle',
        frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 2 }),
        frameRate: 8,
        repeat: -1
      })
    }
    if (!this.anims.exists('enemy-attack')) {
      this.anims.create({
        key: 'enemy-attack',
        frames: this.anims.generateFrameNumbers('enemyAttack', { start: 0, end: 3 }),
        frameRate: 12,
        repeat: 0
      })
    }
    if (!this.anims.exists('chest-closed')) {
      this.anims.create({
        key: 'chest-closed',
        frames: [{ key: 'chest', frame: 0 }],
        frameRate: 1
      })
    }
    if (!this.anims.exists('chest-opening')) {
      this.anims.create({
        key: 'chest-opening',
        frames: this.anims.generateFrameNumbers('chest', { start: 0, end: 1 }),
        frameRate: 10,
        repeat: 0
      })
    }
    if (!this.anims.exists('chest-open')) {
      this.anims.create({
        key: 'chest-open',
        frames: [{ key: 'chest', frame: 1 }],
        frameRate: 1
      })
    }
  }

  createDungeonObstacles() {
    const obstaclePositions = [
      { x: 80, y: 80, w: 80, h: 50 },
      { x: 560, y: 80, w: 80, h: 50 },
      { x: 80, y: 280, w: 80, h: 50 },
      { x: 560, y: 280, w: 80, h: 50 },
      { x: 120, y: 180, w: 60, h: 80 },
      { x: 520, y: 180, w: 60, h: 80 }
    ]
    obstaclePositions.forEach(pos => this.createObstacleAt(pos.x, pos.y, pos.w, pos.h));
  }

  createProceduralRoom() {
    const w = 640;
    const h = 360;
    const wallSize = 64; // Bloques de pared ajustados a 64x64 para igualar al jugador

    this.createObstacleAt(w / 2 - 100, wallSize / 2, w / 2 - 100, wallSize); 
    this.createObstacleAt(w / 2, wallSize / 2, 80, wallSize, true);         
    this.createObstacleAt(w / 2 + 100, wallSize / 2, w / 2 - 100, wallSize);

    this.createObstacleAt(w / 2 - 100, h - wallSize / 2, w / 2 - 100, wallSize); 
    this.createObstacleAt(w / 2, h - wallSize / 2, 80, wallSize, true);          
    this.createObstacleAt(w / 2 + 100, h - wallSize / 2, w / 2 - 100, wallSize); 

    this.createObstacleAt(wallSize / 2, h / 2, wallSize, 80, true);              
    this.createObstacleAt(w - wallSize / 2, h / 2, wallSize, 80, true);          
  }

  /** Implementación de colisión AABB para calcular solapamientos matemáticos entre hitbox y obstáculos */
  checkObstacleCollision(x, y, radius = 20) {
    for (let obstacle of this.obstacles) {
      // Delimitación de coordenadas sin extender los bordes del polígono base
      const closestX = Phaser.Math.Clamp(x, obstacle.x - obstacle.width / 2, obstacle.x + obstacle.width / 2);
      const closestY = Phaser.Math.Clamp(y, obstacle.y - obstacle.height / 2, obstacle.y + obstacle.height / 2);
      
      const dist = Phaser.Math.Distance.Between(x, y, closestX, closestY);
      if (dist < radius) return true;
    }
    return false;
  }

  update() {
    if (this.gameOver) return

    let isMoving = false
    let nextX = this.player.x
    let nextY = this.player.y

    // Lógica de aceleración temporal (Dash) sujeta a validación de cooldown y feedback visual
    if (this.keys.SHIFT.isDown && !this.isDashing && this.time.now - this.lastDashTime > 1000) {
      this.isDashing = true;
      this.lastDashTime = this.time.now;
      this.player.setTint(0x00ffff);
      this.addTrackedTimer(150, () => {
        this.isDashing = false;
        if (this.player.active) this.player.clearTint();
      });
    }

    let currentSpeed = 2.0 * this.stats.speedMultiplier;
    if (this.isDashing) currentSpeed *= 3.5;

    if (this.keys.W.isDown) { nextY -= currentSpeed; isMoving = true }
    if (this.keys.S.isDown) { nextY += currentSpeed; isMoving = true }
    if (this.keys.A.isDown) { nextX -= currentSpeed; isMoving = true; this.playerDirection = -1 }
    if (this.keys.D.isDown) { nextX += currentSpeed; isMoving = true; this.playerDirection = 1 }

    if (this.keys.SPACE.isDown && !this.isAttacking) this.attack()

    let canMove = true
    this.enemies.forEach((enemy) => {
      const distance = Phaser.Math.Distance.Between(nextX, nextY, enemy.sprite.x, enemy.sprite.y)
      if (distance < 35) canMove = false
    })

    if (this.checkObstacleCollision(nextX, nextY, 24)) canMove = false

    // Aplicación del vector de movimiento (Sin clampear a ventana para habilitar transiciones)
    if (canMove) {
      this.player.x = nextX;
      this.player.y = nextY;
    }

    // Lógica de validación de transición: Requiere la limpieza de la sala y superar los límites de cámara
    if (this.enemies.length === 0 && !this.floorActive) {
      if (this.player.x < 0 || this.player.x > 640 || this.player.y < 0 || this.player.y > 360) {
        console.log("¡Jugador salió de la sala!");
        this.player.x = 320;
        this.player.y = 180;
        
        if (this.onLevelExit) {
          this.onLevelExit();
        } else {
          this.startFloor();
        }
      }
    }

    this.player.scaleX = this.playerDirection

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

    this.enemies.forEach((enemy) => {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.sprite.x, enemy.sprite.y)
      const currentTime = this.time.now

      if (distance < 50 && !enemy.isAttacking && currentTime - enemy.lastAttackTime > enemy.attackCooldown) {
        this.enemyAttack(enemy)
      }

      if (distance > 40 && distance < 200 && !enemy.isAttacking) {
        const angle = Phaser.Math.Angle.Between(enemy.sprite.x, enemy.sprite.y, this.player.x, this.player.y)
        const speed = 0.8
        const nextEnemyX = enemy.sprite.x + Math.cos(angle) * speed
        const nextEnemyY = enemy.sprite.y + Math.sin(angle) * speed

        // Colisión de enemigos con obstáculos (Bordeando paredes)
        if (!this.checkObstacleCollision(nextEnemyX, nextEnemyY, 16)) {
          enemy.sprite.x = nextEnemyX
          enemy.sprite.y = nextEnemyY
        } else if (!this.checkObstacleCollision(nextEnemyX, enemy.sprite.y, 16)) {
          enemy.sprite.x = nextEnemyX // Deslizamiento horizontal
        } else if (!this.checkObstacleCollision(enemy.sprite.x, nextEnemyY, 16)) {
          enemy.sprite.y = nextEnemyY // Deslizamiento vertical
        }

        if (enemy.sprite.anims.currentAnim?.key !== 'enemy-idle') {
          enemy.sprite.play('enemy-idle')
        }
      }

      enemy.sprite.x = Phaser.Math.Clamp(enemy.sprite.x, 32, 608)
      enemy.sprite.y = Phaser.Math.Clamp(enemy.sprite.y, 32, 328)
    })

    this.items = this.items.filter(item => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.sprite.x, item.sprite.y)
      if (dist < 30) {
        this.collectItem(item)
        return false
      }
      return true
    })

    this.chests.forEach(chest => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, chest.sprite.x, chest.sprite.y)
      if (dist < 40 && !chest.opened) {
        this.openChest(chest)
      }
    })

    this.updateGameState()
  }

  startFloor() {
    this.currentFloor++
    this.floorActive = true
    
    // Limpiamos la sala anterior
    this.enemies.forEach(enemy => { if (enemy.sprite.active) enemy.sprite.destroy() })
    this.enemies = []
    this.obstacles.forEach((obs) => { obs.sprite.destroy(); obs.crystal.destroy(); });
    this.obstacles = [];

    // Limpiamos items y cofres del piso anterior
    this.items.forEach(item => { if (item.sprite && item.sprite.active) item.sprite.destroy(); });
    this.items = [];
    this.chests.forEach(chest => { if (chest.sprite && chest.sprite.active) chest.sprite.destroy(); });
    this.chests = [];

    this.drawFloor();

    // Invocación de mapeo procedural como respaldo por defecto
    this.createProceduralRoom();

    const enemyCount = this.enemiesPerFloor + Math.floor(this.currentFloor / 2)
    const enemyHpMultiplier = 1 + (this.currentFloor - 1) * 0.35
    const enemyDamageMultiplier = 1 + (this.currentFloor - 1) * 0.25

    for (let i = 0; i < enemyCount; i++) {
      this.spawnEnemy(enemyHpMultiplier, enemyDamageMultiplier)
    }
  }

  spawnEnemy(hpMultiplier = 1, damageMultiplier = 1) {
    let x, y, tooClose, attempts = 0
    do {
      attempts++
      tooClose = false
      x = Phaser.Math.Between(80, 560)
      y = Phaser.Math.Between(80, 280)
      const distToPlayer = Phaser.Math.Distance.Between(x, y, 320, 180)
      if (distToPlayer < 120) tooClose = true
      if (this.checkObstacleCollision(x, y, 30)) tooClose = true
      if (attempts > 50) tooClose = false
    } while (tooClose)

    const enemy = this.add.sprite(x, y, 'enemy', 0)
    enemy.play('enemy-idle')
    enemy.setScale(1.5)
    enemy.setDepth(50)

    const baseHp = 30
    const baseDamage = 5
    const attackCooldown = Math.max(600, 1000 - this.currentFloor * 50)

    this.enemies.push({
      sprite: enemy,
      hp: Math.round(baseHp * hpMultiplier),
      maxHp: Math.round(baseHp * hpMultiplier),
      isAttacking: false,
      lastAttackTime: 0,
      attackCooldown: attackCooldown,
      damage: Math.round(baseDamage * damageMultiplier)
    })
  }

  openChest(chest) {
    chest.opened = true
    chest.sprite.play('chest-opening')

    this.time.delayedCall(400, () => {
      if (chest.sprite.active) {
        chest.sprite.play('chest-open')
        const item = getRandomItem()
        this.spawnItemFromChest(chest.sprite.x, chest.sprite.y, item)
      }
    })
  }

  /** Instancia el botín del cofre y aplica un tween de interpolación espacial */
  spawnItemFromChest(x, y, itemData) {
    const itemSprite = this.add.sprite(x, y, itemData.spriteKey, 0)
    itemSprite.setScale(0.8)
    itemSprite.setDepth(30)

    const itemObj = { sprite: itemSprite, type: itemData.id, data: itemData }
    this.items.push(itemObj)

    this.tweens.add({ targets: itemSprite, y: y - 50, scale: 1.5, duration: 600, ease: 'Back.out' })
    this.tweens.add({ targets: itemSprite, rotation: Math.PI * 2, duration: 600, ease: 'Linear' })
    this.time.delayedCall(600, () => {
      if (itemSprite.active) {
        this.tweens.add({ targets: itemSprite, y: y - 60, duration: 1200, repeat: -1, yoyo: true, ease: 'Sine.inout' })
      }
    })
  }

  /** Recolecta el objeto del entorno y aplica sus mutadores estadísticos dinámicos al estado del jugador */
  collectItem(item) {
    item.sprite.destroy()
    
    if (item.data.effects && Array.isArray(item.data.effects)) {
      item.data.effects.forEach(effect => {
        switch(effect.type) {
          case 'damageMultiplier':
            this.stats.damageMultiplier *= effect.value
            console.log(`⚔️ Damage: ${(this.stats.damageMultiplier).toFixed(2)}x`)
            break
          case 'attackSpeedMultiplier':
            this.stats.attackSpeedMultiplier *= effect.value
            console.log(`⚡ AttackSpeed: ${(this.stats.attackSpeedMultiplier).toFixed(2)}x`)
            break
          case 'speedMultiplier':
            this.stats.speedMultiplier *= effect.value
            console.log(`💨 Speed: ${(this.stats.speedMultiplier).toFixed(2)}x`)
            break
          case 'maxHpBoost':
            this.stats.maxHp += effect.value
            this.stats.hp = Math.min(this.stats.hp + effect.value, this.stats.maxHp)
            this.player.hp = this.stats.hp
            this.player.maxHp = this.stats.maxHp
            console.log(`❤️ MaxHP: ${this.stats.maxHp}`)
            break
          case 'heal':
            this.stats.hp = Math.min(this.stats.hp + effect.value, this.stats.maxHp)
            this.player.hp = this.stats.hp
            console.log(`💚 Healed: +${effect.value}`)
            break
        }
      })
    }
    
    this.stats.itemsCollected.push(item.type)
    if (this.onInventoryUpdate) {
      this.onInventoryUpdate(this.stats.itemsCollected)
    }
  }

  attack() {
    this.isAttacking = true
    this.player.setTexture('playerAttack')
    this.player.play('attack')

    const attackRange = 80
    const attackDamage = 10 * this.stats.damageMultiplier

    this.enemies.forEach((enemy) => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x + (this.playerDirection * 40),
        this.player.y,
        enemy.sprite.x,
        enemy.sprite.y
      )

      if (distance < attackRange) {
        const actualDamage = Math.min(enemy.hp, attackDamage)
        enemy.hp -= attackDamage
        this.stats.totalDamageDealt += actualDamage

        if (enemy.hp <= 0) {
          enemy.sprite.destroy()
          this.enemies = this.enemies.filter(e => e !== enemy)
          this.stats.kills++
          this.stats.xp += (enemy.maxHp * 3);
          
          if (Math.random() < 0.4) {
            this.spawnChest(enemy.sprite.x, enemy.sprite.y)
          }

          // Condición de limpieza completada: Destrucción de barreras transicionales
          if (this.enemies.length === 0) {
            this.floorActive = false;
            
            this.obstacles = this.obstacles.filter((obs) => {
              if (obs.isDoor) {
                obs.sprite.destroy();
                obs.crystal.destroy();
                return false; 
              }
              return true; 
            });

            console.log("¡Puertas abiertas!");
            if (Math.random() < 0.25) this.spawnChest(320, 180);
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

  spawnChest(x, y) {
    const chest = this.add.sprite(x, y, 'chest', 0)
    chest.play('chest-closed')
    chest.setDepth(40)
    this.chests.push({ sprite: chest, opened: false })
  }

  enemyAttack(enemy) {
    if (this.gameOver) return

    enemy.isAttacking = true
    enemy.lastAttackTime = this.time.now
    enemy.sprite.setTexture('enemyAttack')
    enemy.sprite.play('enemy-attack')

    // El ataque aplica daño al final de la animación (400ms). ¡Permite esquivarlo con Dash!
    this.addTrackedTimer(400, () => {
      if (enemy.sprite.active && !this.gameOver) {
        enemy.isAttacking = false
        enemy.sprite.setTexture('enemy')
        enemy.sprite.play('enemy-idle')

        // Verificamos si el jugador sigue dentro del rango de impacto (con margen de gracia)
        const currentDist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.sprite.x, enemy.sprite.y)
        if (currentDist < 65) {
          const attackDamage = enemy.damage
          this.stats.hp -= attackDamage
          this.stats.totalDamageTaken += attackDamage
          this.player.hp = this.stats.hp

          if (this.stats.hp <= 0) {
            this.gameOver = true
            this.cancelAllTimers()
            
            if (this.onGameOver) {
              this.onGameOver({
                floor: this.currentFloor,
                kills: this.stats.kills,
                money: this.stats.money,
                itemsCollected: this.stats.itemsCollected.length,
                xp: this.stats.xp,
                totalDamageDealt: Math.round(this.stats.totalDamageDealt),
                totalDamageTaken: Math.round(this.stats.totalDamageTaken)
              })
            }
            this.scene.pause()
          }
        }
      }
    })
  }

  updateGameState() {
    const newStateStr = JSON.stringify({
      hp: this.stats.hp,
      maxHp: this.stats.maxHp,
      floor: this.currentFloor,
      kills: this.stats.kills,
      money: this.stats.money,
      damageMultiplier: this.stats.damageMultiplier,
      speedMultiplier: this.stats.speedMultiplier,
      attackSpeedMultiplier: this.stats.attackSpeedMultiplier,
      xp: this.stats.xp
    });

    // Optimización: Solo notificamos a React si los stats REALMENTE han cambiado
    if (this.lastStateStr !== newStateStr) {
      this.lastStateStr = newStateStr;
      if (this.onGameStateUpdate) {
        this.onGameStateUpdate(JSON.parse(newStateStr));
      }
    }
  }

  addTrackedTimer(delay, callback) {
    const timer = this.time.delayedCall(delay, () => {
      if (!this.gameOver) callback()
      this.pendingTimers = this.pendingTimers.filter(t => t !== timer)
    })
    this.pendingTimers.push(timer)
    return timer
  }

  cancelAllTimers() {
    this.pendingTimers.forEach(timer => {
      if (timer && timer.elapsed < timer.delay) {
        this.time.removeEvent(timer)
      }
    })
    this.pendingTimers = []
  }

  shutdown() {
    this.cancelAllTimers()
  }
}