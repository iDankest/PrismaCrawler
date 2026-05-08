const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs')

async function main() {
    console.log('🌱 Este es un Seed de incio...')

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.upsert({
        where: {email: 'admin@admin.com'},
        update: {},
        create: {
            email: 'admin@admin.com',
            password: hashedPassword,
            role: 'ADMIN'
        }
    })
    const character = await prisma.character.upsert({
        where: {userId: user.id},
        update: {},
        create: {
            name: 'Hades el diablo',
            userId: user.id,
            level: 10 //Quizas cambiamos lo de los niveles 
        }
    })

    const monsters = await prisma.monster.createMany({
        data : [
            { name: 'Slime to chungo', type: 'BASIC', hp: 30, attack: 5 },
            { name: 'Orco feo feo', type: 'BASIC', hp: 120, attack: 15 },
            { name: 'Dragon que te deletea un fleje', type: 'BOSS', hp: 500, attack: 30 },
        ],
    })

    const items = await prisma.item.createMany({
        data: [
            {name: 'Espada Tochisima', type: 'WEAPON', value: 10, characterId: 1},
            {name: 'La POTI QUE LO CURA TODO', type: 'CONSUMABLE', value: 5, characterId: 1}
        ]
    })
    console.log('Seed Enviado y listo: '+ monsters.count, ' monstruos creados')
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });