import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Sun,
  Moon,
  ShieldCheck,
  Package,
  LogOut,
  ChevronDown,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  onOpenOrders: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenProfile,
  onOpenAdmin,
  onOpenOrders,
  searchQuery,
  onSearchChange,
  isDarkTheme,
  onToggleTheme,
}) => {
  const { user, authUser, isAuthenticated, isAdmin, logout, demoLogin } = useAuth();
  const { itemsCount, setIsCartOpen } = useCart();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Logo & Marca */}
        <div className="navbar-brand-section">
          <a href="#" className="navbar-brand-logo" onClick={(e) => { e.preventDefault(); onSearchChange(''); }}>
            <div className="brand-icon-box">
              <ShoppingBag size={22} className="brand-icon" />
            </div>
            <div className="brand-text-box">
              <span className="brand-title">NOVA<span className="brand-highlight">STORE</span></span>
              <span className="brand-subtitle">E-COMMERCE PRO</span>
            </div>
          </a>
        </div>

        {/* Barra de Búsqueda Desktop */}
        <div className="navbar-search-desktop">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar smartphones, auriculares, indumentaria..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => onSearchChange('')}
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Acciones del Header */}
        <div className="navbar-actions">
          {/* Botón de Búsqueda Móvil */}
          <button
            type="button"
            className="action-btn mobile-search-btn"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            aria-label="Abrir búsqueda móvil"
          >
            <Search size={20} />
          </button>

          {/* Selector de Tema */}
          <button
            type="button"
            className="action-btn theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={isDarkTheme ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDarkTheme ? 'Modo Claro' : 'Modo Oscuro'}
          >
            {isDarkTheme ? <Sun size={20} className="theme-icon sun" /> : <Moon size={20} className="theme-icon moon" />}
          </button>

          {/* Menú de Usuario / Cuenta */}
          <div className="user-menu-wrapper" ref={userMenuRef}>
            {isAuthenticated ? (
              <button
                type="button"
                className="user-profile-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-expanded={isUserMenuOpen}
              >
                <div className="avatar-circle">
                  {(authUser?.firstName || user?.firstName || 'U')[0].toUpperCase()}
                </div>
                <div className="user-name-box">
                  <span className="user-name-text">{authUser?.firstName || user?.firstName}</span>
                  <span className="user-role-badge">{isAdmin ? 'Admin' : 'Cliente'}</span>
                </div>
                <ChevronDown size={14} className={`chevron-icon ${isUserMenuOpen ? 'rotated' : ''}`} />
              </button>
            ) : (
              <div className="auth-trigger-group">
                <button
                  type="button"
                  className="btn-primary-sm btn-glow"
                  onClick={onOpenAuth}
                >
                  <UserIcon size={16} />
                  <span>Ingresar</span>
                </button>
              </div>
            )}

            {/* Dropdown del Menú de Usuario */}
            {isUserMenuOpen && isAuthenticated && (
              <div className="user-dropdown-card">
                <div className="dropdown-header">
                  <p className="dropdown-user-name">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="dropdown-user-email">{authUser?.email || user?.email}</p>
                </div>

                <div className="dropdown-divider" />

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onOpenProfile();
                  }}
                >
                  <UserIcon size={16} />
                  <span>Mi Perfil y Direcciones</span>
                </button>

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onOpenOrders();
                  }}
                >
                  <Package size={16} />
                  <span>Mis Pedidos</span>
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    className="dropdown-item admin-link"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenAdmin();
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>Panel de Administración</span>
                  </button>
                )}

                <div className="dropdown-divider" />

                {/* Acceso Rápido Demo Roles */}
                <div className="dropdown-demo-section">
                  <span className="demo-label">Cambio rápido demo:</span>
                  <div className="demo-buttons-row">
                    <button
                      type="button"
                      className="demo-chip"
                      onClick={() => {
                        demoLogin('admin@tienda.com');
                        setIsUserMenuOpen(false);
                      }}
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      className="demo-chip"
                      onClick={() => {
                        demoLogin('juan.perez@email.com');
                        setIsUserMenuOpen(false);
                      }}
                    >
                      Juan (Cliente)
                    </button>
                  </div>
                </div>

                <div className="dropdown-divider" />

                <button
                  type="button"
                  className="dropdown-item logout-link"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                >
                  <LogOut size={16} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>

          {/* Botón Carrito */}
          <button
            type="button"
            className="action-btn cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Abrir carrito de compras"
          >
            <ShoppingBag size={22} />
            {itemsCount > 0 && (
              <span className="cart-badge-count">{itemsCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Barra de Búsqueda Móvil Expandible */}
      {isMobileSearchOpen && (
        <div className="navbar-search-mobile">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => onSearchChange('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
