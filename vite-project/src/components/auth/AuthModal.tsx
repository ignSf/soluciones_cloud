import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, User as UserIcon, Phone, ShieldCheck, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, demoLogin, isLoading } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword);
      onClose();
    } catch {
      // Handled in auth context
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        email: regEmail,
        password: regPassword,
        firstName: regFirstName,
        lastName: regLastName,
        phone: regPhone || undefined,
      });
      onClose();
    } catch {
      // Handled in auth context
    }
  };

  const handleDemoClick = async (email: 'admin@tienda.com' | 'juan.perez@email.com' | 'maria.gomez@email.com') => {
    await demoLogin(email);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="auth-modal-layout">
        {/* Cabecera de Pestañas */}
        <div className="auth-tabs-header">
          <button
            type="button"
            className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >
            <LogIn size={16} />
            <span>Iniciar Sesión</span>
          </button>

          <button
            type="button"
            className={`auth-tab-btn ${tab === 'register' ? 'active' : ''}`}
            onClick={() => setTab('register')}
          >
            <UserPlus size={16} />
            <span>Crear Cuenta</span>
          </button>
        </div>

        {/* Acceso Rápido con Cuentas Demo de la Base de Datos */}
        <div className="auth-demo-banner">
          <div className="demo-banner-title">
            <Sparkles size={14} />
            <span>Acceso Rápido con Cuentas Semilla (seed.sql):</span>
          </div>
          <div className="demo-accounts-grid">
            <button
              type="button"
              className="demo-account-card admin"
              onClick={() => handleDemoClick('admin@tienda.com')}
            >
              <ShieldCheck size={16} />
              <div>
                <strong>Admin Carlos</strong>
                <span>admin@tienda.com</span>
              </div>
            </button>

            <button
              type="button"
              className="demo-account-card customer"
              onClick={() => handleDemoClick('juan.perez@email.com')}
            >
              <UserIcon size={16} />
              <div>
                <strong>Cliente Juan</strong>
                <span>juan.perez@email.com</span>
              </div>
            </button>
          </div>
        </div>

        {/* Formulario de Login */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-field-group">
              <label className="field-label">Correo Electrónico</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="text-input has-icon"
                />
              </div>
            </div>

            <div className="form-field-group">
              <label className="field-label">Contraseña</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="text-input has-icon"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary-lg btn-glow w-full mt-2"
            >
              <span>{isLoading ? 'Ingresando...' : 'Iniciar Sesión'}</span>
            </button>
          </form>
        ) : (
          /* Formulario de Registro */
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div className="form-grid-2">
              <div className="form-field-group">
                <label className="field-label">Nombre *</label>
                <input
                  type="text"
                  required
                  placeholder="Carlos"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  className="text-input"
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Apellido *</label>
                <input
                  type="text"
                  required
                  placeholder="Gómez"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  className="text-input"
                />
              </div>
            </div>

            <div className="form-field-group">
              <label className="field-label">Correo Electrónico *</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="text-input has-icon"
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-field-group">
                <label className="field-label">Contraseña *</label>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 6 caract."
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="text-input has-icon"
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label">Teléfono (Opcional)</label>
                <div className="input-with-icon">
                  <Phone size={16} className="input-icon" />
                  <input
                    type="tel"
                    placeholder="+54 9 11..."
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="text-input has-icon"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary-lg btn-glow w-full mt-2"
            >
              <span>{isLoading ? 'Registrando...' : 'Crear Cuenta'}</span>
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};
