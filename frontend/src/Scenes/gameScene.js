// src/scenes/gameScene.js

import Phaser from "phaser";

// IMPORTAR SPRITES
import Personaje from "../assets/sprites/Personaje.png";
import PersonajeCaminar from "../assets/sprites/Personaje-Caminar.png";
import AtaquePJ from "../assets/sprites/AtaquePJ.png";
import Slime from "../assets/sprites/Slime.png";
import SmileAttack from "../assets/sprites/SmileAttack.png";
import Espada from "../assets/sprites/items/espada.png";
import Beer from "../assets/sprites/items/beer.png";
import Taza from "../assets/sprites/items/taza.png";
import Saco from "../assets/sprites/items/saco.png";
import Potion from "../assets/sprites/items/potion.png";
import Cofre from "../assets/sprites/items/Cofre.png";

// IMPORTAR DATABASE
import { ITEMS_DB, getRandomItem } from "../data/itemsDatabase";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.player = null;
    this.enemies = [];
    this.obstacles = [];
    this.items = [];
    this.chests = [];
    this.keys = null;
    this.playerDirection = 1;
    this.isAttacking = false;
    this.gameOver = false;
    this.pendingTimers = [];

    this.currentFloor = 0;
    this.floorActive = false;
    this.enemiesPerFloor = 2;

    this.stats = {
      kills: 0,
      money: 0,
      damageMultiplier: 1.0,
      speedMultiplier: 1.0,
      attackSpeedMultiplier: 1.0,
      itemsCollected: [],
      hp: 100,
      maxHp: 100,
    };

    this.onGameStateUpdate = null;
    this.onGameOver = null;
    this.onInventoryUpdate = null;
  }

  async preload() {
    try {
      const spriteConfigs = [
        { key: "playerIdle", url: Personaje, frameWidth: 64, frameHeight: 64 },
        {
          key: "playerWalk",
          url: PersonajeCaminar,
          frameWidth: 64,
          frameHeight: 64,
        },
        { key: "playerAttack", url: AtaquePJ, frameWidth: 64, frameHeight: 64 },
        { key: "enemy", url: Slime, frameWidth: 32, frameHeight: 32 },
        {
          key: "enemyAttack",
          url: SmileAttack,
          frameWidth: 32,
          frameHeight: 32,
        },
        { key: "chest", url: Cofre, frameWidth: 32, frameHeight: 32 },
        { key: "item_sword", url: Espada, frameWidth: 64, frameHeight: 64 },
        { key: "item_beer", url: Beer, frameWidth: 32, frameHeight: 32 },
        { key: "item_mug", url: Taza, frameWidth: 64, frameHeight: 64 },
        { key: "item_sack", url: Saco, frameWidth: 64, frameHeight: 64 },
        { key: "item_potion", url: Potion, frameWidth: 64, frameHeight: 64 },
      ];

      for (const config of spriteConfigs) {
        await this.load.spritesheet(config.key, config.url, {
          frameWidth: config.frameWidth,
          frameHeight: config.frameHeight,
        });
      }
    } catch (error) {
      console.error("Error cargando sprites:", error);
    }
  }

  create() {
    this.cameras.main.setBackgroundColor("#0f172a");

    this.createAnimations();

    this.player = this.add.sprite(320, 180, "playerIdle", 0);
    this.player.play("idle");
    this.player.setScale(1);
    this.player.scaleX = 1;
    this.player.hp = 100;
    this.player.maxHp = 100;
    this.player.setDepth(100);

    // Se crean los obstáculos base y enemigos aleatorios (Floor 1).
    // Si viene un mapa del backend, setupBackendMap() limpiará esto inmediatamente.
    this.createDungeonObstacles();

    this.keys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    this.startFloor();
  }

  // --- NUEVO: MÉTODO PARA CARGAR EL MAPA DEL BACKEND (PRISMA) ---
  setupBackendMap(mapData) {
    if (!mapData || !mapData.layout) return;

    console.log("Configurando mapa desde Backend...", mapData);

    // 1. Limpiamos los obstáculos y enemigos generados por defecto en el create()
    this.obstacles.forEach((obs) => {
      obs.sprite.destroy();
      obs.crystal.destroy();
    });
    this.obstacles = [];

    this.enemies.forEach((enemy) => {
      enemy.sprite.destroy();
    });
    this.enemies = [];

    // Ajustamos piso actual (El mapa del backend será el Piso 1)
    this.currentFloor = 1;
    this.floorActive = true;

    // 2. Calculamos el tamaño de cada "casilla" según las dimensiones del layout
    const rows = mapData.layout.length;
    const cols = mapData.layout[0].length;
    
    // Canvas total de Phaser (640x360) dividido por número de celdas
    const cellWidth = 640 / cols; 
    const cellHeight = 360 / rows;

    // 3. Recorremos la matriz del backend
    mapData.layout.forEach((rowString, y) => {
      rowString.split("").forEach((char, x) => {
        // Encontramos el centro de la celda en píxeles
        const posX = x * cellWidth + cellWidth / 2;
        const posY = y * cellHeight + cellHeight / 2;

        if (char === "#") {
          // Es un muro
          this.createObstacleAt(posX, posY, cellWidth, cellHeight);
        } else if (char === "P") {
          // Posición inicial del Jugador
          this.player.x = posX;
          this.player.y = posY;
        } else if (char === "M") {
          // Es un enemigo, le pasamos las stats del diccionario o unas por defecto
          const stats = mapData.dictionary[char] || { hp: 30, damage: 5 };
          this.spawnEnemyAt(posX, posY, stats);
        }
      });
    });
  }

  // --- NUEVO: MÉTODO PARA CREAR OBSTÁCULOS DINÁMICOS ---
  createObstacleAt(x, y, w, h) {
    // Para evitar que los muros estén "pegados", les quitamos un poco de margen visual
    const renderW = w + 1; // Ajuste fino para tapar huecos entre grillas
    const renderH = h + 1;

    const obstacle = this.add.rectangle(x, y, renderW, renderH, 0x1e293b);
    obstacle.setStrokeStyle(1, 0x0ea5e9); // Borde más fino para paredes conjuntas
    obstacle.setDepth(5);

    const crystal = this.add.rectangle(x, y, renderW - 4, renderH - 4, 0x3b82f6);
    crystal.setAlpha(0.15);
    crystal.setDepth(4);

    this.obstacles.push({
      sprite: obstacle,
      crystal: crystal,
      x: x,
      y: y,
      width: w,
      height: h,
    });
  }

  // --- NUEVO: MÉTODO PARA APARECER ENEMIGOS ESPECÍFICOS DEL BACKEND ---
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

  createAnimations() {
    // Player
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("playerIdle", {
        start: 0,
        end: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("playerWalk", {
        start: 0,
        end: 2,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "attack",
      frames: this.anims.generateFrameNumbers("playerAttack", {
        start: 0,
        end: 3,
      }),
      frameRate: 15,
      repeat: 0,
    });

    // Enemy
    this.anims.create({
      key: "enemy-idle",
      frames: this.anims.generateFrameNumbers("enemy", { start: 0, end: 2 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "enemy-attack",
      frames: this.anims.generateFrameNumbers("enemyAttack", {
        start: 0,
        end: 3,
      }),
      frameRate: 12,
      repeat: 0,
    });

    // Chest - Solo frame 0 (cerrado) y frame 1 (abierto)
    this.anims.create({
      key: "chest-closed",
      frames: [{ key: "chest", frame: 0 }],
      frameRate: 1,
    });

    this.anims.create({
      key: "chest-opening",
      frames: this.anims.generateFrameNumbers("chest", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "chest-open",
      frames: [{ key: "chest", frame: 1 }],
      frameRate: 1,
    });
  }

  createDungeonObstacles() {
    const obstaclePositions = [
      { x: 80, y: 80, w: 80, h: 50 },
      { x: 560, y: 80, w: 80, h: 50 },
      { x: 80, y: 280, w: 80, h: 50 },
      { x: 560, y: 280, w: 80, h: 50 },
      { x: 120, y: 180, w: 60, h: 80 },
      { x: 520, y: 180, w: 60, h: 80 },
    ];

    obstaclePositions.forEach((pos) => {
      const obstacle = this.add.rectangle(pos.x, pos.y, pos.w, pos.h, 0x1e293b);
      obstacle.setStrokeStyle(2, 0x0ea5e9);
      obstacle.setDepth(5);

      const crystal = this.add.rectangle(
        pos.x,
        pos.y,
        pos.w - 4,
        pos.h - 4,
        0x3b82f6,
      );
      crystal.setAlpha(0.15);
      crystal.setDepth(4);

      this.obstacles.push({
        sprite: obstacle,
        crystal: crystal,
        x: pos.x,
        y: pos.y,
        width: pos.w,
        height: pos.h,
      });
    });
  }

  checkObstacleCollision(x, y, radius = 20) {
    for (let obstacle of this.obstacles) {
      // Eje X
      const halfWidth = obstacle.width / 2;
      const minX = obstacle.x - halfWidth - radius;
      const maxX = obstacle.x + halfWidth + radius;
      const closestX = Phaser.Math.Clamp(x, minX, maxX);

      // Eje Y
      const halfHeight = obstacle.height / 2;
      const minY = obstacle.y - halfHeight - radius;
      const maxY = obstacle.y + halfHeight + radius;
      const closestY = Phaser.Math.Clamp(y, minY, maxY);

      const dist = Phaser.Math.Distance.Between(x, y, closestX, closestY);
      if (dist < radius) {
        return true;
      }
    }
    return false;
  }

  update() {
    if (this.gameOver) return;

    let isMoving = false;
    let nextX = this.player.x;
    let nextY = this.player.y;
    const moveSpeed = 3 * this.stats.speedMultiplier;

    if (this.keys.W.isDown) {
      nextY -= moveSpeed;
      isMoving = true;
    }
    if (this.keys.S.isDown) {
      nextY += moveSpeed;
      isMoving = true;
    }
    if (this.keys.A.isDown) {
      nextX -= moveSpeed;
      isMoving = true;
      this.playerDirection = -1;
    }
    if (this.keys.D.isDown) {
      nextX += moveSpeed;
      isMoving = true;
      this.playerDirection = 1;
    }

    if (this.keys.SPACE.isDown && !this.isAttacking) {
      this.attack();
    }

    let canMove = true;

    this.enemies.forEach((enemy) => {
      const distance = Phaser.Math.Distance.Between(
        nextX,
        nextY,
        enemy.sprite.x,
        enemy.sprite.y,
      );
      if (distance < 35) {
        canMove = false;
      }
    });

    if (this.checkObstacleCollision(nextX, nextY, 24)) {
      canMove = false;
    }

    if (canMove) {
      this.player.x = Phaser.Math.Clamp(nextX, 32, 608);
      this.player.y = Phaser.Math.Clamp(nextY, 32, 328);
    }

    this.player.scaleX = this.playerDirection;

    if (!this.isAttacking) {
      if (isMoving) {
        if (this.player.anims.currentAnim?.key !== "walk") {
          this.player.setTexture("playerWalk");
          this.player.play("walk", true);
        }
      } else {
        if (this.player.anims.currentAnim?.key !== "idle") {
          this.player.setTexture("playerIdle");
          this.player.play("idle", true);
        }
      }
    }

    this.enemies.forEach((enemy) => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        enemy.sprite.x,
        enemy.sprite.y,
      );

      const currentTime = this.time.now;

      if (
        distance < 50 &&
        !enemy.isAttacking &&
        currentTime - enemy.lastAttackTime > enemy.attackCooldown
      ) {
        this.enemyAttack(enemy);
      }

      if (distance > 40 && distance < 200 && !enemy.isAttacking) {
        const angle = Phaser.Math.Angle.Between(
          enemy.sprite.x,
          enemy.sprite.y,
          this.player.x,
          this.player.y,
        );
        enemy.sprite.x += Math.cos(angle) * 0.8;
        enemy.sprite.y += Math.sin(angle) * 0.8;

        if (enemy.sprite.anims.currentAnim?.key !== "enemy-idle") {
          enemy.sprite.play("enemy-idle");
        }
      }

      enemy.sprite.x = Phaser.Math.Clamp(enemy.sprite.x, 32, 608);
      enemy.sprite.y = Phaser.Math.Clamp(enemy.sprite.y, 32, 328);
    });

    this.items = this.items.filter((item) => {
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        item.sprite.x,
        item.sprite.y,
      );
      if (dist < 30) {
        this.collectItem(item);
        return false;
      }
      return true;
    });

    this.chests = this.chests.filter((chest) => {
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        chest.sprite.x,
        chest.sprite.y,
      );
      if (dist < 40 && !chest.opened) {
        this.openChest(chest);
        return false;
      }
      return true;
    });

    this.updateGameState();
  }

  startFloor() {
    this.currentFloor++;
    this.floorActive = true;

    this.enemies.forEach((enemy) => {
      if (enemy.sprite.active) enemy.sprite.destroy();
    });
    this.enemies = [];

    const enemyCount = this.enemiesPerFloor + Math.floor(this.currentFloor / 2);
    const enemyHpMultiplier = 1 + (this.currentFloor - 1) * 0.35;
    const enemyDamageMultiplier = 1 + (this.currentFloor - 1) * 0.25;

    for (let i = 0; i < enemyCount; i++) {
      this.spawnEnemy(enemyHpMultiplier, enemyDamageMultiplier);
    }
  }

  spawnEnemy(hpMultiplier = 1, damageMultiplier = 1) {
    let x, y, tooClose;
    let attempts = 0;

    do {
      attempts++;
      tooClose = false;
      x = Phaser.Math.Between(80, 560);
      y = Phaser.Math.Between(80, 280);

      const distToPlayer = Phaser.Math.Distance.Between(x, y, 320, 180);
      if (distToPlayer < 120) {
        tooClose = true;
      }

      if (this.checkObstacleCollision(x, y, 30)) {
        tooClose = true;
      }

      if (attempts > 50) {
        tooClose = false;
      }
    } while (tooClose);

    const enemy = this.add.sprite(x, y, "enemy", 0);
    enemy.play("enemy-idle");
    enemy.setScale(1.5);
    enemy.setDepth(50);

    const baseHp = 30;
    const baseDamage = 5;
    const attackCooldown = Math.max(600, 1000 - this.currentFloor * 50);

    this.enemies.push({
      sprite: enemy,
      hp: Math.round(baseHp * hpMultiplier),
      maxHp: Math.round(baseHp * hpMultiplier),
      isAttacking: false,
      lastAttackTime: 0,
      attackCooldown: attackCooldown,
      damage: Math.round(baseDamage * damageMultiplier),
    });
  }

  openChest(chest) {
    chest.opened = true;
    chest.sprite.play("chest-opening");

    this.time.delayedCall(400, () => {
      if (chest.sprite.active) {
        chest.sprite.play("chest-open");

        // ✅ Usar DB para obtener item aleatorio
        const item = getRandomItem();
        this.spawnItemFromChest(chest.sprite.x, chest.sprite.y, item);
      }
    });
  }

  spawnItemFromChest(x, y, itemData) {
    const itemSprite = this.add.sprite(x, y, itemData.spriteKey, 0);
    itemSprite.setScale(0.8);
    itemSprite.setDepth(30);

    const itemObj = {
      sprite: itemSprite,
      type: itemData.id,
      data: itemData,
    };

    this.items.push(itemObj);

    // ✅ Animación: item sube y crece
    this.tweens.add({
      targets: itemSprite,
      y: y - 50,
      scale: 1.5,
      duration: 600,
      ease: "Back.out",
    });

    // Rotación mientras sube
    this.tweens.add({
      targets: itemSprite,
      rotation: Math.PI * 2,
      duration: 600,
      ease: "Linear",
    });

    // Flotación continua después
    this.tweens.add({
      targets: itemSprite,
      y: itemSprite.y - 10,
      duration: 1200,
      delay: 600,
      repeat: -1,
      yoyo: true,
      ease: "Sine.inout",
    });
  }

  collectItem(item) {
    item.sprite.destroy();

    // ✅ Aplicar efecto del item según su tipo
    const effect = item.data.effect;

    switch (effect.type) {
      case "damageMultiplier":
        this.stats.damageMultiplier *= effect.value;
        console.log(
          `⚔️ Damage increased to ${(this.stats.damageMultiplier * 100).toFixed(0)}%`,
        );
        break;
      case "attackSpeedMultiplier":
        this.stats.attackSpeedMultiplier *= effect.value;
        console.log(
          `⚡ Attack speed increased to ${(this.stats.attackSpeedMultiplier * 100).toFixed(0)}%`,
        );
        break;
      case "speedMultiplier":
        this.stats.speedMultiplier *= effect.value;
        console.log(
          `💨 Movement speed increased to ${(this.stats.speedMultiplier * 100).toFixed(0)}%`,
        );
        break;
      case "maxHpBoost":
        this.stats.maxHp += effect.value;
        this.stats.hp = Math.min(
          this.stats.hp + effect.value,
          this.stats.maxHp,
        );
        this.player.hp = this.stats.hp;
        this.player.maxHp = this.stats.maxHp;
        console.log(`❤️ Max HP increased to ${this.stats.maxHp}`);
        break;
      case "heal":
        this.stats.hp = Math.min(
          this.stats.hp + effect.value,
          this.stats.maxHp,
        );
        this.player.hp = this.stats.hp;
        console.log(`💚 Healed for ${effect.value} HP`);
        break;
    }

    this.stats.itemsCollected.push(item.type);

    if (this.onInventoryUpdate) {
      this.onInventoryUpdate(this.stats.itemsCollected);
    }
  }

  attack() {
    this.isAttacking = true;
    this.player.setTexture("playerAttack");
    this.player.play("attack", true);

    const attackRange = 80;
    const attackDamage = 10 * this.stats.damageMultiplier;

    this.enemies.forEach((enemy) => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x + this.playerDirection * 40,
        this.player.y,
        enemy.sprite.x,
        enemy.sprite.y,
      );

      if (distance < attackRange) {
        enemy.hp -= attackDamage;

        if (enemy.hp <= 0) {
          enemy.sprite.destroy();
          this.enemies = this.enemies.filter((e) => e !== enemy);
          this.stats.kills++;

          if (Math.random() < 0.4) {
            this.spawnChest(enemy.sprite.x, enemy.sprite.y);
          }

          if (this.enemies.length === 0) {
            this.floorActive = false;

            this.addTrackedTimer(1500, () => {
              if (!this.gameOver) {
                // Al morir el último enemigo del mapa del backend, 
                // pasamos a Floor 2 que usará la generación procedural
                this.startFloor();
              }
            });
          }
        }
      }
    });

    this.addTrackedTimer(400, () => {
      if (this.player.active) {
        this.isAttacking = false;
        this.player.setTexture("playerIdle");
      }
    });
  }

  spawnChest(x, y) {
    const chest = this.add.sprite(x, y, "chest", 0);
    chest.play("chest-closed");
    chest.setDepth(40);

    this.chests.push({
      sprite: chest,
      opened: false,
    });
  }

  enemyAttack(enemy) {
    if (this.gameOver) return;

    enemy.isAttacking = true;
    enemy.lastAttackTime = this.time.now;
    enemy.sprite.setTexture("enemyAttack");
    enemy.sprite.play("enemy-attack", true);

    const attackDamage = enemy.damage;
    this.stats.hp -= attackDamage;
    this.player.hp = this.stats.hp;

    if (this.stats.hp <= 0) {
      this.gameOver = true;
      this.cancelAllTimers();

      if (this.onGameOver) {
        this.onGameOver({
          floor: this.currentFloor,
          kills: this.stats.kills,
          money: this.stats.money,
          itemsCollected: this.stats.itemsCollected.length,
        });
      }

      this.scene.pause();
      return;
    }

    this.addTrackedTimer(400, () => {
      if (enemy.sprite.active) {
        enemy.isAttacking = false;
        enemy.sprite.setTexture("enemy");
        enemy.sprite.play("enemy-idle");
      }
    });
  }

  updateGameState() {
    if (this.onGameStateUpdate) {
      this.onGameStateUpdate({
        hp: this.stats.hp,
        maxHp: this.stats.maxHp,
        floor: this.currentFloor,
        kills: this.stats.kills,
        money: this.stats.money,
        damageMultiplier: this.stats.damageMultiplier,
        speedMultiplier: this.stats.speedMultiplier,
        attackSpeedMultiplier: this.stats.attackSpeedMultiplier,
      });
    }
  }

  addTrackedTimer(delay, callback) {
    const timer = this.time.delayedCall(delay, () => {
      if (!this.gameOver) {
        callback();
      }
      this.pendingTimers = this.pendingTimers.filter((t) => t !== timer);
    });
    this.pendingTimers.push(timer);
    return timer;
  }

  cancelAllTimers() {
    this.pendingTimers.forEach((timer) => {
      if (timer && timer.elapsed < timer.delay) {
        this.time.removeEvent(timer);
      }
    });
    this.pendingTimers = [];
  }

  shutdown() {
    this.cancelAllTimers();
  }
}