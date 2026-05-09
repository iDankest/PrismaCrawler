// ./src/controllers/gameController.js
const gameLogicService = require('../services/gameLogic.js');

const attackPlayer = async (req, res) => {
  try {
    const { attackerId, defenderId, power } = req.body;
    
    // El controlador NO sabe cómo se calcula el daño ni cómo se guarda en la BD.
    // Solo llama al servicio y espera el resultado.
    const result = await gameLogicService.applyDamageToPlayer(attackerId, defenderId, power);
    
    res.json({ success: true, matchInfo: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { attackPlayer };