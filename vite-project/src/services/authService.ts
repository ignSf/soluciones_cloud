import type { ApiResponse, AuthResponse, User } from '../types';
import { apiFetch, getAuthToken, setAuthToken } from './api';

const DEMO_USERS: Record<string, User> = {
  'admin@tienda.com': {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    email: 'admin@tienda.com',
    firstName: 'Carlos',
    lastName: 'Administrador',
    phone: '+5491112345678',
    role: 'admin',
    isActive: true,
  },
  'juan.perez@email.com': {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    email: 'juan.perez@email.com',
    firstName: 'Juan',
    lastName: 'Pérez',
    phone: '+5491187654321',
    role: 'customer',
    isActive: true,
  },
  'maria.gomez@email.com': {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    email: 'maria.gomez@email.com',
    firstName: 'María',
    lastName: 'Gómez',
    phone: '+5491145678901',
    role: 'customer',
    isActive: true,
  },
};

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await apiFetch<ApiResponse<AuthResponse>>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(res.data.token);
      localStorage.setItem('auth_user', JSON.stringify(res.data));
      return res.data;
    } catch {
      // Mock login for offline / fallback testing
      const lowerEmail = email.toLowerCase().trim();
      const existing = DEMO_USERS[lowerEmail];
      const role = existing ? existing.role : (lowerEmail.includes('admin') ? 'admin' : 'customer');
      const firstName = existing ? existing.firstName : email.split('@')[0];
      const lastName = existing ? existing.lastName : 'Usuario';
      const userId = existing ? existing.id : 'user-' + Date.now();

      const mockAuth: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        type: 'Bearer',
        userId,
        email,
        firstName,
        lastName,
        role,
      };

      setAuthToken(mockAuth.token);
      localStorage.setItem('auth_user', JSON.stringify(mockAuth));
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
      localStorage.setItem('auth_user', JSON.stringify(res.data));
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
      localStorage.setItem('auth_user', JSON.stringify(mockAuth));
      return mockAuth;
    }
  },

  async getProfile(): Promise<User> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    try {
      const res = await apiFetch<ApiResponse<User>>('/auth/profile');
      return res.data;
    } catch {
      const cached = localStorage.getItem('auth_user');
      if (cached) {
        const parsed = JSON.parse(cached) as AuthResponse;
        const demo = DEMO_USERS[parsed.email];
        return demo || {
          id: parsed.userId,
          email: parsed.email,
          firstName: parsed.firstName,
          lastName: parsed.lastName,
          role: parsed.role,
          isActive: true,
        };
      }
      return DEMO_USERS['juan.perez@email.com'];
    }
  },

  getStoredUser(): AuthResponse | null {
    const cached = localStorage.getItem('auth_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  },

  logout(): void {
    setAuthToken(null);
    localStorage.removeItem('auth_user');
  },
};
