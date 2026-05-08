const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Este es un Seed de incio...')

    const monsters = await prisma.monster.createMany({
        data : [
            { name: 'Slime to chungo', type: 'BASIC', hp: 30, attack: 5 },
            { name: 'Orco feo feo', type: 'BASIC', hp: 120, attack: 15 },
            { name: 'Dragon que te deletea un fleje', type: 'BOSS', hp: 500, attack: 30 },
        ],
    })

}