import React, { useState, useEffect, useCallback } from 'react';
import type {
  Brand,
  Category,
  Order,
  Product,
  ProductFilterState,
} from './types';
import { productService } from './services/productService';
import { categoryService } from './services/categoryService';
import { brandService } from './services/brandService';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from './components/common/ToastContainer';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroBanner } from './components/catalog/HeroBanner';
import { CategoryPills } from './components/catalog/CategoryPills';
import { ProductFilters } from './components/catalog/ProductFilters';
import { ProductGrid } from './components/catalog/ProductGrid';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderSuccessModal } from './components/checkout/OrderSuccessModal';
import { AuthModal } from './components/auth/AuthModal';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import './App.css';

const DEFAULT_FILTERS: ProductFilterState = {
  search: '',
  categoryId: undefined,
  brandId: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  onlyInStock: false,
  onlyFeatured: false,
  sortBy: 'featured',
};

const StoreApp: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState<ProductFilterState>(DEFAULT_FILTERS);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<'profile' | 'orders'>('profile');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Theme State
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = localStorage.getItem('theme_preference');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme_preference', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme_preference', 'light');
    }
  }, [isDarkTheme]);

  // Cargar categorías y marcas iniciales
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [cats, brds] = await Promise.all([
          categoryService.getCategories(),
          brandService.getAllBrands(),
        ]);
        setCategories(cats);
        setBrands(brds);
      } catch (err) {
        console.error('Error loading store metadata:', err);
      }
    };
    loadMetadata();
  }, []);

  // Cargar productos al cambiar filtros
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);

      let sortByParam: string | undefined = undefined;
      let directionParam: string | undefined = undefined;

      if (filters.sortBy === 'price-asc') {
        sortByParam = 'price';
        directionParam = 'asc';
      } else if (filters.sortBy === 'price-desc') {
        sortByParam = 'price';
        directionParam = 'desc';
      } else if (filters.sortBy === 'rating') {
        sortByParam = 'rating';
        directionParam = 'desc';
      } else if (filters.sortBy === 'newest') {
        sortByParam = 'createdAt';
        directionParam = 'desc';
      }

      const res = await productService.getProducts({
        search: filters.search || undefined,
        categoryId: filters.categoryId,
        brandId: filters.brandId,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        onlyFeatured: filters.onlyFeatured || filters.sortBy === 'featured',
        onlyInStock: filters.onlyInStock,
        sortBy: sortByParam,
        direction: directionParam,
        size: 24,
      });

      setProducts(res.content);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (newFilters: Partial<ProductFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    setIsDetailOpen(true);
  };

  const handleInstantBuy = () => {
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (order: Order) => {
    setConfirmedOrder(order);
    setIsSuccessOpen(true);
  };

  const handleOpenOrdersHistory = () => {
    if (!isAuthenticated) {
      setProfileTab('orders');
      setIsAuthOpen(true);
    } else {
      setProfileTab('orders');
      setIsProfileOpen(true);
    }
  };

  const handleOpenProfile = () => {
    if (!isAuthenticated) {
      setProfileTab('profile');
      setIsAuthOpen(true);
    } else {
      setProfileTab('profile');
      setIsProfileOpen(true);
    }
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalogo-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      {/* Barra de Navegación Superior */}
      <Navbar
        searchQuery={filters.search}
        onSearchChange={(q) => handleFilterChange({ search: q })}
        isDarkTheme={isDarkTheme}
        onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={handleOpenProfile}
        onOpenOrders={handleOpenOrdersHistory}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="main-content">
        {/* Banner Hero */}
        <HeroBanner onExploreClick={handleScrollToCatalog} />

        {/* Sección de Catálogo */}
        <section id="catalogo-section">
          {/* Pills de Categorías Rápidas */}
          <CategoryPills
            categories={categories}
            selectedCategoryId={filters.categoryId}
            onSelectCategory={(cId) => handleFilterChange({ categoryId: cId })}
          />

          {/* Grid y Filtros */}
          <div className="catalog-layout">
            <ProductFilters
              categories={categories}
              brands={brands}
              filters={filters}
              totalProducts={products.length}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />

            <ProductGrid
              products={products}
              isLoading={isLoading}
              onSelectProduct={handleSelectProduct}
              onResetFilters={handleResetFilters}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modales y Paneles Flotantes */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onInstantBuy={handleInstantBuy}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={handleOrderCompleted}
      />

      <OrderSuccessModal
        order={confirmedOrder}
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        onViewOrders={handleOpenOrdersHistory}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        initialTab={profileTab}
        onClose={() => setIsProfileOpen(false)}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProductChanged={fetchProducts}
      />

      {/* Notificaciones Toast */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <StoreApp />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
