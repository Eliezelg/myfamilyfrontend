import axios from 'axios';
import { login, register, logout, verifyEmail, resetPassword } from '../../services/authService';

// Mock axios
jest.mock('axios');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('login', () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockResponse = {
      data: {
        token: 'fake-token',
        user: {
          id: 1,
          email: 'test@example.com'
        }
      }
    };

    it('successfully logs in user', async () => {
      axios.post.mockResolvedValue(mockResponse);

      const result = await login(mockCredentials);

      expect(axios.post).toHaveBeenCalledWith('/api/auth/login', mockCredentials);
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem('token')).toBe(mockResponse.data.token);
    });

    it('handles login error', async () => {
      const errorMessage = 'Invalid credentials';
      axios.post.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await expect(login(mockCredentials)).rejects.toThrow(errorMessage);
    });
  });

  describe('register', () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    };

    it('successfully registers user', async () => {
      const mockResponse = {
        data: {
          message: 'Registration successful'
        }
      };

      axios.post.mockResolvedValue(mockResponse);

      const result = await register(mockUser);

      expect(axios.post).toHaveBeenCalledWith('/api/auth/register', mockUser);
      expect(result).toEqual(mockResponse.data);
    });

    it('handles registration error', async () => {
      const errorMessage = 'Email already exists';
      axios.post.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await expect(register(mockUser)).rejects.toThrow(errorMessage);
    });
  });

  describe('logout', () => {
    it('successfully logs out user', () => {
      localStorage.setItem('token', 'fake-token');
      
      logout();
      
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('verifyEmail', () => {
    const token = 'verification-token';

    it('successfully verifies email', async () => {
      const mockResponse = {
        data: {
          message: 'Email verified successfully'
        }
      };

      axios.post.mockResolvedValue(mockResponse);

      const result = await verifyEmail(token);

      expect(axios.post).toHaveBeenCalledWith('/api/auth/verify-email', { token });
      expect(result).toEqual(mockResponse.data);
    });

    it('handles verification error', async () => {
      const errorMessage = 'Invalid token';
      axios.post.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await expect(verifyEmail(token)).rejects.toThrow(errorMessage);
    });
  });

  describe('resetPassword', () => {
    const mockData = {
      token: 'reset-token',
      password: 'newpassword123'
    };

    it('successfully resets password', async () => {
      const mockResponse = {
        data: {
          message: 'Password reset successful'
        }
      };

      axios.post.mockResolvedValue(mockResponse);

      const result = await resetPassword(mockData);

      expect(axios.post).toHaveBeenCalledWith('/api/auth/reset-password', mockData);
      expect(result).toEqual(mockResponse.data);
    });

    it('handles reset password error', async () => {
      const errorMessage = 'Invalid token';
      axios.post.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await expect(resetPassword(mockData)).rejects.toThrow(errorMessage);
    });
  });
});
