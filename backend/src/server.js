const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// RUTA LEADERBOARD
app.get('/api/leaderboard', async (req, res) => {
  try {
    const characters = await prisma.character.findMany({
      orderBy: { totalDamageDone: 'desc' },
    });
    res.status(200).json(characters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en la DB. ¿Has hecho el seed?" });
  }
});

// RUTA ITEMS (La que te daba 404)
app.post('/api/items', async (req, res) => {
  try {
    const { name, type, value, characterId } = req.body;
    const newItem = await prisma.item.create({
      data: { name, type, value, characterId }
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "No se pudo crear el ítem" });
  }
});

module.exports = app;