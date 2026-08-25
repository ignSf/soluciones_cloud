// ==============================================================================
// MODELOS Y TIPOS DE DATOS (Alineados con el Backend Spring Boot & PostgreSQL)
// ==============================================================================

export type Role = 'customer' | 'admin' | 'moderator';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type PaymentMethod = 'credit_card' | 'debit_card' | 'paypal' | 'stripe' | 'bank_transfer' | 'cash_on_delivery';

export type DiscountType = 'percentage' | 'fixed_amount';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  createdAt?: string;
}

export interface Address {
  id?: string;
  userId?: string;
  title?: string;
  recipientName: string;
  recipientPhone: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  parentId?: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
  isActive: boolean;
  subCategories?: Category[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  variantName: string;
  priceModifier: number;
  stockQuantity: number;
  attributes: Record<string, any>;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  variantId?: string;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Product {
  id: string;
  brand?: Brand;
  categories: Category[];
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  sku: string;
  basePrice: number;
  discountPrice?: number;
  costPrice?: number;
  stockQuantity: number;
  weightKg?: number;
  isFeatured: boolean;
  isActive: boolean;
  averageRating?: number;
  variants: ProductVariant[];
  images: ProductImage[];
  createdAt?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  variantId?: string;
  variantName?: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface ShoppingCart {
  id: string;
  userId?: string;
  sessionToken?: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  calculatedDiscount?: number;
  isValid: boolean;
  validUntil: string;
}

export interface OrderItem {
  id: string;
  productId?: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  subtotalAmount: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  shippingAddress: Address | Record<string, any>;
  billingAddress: Address | Record<string, any>;
  shippingMethod?: string;
  trackingNumber?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderCreateRequest {
  addressId?: string;
  shippingAddress: {
    recipientName: string;
    streetAddress1: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    recipientPhone: string;
  };
  billingAddress?: {
    recipientName: string;
    streetAddress1: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    recipientPhone: string;
  };
  couponCode?: string;
  paymentMethod: PaymentMethod;
  shippingMethod?: string;
  customerNotes?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface ReviewRequestDto {
  productId: string;
  orderId?: string;
  rating: number;
  title: string;
  comment: string;
}

export interface ProductRequestDto {
  name: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  sku: string;
  basePrice: number;
  discountPrice?: number;
  stockQuantity: number;
  brandId?: string;
  categoryIds?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
  images?: { imageUrl: string; altText?: string; isPrimary?: boolean; displayOrder?: number }[];
  variants?: { variantName: string; sku: string; priceModifier: number; stockQuantity: number; attributes?: Record<string, any> }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

export interface ProductFilterState {
  search: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  onlyInStock?: boolean;
  onlyFeatured?: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
