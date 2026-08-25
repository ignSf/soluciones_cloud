import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse, User } from '../types';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  authUser: AuthResponse | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<void>;
  demoLogin: (email: 'admin@tienda.com' | 'juan.perez@email.com' | 'maria.gomez@email.com') => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthResponse | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const stored = authService.getStoredUser();
    if (stored) {
      setAuthUser(stored);
      authService.getProfile().then(setUser).catch(() => setUser(null));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, pass);
      setAuthUser(res);
      await refreshProfile();
      showToast('¡Bienvenido!', `Has iniciado sesión como ${res.firstName}`, 'success');
    } catch (err: any) {
      showToast('Error de autenticación', err.message || 'Credenciales inválidas', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      setAuthUser(res);
      await refreshProfile();
      showToast('Cuenta creada', `Bienvenido a la tienda, ${res.firstName}`, 'success');
    } catch (err: any) {
      showToast('Error de registro', err.message || 'No se pudo crear la cuenta', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (email: 'admin@tienda.com' | 'juan.perez@email.com' | 'maria.gomez@email.com') => {
    await login(email, 'demo1234');
  };

  const logout = () => {
    authService.logout();
    setAuthUser(null);
    setUser(null);
    showToast('Sesión cerrada', 'Has cerrado tu sesión correctamente', 'info');
  };

  const isAdmin = authUser?.role === 'admin' || user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        authUser,
        isAuthenticated: !!authUser,
        isAdmin,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
