const { generateToken, clearToken } = require('../../../src/utils/generateToken');
const jwt = require('jsonwebtoken');

describe('Token Generation Utilities', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      cookie: jest.fn(),
    };
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.JWT_EXPIRES_IN = '7d';
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(mockRes, userId);

      // Verify token was created
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      // Verify token contains correct payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe(userId);
    });

    it('should set httpOnly cookie', () => {
      const userId = '507f1f77bcf86cd799439011';
      generateToken(mockRes, userId);

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'token',
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
        })
      );
    });
  });

  describe('clearToken', () => {
    it('should clear the token cookie', () => {
      clearToken(mockRes);

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'token',
        '',
        expect.objectContaining({
          httpOnly: true,
          expires: expect.any(Date),
        })
      );
    });
  });
});
