const verifyToken = require('../../src/middlewares/authMiddleware.js');
const jwt = require('jsonwebtoken');

describe('Middleware de Autenticación', () => {
  let req, res, next;

  beforeEach(() => {
    // Simulamos los objetos de Express
    req = { header: jest.fn() };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('Debería rechazar si no se envía ningún token (401)', () => {
    req.header.mockReturnValue(undefined);
    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Acceso denegado. No hay token.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('Debería rechazar si el token es inválido (400)', () => {
    req.header.mockReturnValue('Bearer token_falso_123');
    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token no válido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('Debería permitir el paso (llamar a next) si el token es válido', () => {
    const tokenValido = jwt.sign({ userId: 99 }, process.env.JWT_SECRET || 'mi_clave_secreta_super_segura');
    req.header.mockReturnValue(`Bearer ${tokenValido}`);
    verifyToken(req, res, next);

    expect(req.user).toHaveProperty('userId', 99);
    expect(next).toHaveBeenCalledTimes(1);
  });
});