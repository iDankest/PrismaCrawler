// ./src/services/gameLogic.js
//Esto se usuara para no ensuciar Controllers y añadir la logica del juego ejemplo calculateDamage() o checkCollision().

const prisma = require('../config/db.js');
const AppError = require('../utils/AppError.js');

const gameLogicService = { // Implementación sólo IA
  
  // --- 1. LÓGICA PURA DE JUEGO ---
  // Estas funciones no necesitan la base de datos, solo hacen cálculos.
  
  calculateDamage: (ataque, defensa) => {
    // Ejemplo: el daño es el ataque menos la defensa, pero nunca menos de 0
    const damage = ataque - defensa;
    return damage > 0 ? damage : 0;
  },

  checkCollision: (playerA, playerB) => {
    // Ejemplo básico: si están en las mismas coordenadas, hay colisión
    return playerA.x === playerB.x && playerA.y === playerB.y;
  },


  // --- 2. LÓGICA CON BASE DE DATOS ---
  // Estas funciones usan Prisma para leer o guardar cosas del juego.

  applyDamageToPlayer: async (attackerId, defenderId, attackerPower) => {
    try {
      // 1. Buscamos la defensa del jugador que recibe el golpe
      const defender = await prisma.player.findUnique({
        where: { id: defenderId }
      });

      if (!defender) throw new Error("Jugador defensor no encontrado");

      // 2. Calculamos el daño usando nuestra propia función de arriba
      const damageTaken = gameLogicService.calculateDamage(attackerPower, defender.defense);

      // 3. Actualizamos la salud del defensor en la base de datos
      const updatedDefender = await prisma.player.update({
        where: { id: defenderId },
        data: {
          hp: {
            decrement: damageTaken // Prisma tiene métodos para restar directamente
          }
        }
      });

      return {
        damageDealt: damageTaken,
        defenderRemainingHp: updatedDefender.hp
      };

    } catch (error) {
      console.error("Error en applyDamageToPlayer:", error);
      throw error; // Se lo lanzamos al controlador para que lo maneje
    }
  },
  // --- MOVER JUGADOR EN EL DUNGEON ---
  updatePlayerPosition: async (dungeonId, characterId, targetX, targetY) => {
    
    // 1. Verificamos que no haya una pared en esas coordenadas
    const tileDestino = await prisma.dungeonTile.findFirst({
      where: {
        dungeonId: dungeonId,
        x: targetX,
        y: targetY
      }
    });

    if (tileDestino && tileDestino.type === 'WALL') {
      throw new AppError("No puedes moverte ahí, hay una pared.", 400);
    }

    // 2. Movemos al jugador actualizando el DUNGEON
    const updatedDungeon = await prisma.dungeon.update({
      where: { id: dungeonId },
      data: {
        playerX: targetX,
        playerY: targetY
      }
    });

    // 3. Registramos el movimiento en el GameLog
    await prisma.gameLog.create({
      data: {
        characterId: characterId,
        eventType: 'PLAYER_MOVED',
        details: JSON.stringify({ fromX: targetX - 1, fromY: targetY - 1, toX: targetX, toY: targetY })
      }
    });

    return {
      newX: updatedDungeon.playerX,
      newY: updatedDungeon.playerY,
      message: "Te has movido correctamente"
    };
  },

  // --- ATACAR A UN ENEMIGO DEL DUNGEON ---
  attackEnemy: async (characterId, dungeonEnemyId, power) => {
    // 1. Buscamos al enemigo instanciado en el mapa
    const enemy = await prisma.dungeonEnemy.findUnique({
      where: { id: dungeonEnemyId }
    });

    if (!enemy) throw new AppError("Enemigo no encontrado", 404);

    // 2. Calculamos daño y restamos vida
    let newHp = enemy.currentHp - power;
    let isDead = false;

    if (newHp <= 0) {
      newHp = 0;
      isDead = true;
      
      // Si muere, podemos borrarlo del mapa
      await prisma.dungeonEnemy.delete({ where: { id: dungeonEnemyId } });
      
      await prisma.gameLog.create({
        data: { characterId, eventType: 'ENEMY_DIED', details: JSON.stringify({ enemyId: enemy.id }) }
      });
      
    } else {
      // Si no muere, actualizamos su vida
      await prisma.dungeonEnemy.update({
        where: { id: dungeonEnemyId },
        data: { currentHp: newHp }
      });
      
      await prisma.gameLog.create({
        data: { characterId, eventType: 'PLAYER_ATTACKED', details: JSON.stringify({ damage: power, enemyRemainingHp: newHp }) }
      });
    }

    return {
      damageDealt: power,
      enemyRemainingHp: newHp,
      isDead
    };
  },
// --- CURAR JUGADOR ---
  applyHealing: async (playerId, healAmount, itemId = null) => {
    // 1. Buscamos al jugador
    const player = await prisma.player.findUnique({
      where: { id: playerId }
    });

    if (!player) {
      throw new AppError("Jugador no encontrado para curación", 404);
    }

    // 2. Lógica pura: Calculamos la nueva vida sin pasarnos del máximo (ej. 100 de vida máxima)
    const MAX_HP = 100;
    let newHp = player.hp + healAmount;
    if (newHp > MAX_HP) {
      newHp = MAX_HP;
    }

    // 3. (Opcional) Si usó un objeto, aquí podrías descontarlo de su inventario en Prisma
    // if (itemId) { await prisma.inventory.update(...) }

    // 4. Actualizamos la vida del jugador en la base de datos
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: {
        hp: newHp
      }
    });

    return {
      healedAmount: healAmount,
      remainingHp: updatedPlayer.hp,
      message: newHp === MAX_HP ? "Salud al máximo" : "Curación aplicada"
    };
  }

};

module.exports = gameLogicService;