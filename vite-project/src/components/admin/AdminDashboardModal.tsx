import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { Product, Order, OrderStatus, ProductRequestDto, Category, Brand } from '../../types';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';
import { useToast } from '../../context/ToastContext';
import {
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductChanged?: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onProductChanged,
}) => {
  const { showToast } = useToast();
  const [tab, setTab] = useState<'metrics' | 'products' | 'orders'>('metrics');

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Form New Product
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formBasePrice, setFormBasePrice] = useState<number>(100);
  const [formDiscountPrice, setFormDiscountPrice] = useState<number | undefined>(undefined);
  const [formStock, setFormStock] = useState<number>(20);
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formBrandId, setFormBrandId] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadAllData();
    }
  }, [isOpen]);

  const loadAllData = async () => {
    try {
      const [pRes, oList, cList, bList] = await Promise.all([
        productService.getProducts({ size: 50 }),
        orderService.getAllOrders(),
        categoryService.getCategories(),
        brandService.getAllBrands(),
      ]);
      setProducts(pRes.content);
      setOrders(oList);
      setCategories(cList);
      setBrands(bList);
    } catch {
      showToast('Error', 'No se pudieron cargar todos los datos administrativos', 'error');
    }
  };

  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setFormName('');
    setFormSku('SKU-' + Math.floor(1000 + Math.random() * 9000));
    setFormBasePrice(99.99);
    setFormDiscountPrice(undefined);
    setFormStock(25);
    setFormShortDesc('');
    setFormDesc('');
    setFormImageUrl('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800');
    setFormCategoryId(categories[0]?.id || '');
    setFormBrandId(brands[0]?.id || '');
    setShowProductForm(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setFormName(p.name);
    setFormSku(p.sku);
    setFormBasePrice(p.basePrice);
    setFormDiscountPrice(p.discountPrice);
    setFormStock(p.stockQuantity);
    setFormShortDesc(p.shortDescription || '');
    setFormDesc(p.description || '');
    setFormImageUrl(p.images?.[0]?.imageUrl || '');
    setFormCategoryId(p.categories?.[0]?.id || '');
    setFormBrandId(p.brand?.id || '');
    setShowProductForm(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSku.trim()) {
      showToast('Campos obligatorios', 'Completa el nombre y SKU', 'warning');
      return;
    }

    try {
      const dto: ProductRequestDto = {
        name: formName.trim(),
        sku: formSku.trim(),
        basePrice: Number(formBasePrice),
        discountPrice: formDiscountPrice ? Number(formDiscountPrice) : undefined,
        stockQuantity: Number(formStock),
        shortDescription: formShortDesc.trim(),
        description: formDesc.trim(),
        categoryIds: formCategoryId ? [formCategoryId] : [],
        brandId: formBrandId || undefined,
        images: formImageUrl ? [{ imageUrl: formImageUrl, altText: formName, isPrimary: true, displayOrder: 1 }] : [],
      };

      if (editingProductId) {
        await productService.updateProduct(editingProductId, dto);
        showToast('Producto Actualizado', `Se guardaron los cambios de ${formName}`, 'success');
      } else {
        await productService.createProduct(dto);
        showToast('Producto Creado', `Se agregó ${formName} al catálogo`, 'success');
      }

      setShowProductForm(false);
      await loadAllData();
      onProductChanged?.();
    } catch (err: any) {
      showToast('Error', err.message || 'No se pudo guardar el producto', 'error');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el producto "${name}"?`)) return;
    try {
      await productService.deleteProduct(id);
      showToast('Producto eliminado', `Se eliminó "${name}"`, 'info');
      await loadAllData();
      onProductChanged?.();
    } catch (err: any) {
      showToast('Error', err.message || 'No se pudo eliminar', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      showToast('Estado actualizado', `El pedido ahora está en estado: ${newStatus}`, 'success');
      await loadAllData();
    } catch (err: any) {
      showToast('Error', err.message || 'No se pudo actualizar el estado', 'error');
    }
  };

  // Métricas
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalItemsSold = orders.reduce((sum, o) => sum + o.items.reduce((s, it) => s + it.quantity, 0), 0);
  const lowStockCount = products.filter((p) => p.stockQuantity <= 5).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Panel de Administración" maxWidth="4xl">
      <div className="admin-dashboard-layout">
        {/* Barra Superior de Pestañas Admin */}
        <div className="admin-tabs-nav">
          <button
            type="button"
            className={`admin-tab-btn ${tab === 'metrics' ? 'active' : ''}`}
            onClick={() => setTab('metrics')}
          >
            <TrendingUp size={16} />
            <span>Métricas & Resumen</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${tab === 'products' ? 'active' : ''}`}
            onClick={() => setTab('products')}
          >
            <Package size={16} />
            <span>Productos ({products.length})</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${tab === 'orders' ? 'active' : ''}`}
            onClick={() => setTab('orders')}
          >
            <ShoppingBag size={16} />
            <span>Pedidos ({orders.length})</span>
          </button>
        </div>

        {/* Pestaña: Métricas Generales */}
        {tab === 'metrics' && (
          <div className="admin-metrics-grid">
            <div className="admin-metric-card revenue">
              <div className="metric-icon-box">
                <DollarSign size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Ingresos Totales</span>
                <span className="metric-value">${totalRevenue.toFixed(2)}</span>
                <span className="metric-sub">Facturación histórica</span>
              </div>
            </div>

            <div className="admin-metric-card orders">
              <div className="metric-icon-box">
                <ShoppingBag size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Pedidos Registrados</span>
                <span className="metric-value">{orders.length}</span>
                <span className="metric-sub">{totalItemsSold} artículos despachados</span>
              </div>
            </div>

            <div className="admin-metric-card products">
              <div className="metric-icon-box">
                <Package size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Productos Activos</span>
                <span className="metric-value">{products.length}</span>
                <span className="metric-sub">En catálogo público</span>
              </div>
            </div>

            <div className="admin-metric-card alerts">
              <div className="metric-icon-box">
                <AlertTriangle size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Alertas de Stock Bajo</span>
                <span className="metric-value">{lowStockCount}</span>
                <span className="metric-sub">Menos de 5 unidades</span>
              </div>
            </div>
          </div>
        )}

        {/* Pestaña: Gestión de Productos */}
        {tab === 'products' && (
          <div className="admin-products-view">
            <div className="admin-actions-bar">
              <h4>Listado de Productos</h4>
              <button
                type="button"
                className="btn-primary-sm btn-glow"
                onClick={handleOpenNewProduct}
              >
                <Plus size={16} />
                <span>Nuevo Producto</span>
              </button>
            </div>

            {/* Modal/Formulario de Crear/Editar Producto */}
            {showProductForm && (
              <form onSubmit={handleSaveProduct} className="admin-product-form-box">
                <div className="form-header-row">
                  <h4>{editingProductId ? 'Editar Producto' : 'Crear Nuevo Producto'}</h4>
                  <button
                    type="button"
                    className="btn-close-form"
                    onClick={() => setShowProductForm(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="form-grid-2">
                  <div className="form-field-group">
                    <label className="field-label">Nombre del Producto *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Teclado Mecánico RGB"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="text-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">SKU *</label>
                    <input
                      type="text"
                      required
                      placeholder="KEY-RGB-01"
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value)}
                      className="text-input font-mono"
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-field-group">
                    <label className="field-label">Precio Base ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formBasePrice}
                      onChange={(e) => setFormBasePrice(Number(e.target.value))}
                      className="text-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Precio Oferta ($ Opcional)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ej: 79.99"
                      value={formDiscountPrice ?? ''}
                      onChange={(e) => setFormDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                      className="text-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Stock Inicial *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      className="text-input"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field-group">
                    <label className="field-label">Categoría</label>
                    <select
                      value={formCategoryId}
                      onChange={(e) => setFormCategoryId(e.target.value)}
                      className="text-input"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Marca</label>
                    <select
                      value={formBrandId}
                      onChange={(e) => setFormBrandId(e.target.value)}
                      className="text-input"
                    >
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-field-group">
                  <label className="field-label">URL de Imagen</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="text-input"
                  />
                </div>

                <div className="form-field-group">
                  <label className="field-label">Descripción</label>
                  <textarea
                    rows={2}
                    placeholder="Descripción del producto..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="text-textarea"
                  />
                </div>

                <div className="form-actions-row">
                  <button
                    type="button"
                    className="btn-outline-md"
                    onClick={() => setShowProductForm(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary-md btn-glow"
                  >
                    Guardar Producto
                  </button>
                </div>
              </form>
            )}

            {/* Tabla de Productos */}
            <div className="admin-table-container">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>SKU</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="table-product-cell">
                          <img
                            src={p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100'}
                            alt={p.name}
                            className="table-thumb"
                          />
                          <div>
                            <strong>{p.name}</strong>
                            <span className="text-muted block text-xs">{p.brand?.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="font-mono text-xs">{p.sku}</td>
                      <td>
                        ${(p.discountPrice ?? p.basePrice).toFixed(2)}
                        {p.discountPrice && <span className="line-through text-xs text-muted block">${p.basePrice.toFixed(2)}</span>}
                      </td>
                      <td>
                        <span className={`stock-chip ${p.stockQuantity <= 5 ? 'low' : 'ok'}`}>
                          {p.stockQuantity} un.
                        </span>
                      </td>
                      <td>
                        <div className="table-actions-cell">
                          <button
                            type="button"
                            className="btn-action-icon edit"
                            onClick={() => handleOpenEditProduct(p)}
                            title="Editar"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn-action-icon delete"
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pestaña: Gestión de Pedidos */}
        {tab === 'orders' && (
          <div className="admin-orders-view">
            <h4>Control y Despacho de Pedidos</h4>
            <div className="admin-table-container">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>N° Pedido</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Método Pago</th>
                    <th>Estado de la Orden</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td className="font-mono font-semibold">{ord.orderNumber}</td>
                      <td className="text-sm">
                        {new Date(ord.createdAt).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="font-semibold">${ord.totalAmount.toFixed(2)}</td>
                      <td style={{ textTransform: 'capitalize' }}>
                        {ord.paymentMethod.replace('_', ' ')}
                      </td>
                      <td>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className={`status-select ${ord.status}`}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="processing">En preparación</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
