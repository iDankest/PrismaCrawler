const gameLogicService = require('../../src/services/gameLogic.js');

describe('Sistema de Items (Unitario)', () => {
  
  // Restauramos los mocks después de cada prueba para no afectar a otros archivos
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Debería obtener los items directamente de la lógica del juego', async () => {
    const items = await gameLogicService.getItems();
    
    expect(items.length).toBeGreaterThan(0);
    // Verificamos que uno de los items devueltos coincida con tu array interno
    // Cámbialo por el nombre real que tengas en gameLogicService
    expect(items.some(item => item.name === 'Iron Sword' || item.name === 'Espada de Fuego')).toBe(true);
  });
});