const gameLogicService = require('../../src/services/gameLogic.js');
const prisma = require('../../src/config/db.js');

describe('Sistema de Items (Unitario)', () => {
  
  // Restauramos los mocks después de cada prueba para no afectar a otros archivos
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Debería obtener los items directamente de la lógica del juego', async () => {
    // Simulamos la respuesta de la base de datos para no depender de su estado real
    jest.spyOn(prisma.item, 'findMany').mockResolvedValue([
      { id: 1, name: 'Iron Sword', type: 'weapon', effects: [] },
      { id: 2, name: 'Espada de Fuego', type: 'weapon', effects: [] }
    ]);

    const items = await gameLogicService.getItems();
    
    expect(items.length).toBeGreaterThan(0);
    // Verificamos que uno de los items devueltos coincida con tu array interno
    // Cámbialo por el nombre real que tengas en gameLogicService
    expect(items.some(item => item.name === 'Iron Sword' || item.name === 'Espada de Fuego')).toBe(true);
  });
});