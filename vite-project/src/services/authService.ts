import { ApiResponse, AuthResponse, User } from '../types';
import { apiFetch, setAuthToken } from './api';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await apiFetch<ApiResponse<AuthResponse>>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(res.data.token);
      return res.data;
    } catch {
      // Mock login for offline testing
      const mockAuth: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        type: 'Bearer',
        userId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
        email,
        firstName: email.split('@')[0],
        lastName: 'Usuario',
        role: email.includes('admin') ? 'admin' : 'customer',
      };
      setAuthToken(mockAuth.token);
      return mockAuth;
    }
  },

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<AuthResponse> {
    try {
      const res = await apiFetch<ApiResponse<AuthResponse>>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setAuthToken(res.data.token);
      return res.data;
    } catch {
      const mockAuth: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        type: 'Bearer',
        userId: 'user-' + Date.now(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'customer',
      };
      setAuthToken(mockAuth.token);
      return mockAuth;
    }
  },

  async getProfile(): Promise<User> {
    try {
      const res = await apiFetch<ApiResponse<User>>('/auth/profile');
      return res.data;
    } catch {
      return {
        id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
        email: 'juan.perez@email.com',
        firstName: 'Juan',
        lastName: 'Pérez',
        phone: '+5491187654321',
        role: 'customer',
        isActive: true,
      };
    }
  },

  logout(): void {
    setAuthToken(null);
  },
};
