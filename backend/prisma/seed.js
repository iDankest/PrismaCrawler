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