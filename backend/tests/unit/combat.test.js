const gameLogicService = require('../../src/services/gameLogic.js');

describe('Sistema de Combate (Unitario)', () => {
  
  it('Debería calcular el daño correctamente sin multiplicador', () => {
    const damage = gameLogicService.calculateDamage(15);
    expect(damage).toBe(15);
  });

  it('Debería calcular el daño correctamente con multiplicador', () => {
    const damage = gameLogicService.calculateDamage(10, 1.5);
    expect(damage).toBe(15);
  });

  it('Debería redondear hacia abajo si el resultado tiene decimales', () => {
    const damage = gameLogicService.calculateDamage(10, 1.25);
    expect(damage).toBe(12);
  });
});