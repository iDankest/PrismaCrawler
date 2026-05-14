const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function main() {
  console.log("🌱 Sincronizando con el Schema real...");

  await prisma.item.deleteMany({});
  await prisma.map.deleteMany({});
  await prisma.score.deleteMany({});

  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: "admin@admin.com",
      password: hashedPassword,
      name: "Kilian Admin",
      role: "ADMIN",
    },
  });

  const itemsData = [
    {
      name: "Espada de Hierro",
      spriteKey: "item_sword",
      description: "+50% Damage",
      rarity: "rare",
      effects: [ { type: "damageMultiplier", value: 1.5 } ], 
      // HEMOS QUITADO effectValue PORQUE TU SCHEMA YA NO LO TIENE
      isConsumable: false,
    },
    {
      name: "Cerveza de Haste",
      spriteKey: "item_beer",
      description: "+30% Attack Speed",
      rarity: "uncommon",
      effects: [ { type: "attackSpeedMultiplier", value: 1.3 } ],
      isConsumable: false,
    },
    {
      name: "Poción de Salud",
      spriteKey: "item_potion",
      description: "Restore 30 HP",
      rarity: "common",
      effects: [ { type: "heal", value: 30.0 } ],
      isConsumable: true,
    },
    {
      name: "Té Enfermizo",
      spriteKey: "item_tea",
      description: "Velocidad +10%",
      rarity: "uncommon",
      effects: [ { type: "speedMultiplier", value: 1.1 } ],
      isConsumable: false,
    },
    {
      name: "Sack of Weight",
      spriteKey: "item_sack",
      description: "-50% Speed, +50 HP",
      rarity: "common",
      effects: [
        { type: "speedMultiplier", value: 0.5 },
        { type: "maxHpBoost", value: 50.0 }
      ],
      isConsumable: false,
    },
  ];

  const items = await prisma.item.createMany({ data: itemsData });
  console.log(`✅ ${items.count} items creados.`);

  await prisma.map.create({
    data: {
      id: 1,
      name: "Nivel 1: Mazmorra de Cristal",
      level: 1,
      layout: [
        "####DD####",
        "#_M______#",
        "#__T__M__#",
        "#_r___M__#",
        "#_____M__#",
        "#_____P__#",
        "####DD####"
      ],
      dictionary: {
        M: { type: "enemy", name: "Slime", hp: 30 },
        D: { type: "door" },
        T: { type: "loot" },
        P: { type: "Player" },
        r: { type: "obstacle" },
      },
    },
  });
  // 1. Mapa Pequeño: "El Duelo" (Rápido y letal)
await prisma.map.create({
  data: {
    id: 2,
    name: "Nivel 2: Pasadizo Angosto",
    level: 2,
    layout: [
      "###DD###",
      "#M____M#",
      "#__P___#",
      "#r_M__r#",
      "###DD###"
    ],
    dictionary: {
      M: { type: "enemy", name: "Slime Rojo", hp: 45 },
      D: { type: "door" },
      P: { type: "Player" },
      r: { type: "obstacle" }
    }
  }
});

// 2. Mapa Grande: "La Gran Sala" (Mucho loot pero muchos Slimes)
await prisma.map.create({
  data: {
    id: 3,
    name: "Nivel 3: Almacén Abandonado",
    level: 3,
    layout: [
      "##########DD##########",
      "#M______r____r______M#",
      "#___T________T_______#",
      "#_r____M____M____r___#",
      "#______M_P__M________#",
      "#_r____M____M____r___#",
      "#___T________T_______#",
      "#M______r____r______M#",
      "##########DD##########"
    ],
    dictionary: {
      M: { type: "enemy", name: "Slime Guerrero", hp: 60 },
      D: { type: "door" },
      T: { type: "loot" },
      P: { type: "Player" },
      r: { type: "obstacle" }
    }
  }
});

// 3. Mapa Laberíntico: "El Zigzag" (Muchos obstáculos)
await prisma.map.create({
  data: {
    id: 4,
    name: "Nivel 4: Ruinas Enredadas",
    level: 4,
    layout: [
      "####DD####",
      "#P_r____M#",
      "#r_r_M_r_#",
      "#__M_r_r_#",
      "#r_r_M___#",
      "#T___r_M_#",
      "####DD####"
    ],
    dictionary: {
      M: { type: "enemy", name: "Slime Ácido", hp: 50 },
      D: { type: "door" },
      T: { type: "loot" },
      P: { type: "Player" },
      r: { type: "obstacle" }
    }
  }
});

// 4. Mapa de Emboscada: "La Arena" (Enemigos rodeando el centro)
await prisma.map.create({
  data: {
    id: 5,
    name: "Nivel 5: Foso de Práctica",
    level: 5,
    layout: [
      "#######",
      "#M_M_M#",
      "#_T_T_#",
      "#M_P_M#",
      "#_r_r_#",
      "#M_M_M#",
      "###D###"
    ],
    dictionary: {
      M: { type: "enemy", name: "Mini Slime", hp: 20 },
      D: { type: "door" },
      T: { type: "loot" },
      P: { type: "Player" },
      r: { type: "obstacle" }
    }
  }
});

// 5. Mapa Horizontal: "El Corredor de Cristal"
await prisma.map.create({
  data: {
    id: 6,
    name: "Nivel 6: Galería de los Espejos",
    level: 6,
    layout: [
      "######################",
      "D_P__r_M_r_M_r_M_T_M_D",
      "######################"
    ],
    dictionary: {
      M: { type: "enemy", name: "Slime de Cristal", hp: 80 },
      D: { type: "door" },
      T: { type: "loot" },
      P: { type: "Player" },
      r: { type: "obstacle" }
    }
  }
});

  console.log("🚀 ¡POR FIN! Seed completado.");
}

main()
  .catch((e) => {
    console.error("❌ Error en el Seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });