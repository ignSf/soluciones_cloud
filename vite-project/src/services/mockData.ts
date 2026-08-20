import { Brand, Category, Product, ProductReview } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
    name: 'Electrónica',
    slug: 'electronica',
    description: 'Dispositivos inteligentes, audio y accesorios de última generación',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=500&auto=format&fit=crop&q=80',
    displayOrder: 1,
    isActive: true,
    subCategories: [
      {
        id: 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a67',
        parentId: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
        name: 'Smartphones',
        slug: 'smartphones',
        isActive: true,
      },
      {
        id: 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a68',
        parentId: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
        name: 'Audio & Sonido',
        slug: 'audio-y-sonido',
        isActive: true,
      }
    ]
  },
  {
    id: 'f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a69',
    name: 'Ropa & Calzado',
    slug: 'ropa-y-calzado',
    description: 'Moda sustentable, estilo urbano y tendencias',
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=80',
    displayOrder: 2,
    isActive: true,
    subCategories: [
      {
        id: 'f4eebc99-9c0b-4ef8-bb6d-6bb9bd380a70',
        parentId: 'f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a69',
        name: 'Remeras & Camisetas',
        slug: 'remeras-y-camisetas',
        isActive: true,
      }
    ]
  },
  {
    id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a71',
    name: 'Hogar & Confort',
    slug: 'hogar-y-confort',
    description: 'Diseño interior, iluminación y accesorios',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=80',
    displayOrder: 3,
    isActive: true
  },
  {
    id: 'f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a72',
    name: 'Deportes & Outdoor',
    slug: 'deportes-y-outdoor',
    description: 'Equipamiento y ropa técnica para entrenamiento',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80',
    displayOrder: 4,
    isActive: true
  }
];

export const MOCK_BRANDS: Brand[] = [
  {
    id: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
    name: 'TechBrand',
    slug: 'techbrand',
    logoUrl: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=100',
    isActive: true
  },
  {
    id: 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a56',
    name: 'UrbanStyle',
    slug: 'urbanstyle',
    logoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100',
    isActive: true
  },
  {
    id: 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a57',
    name: 'AudioPro',
    slug: 'audiopro',
    logoUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=100',
    isActive: true
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    name: 'Smartphone Titan Pro 5G',
    slug: 'smartphone-titan-pro-5g',
    shortDescription: 'Pantalla AMOLED 120Hz, cámara triple de 108MP y procesador octa-core de última generación.',
    description: 'El Smartphone Titan Pro 5G está diseñado para usuarios exigentes. Disfruta de una autonomía de hasta 48 horas con su batería de 5000 mAh y carga ultra rápida de 65W. Su chasis de aluminio aeroespacial y cristal Gorilla Glass Victus aseguran una resistencia inigualable.',
    sku: 'TITAN-5G-BASE',
    basePrice: 899.99,
    discountPrice: 799.99,
    stockQuantity: 45,
    weightKg: 0.22,
    isFeatured: true,
    isActive: true,
    averageRating: 4.9,
    brand: MOCK_BRANDS[0],
    categories: [MOCK_CATEGORIES[0]],
    images: [
      {
        id: 'img-1',
        imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
        altText: 'Smartphone Titan Pro 5G Frente',
        isPrimary: true,
        displayOrder: 1
      },
      {
        id: 'img-2',
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=800&auto=format&fit=crop&q=80',
        altText: 'Smartphone Titan Pro 5G Detalle',
        isPrimary: false,
        displayOrder: 2
      }
    ],
    variants: [
      {
        id: '20000000-0000-0000-0000-000000000001',
        sku: 'TITAN-5G-128-BLK',
        variantName: '128GB / Negro Phantom',
        priceModifier: 0,
        stockQuantity: 20,
        attributes: { almacenamiento: '128GB', color: 'Negro Phantom' },
        isActive: true
      },
      {
        id: '20000000-0000-0000-0000-000000000002',
        sku: 'TITAN-5G-256-SLV',
        variantName: '256GB / Plata Titanio',
        priceModifier: 100,
        stockQuantity: 25,
        attributes: { almacenamiento: '256GB', color: 'Plata Titanio' },
        isActive: true
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    name: 'Auriculares Inalámbricos NoiseCancel X',
    slug: 'auriculares-inalambricos-noisecancel-x',
    shortDescription: 'Cancelación activa de ruido híbrida, hasta 35 horas de reproducción continua y sonido Hi-Res Audio.',
    description: 'Sumérgete en tu música favorita con los NoiseCancel X. Equipados con transductores de 40mm con diafragma de seda, almohadillas ergonómicas de espuma con memoria y tecnología Bluetooth 5.3 con emparejamiento multipunto.',
    sku: 'NCX-AUDIO-01',
    basePrice: 199.99,
    discountPrice: 149.99,
    stockQuantity: 120,
    weightKg: 0.28,
    isFeatured: true,
    isActive: true,
    averageRating: 4.8,
    brand: MOCK_BRANDS[2],
    categories: [MOCK_CATEGORIES[0]],
    images: [
      {
        id: 'img-3',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        altText: 'Auriculares NoiseCancel X',
        isPrimary: true,
        displayOrder: 1
      },
      {
        id: 'img-4',
        imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
        altText: 'Auriculares NoiseCancel X Lateral',
        isPrimary: false,
        displayOrder: 2
      }
    ],
    variants: [
      {
        id: '20000000-0000-0000-0000-000000000006',
        sku: 'NCX-BLK',
        variantName: 'Negro Mate',
        priceModifier: 0,
        stockQuantity: 60,
        attributes: { color: 'Negro Mate' },
        isActive: true
      },
      {
        id: '20000000-0000-0000-0000-000000000007',
        sku: 'NCX-WHT',
        variantName: 'Blanco Perla',
        priceModifier: 0,
        stockQuantity: 60,
        attributes: { color: 'Blanco Perla' },
        isActive: true
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    name: 'Remera Oversize Algodón Premium',
    slug: 'remera-oversize-algodon-premium',
    shortDescription: '100% Algodón peinado de alto gramaje, corte relajado streetwear y textura ultra suave.',
    description: 'Una prenda fundamental para cualquier guardarropa. Confeccionada con algodón sustentable de máxima densidad (240 GSM), costuras dobles reforzadas y teñido reactivo que no pierde color con los lavados.',
    sku: 'REM-OVER-001',
    basePrice: 45.00,
    discountPrice: 34.99,
    stockQuantity: 200,
    weightKg: 0.20,
    isFeatured: false,
    isActive: true,
    averageRating: 4.7,
    brand: MOCK_BRANDS[1],
    categories: [MOCK_CATEGORIES[1]],
    images: [
      {
        id: 'img-5',
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        altText: 'Remera Oversize Frente',
        isPrimary: true,
        displayOrder: 1
      },
      {
        id: 'img-6',
        imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
        altText: 'Remera Oversize Modelo',
        isPrimary: false,
        displayOrder: 2
      }
    ],
    variants: [
      {
        id: '20000000-0000-0000-0000-000000000003',
        sku: 'REM-OVER-BLK-M',
        variantName: 'Negro / Talle M',
        priceModifier: 0,
        stockQuantity: 80,
        attributes: { color: 'Negro', talle: 'M' },
        isActive: true
      },
      {
        id: '20000000-0000-0000-0000-000000000004',
        sku: 'REM-OVER-BLK-L',
        variantName: 'Negro / Talle L',
        priceModifier: 0,
        stockQuantity: 70,
        attributes: { color: 'Negro', talle: 'L' },
        isActive: true
      },
      {
        id: '20000000-0000-0000-0000-000000000005',
        sku: 'REM-OVER-WHT-M',
        variantName: 'Blanco / Talle M',
        priceModifier: 0,
        stockQuantity: 50,
        attributes: { color: 'Blanco', talle: 'M' },
        isActive: true
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    name: 'Smartwatch Apex GPS Ultra',
    slug: 'smartwatch-apex-gps-ultra',
    shortDescription: 'Monitoreo de frecuencia cardíaca 24/7, SpO2, GPS integrado de doble banda y resistencia 5 ATM.',
    description: 'Tu compañero ideal para deporte y salud. Pantalla AMOLED siempre activa de cristal de zafiro, más de 100 modos deportivos y hasta 14 días de batería con uso regular.',
    sku: 'WATCH-APEX-01',
    basePrice: 249.99,
    discountPrice: 199.99,
    stockQuantity: 55,
    weightKg: 0.15,
    isFeatured: true,
    isActive: true,
    averageRating: 4.9,
    brand: MOCK_BRANDS[0],
    categories: [MOCK_CATEGORIES[0], MOCK_CATEGORIES[3]],
    images: [
      {
        id: 'img-7',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        altText: 'Smartwatch Apex GPS Ultra',
        isPrimary: true,
        displayOrder: 1
      }
    ],
    variants: [
      {
        id: '20000000-0000-0000-0000-000000000008',
        sku: 'WATCH-APEX-SILV',
        variantName: 'Malla Titanio / Plata',
        priceModifier: 20,
        stockQuantity: 25,
        attributes: { color: 'Plata', material: 'Titanio' },
        isActive: true
      },
      {
        id: '20000000-0000-0000-0000-000000000009',
        sku: 'WATCH-APEX-BLK',
        variantName: 'Malla Silicona / Negro',
        priceModifier: 0,
        stockQuantity: 30,
        attributes: { color: 'Negro', material: 'Silicona' },
        isActive: true
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000005',
    name: 'Zapatillas Urban Runner Pro',
    slug: 'zapatillas-urban-runner-pro',
    shortDescription: 'Amortiguación reactiva CloudFoam, suela de tracción multi-terreno y malla transpirable.',
    description: 'Diseñadas para brindar máxima comodidad tanto en carreras de asfalto como en el día a día. Estilo moderno con detalles reflectantes y plantilla ortopédica antibacterial.',
    sku: 'SNEAK-RUN-01',
    basePrice: 129.99,
    discountPrice: 109.99,
    stockQuantity: 90,
    weightKg: 0.65,
    isFeatured: true,
    isActive: true,
    averageRating: 4.8,
    brand: MOCK_BRANDS[1],
    categories: [MOCK_CATEGORIES[1], MOCK_CATEGORIES[3]],
    images: [
      {
        id: 'img-8',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
        altText: 'Zapatillas Urban Runner Pro Rojo',
        isPrimary: true,
        displayOrder: 1
      }
    ],
    variants: [
      {
        id: '20000000-0000-0000-0000-000000000010',
        sku: 'SNEAK-RED-41',
        variantName: 'Rojo Carmesí / 41 EU',
        priceModifier: 0,
        stockQuantity: 30,
        attributes: { color: 'Rojo Carmesí', talle: '41' },
        isActive: true
      },
      {
        id: '20000000-0000-0000-0000-000000000011',
        sku: 'SNEAK-RED-42',
        variantName: 'Rojo Carmesí / 42 EU',
        priceModifier: 0,
        stockQuantity: 35,
        attributes: { color: 'Rojo Carmesí', talle: '42' },
        isActive: true
      },
      {
        id: '20000000-0000-0000-0000-000000000012',
        sku: 'SNEAK-RED-43',
        variantName: 'Rojo Carmesí / 43 EU',
        priceModifier: 0,
        stockQuantity: 25,
        attributes: { color: 'Rojo Carmesí', talle: '43' },
        isActive: true
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000006',
    name: 'Mochila Impermeable Modular Tech',
    slug: 'mochila-impermeable-modular-tech',
    shortDescription: 'Compartimento acolchado para notebook de 16", puerto de carga USB exterior y tela Cordura impermeable.',
    description: 'La mochila definitiva para profesionales, estudiantes y viajeros urbanos. Con sistema antirrobo, bolsillos ocultos para pasaporte y correas acolchadas ergonómicas de distribución de peso.',
    sku: 'BAG-MOD-01',
    basePrice: 89.99,
    discountPrice: 69.99,
    stockQuantity: 65,
    weightKg: 0.85,
    isFeatured: false,
    isActive: true,
    averageRating: 4.6,
    brand: MOCK_BRANDS[1],
    categories: [MOCK_CATEGORIES[0], MOCK_CATEGORIES[1]],
    images: [
      {
        id: 'img-9',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
        altText: 'Mochila Impermeable Modular Tech',
        isPrimary: true,
        displayOrder: 1
      }
    ],
    variants: [
      {
        id: '20000000-0000-0000-0000-000000000013',
        sku: 'BAG-BLK',
        variantName: 'Gris Grafito',
        priceModifier: 0,
        stockQuantity: 65,
        attributes: { color: 'Gris Grafito' },
        isActive: true
      }
    ]
  }
];

export const MOCK_REVIEWS: Record<string, ProductReview[]> = {
  '10000000-0000-0000-0000-000000000001': [
    {
      id: 'rev-1',
      productId: '10000000-0000-0000-0000-000000000001',
      userId: 'u-1',
      userName: 'Juan Pérez',
      rating: 5,
      title: 'Excelente relación calidad-precio',
      comment: 'Llegó en perfectas condiciones y la pantalla se ve increíble. La batería dura más de un día completo de uso continuo.',
      isVerifiedPurchase: true,
      createdAt: '2026-08-15T14:30:00Z'
    },
    {
      id: 'rev-2',
      productId: '10000000-0000-0000-0000-000000000001',
      userId: 'u-2',
      userName: 'María Gómez',
      rating: 5,
      title: 'Cámaras espectaculares',
      comment: 'Las fotos nocturnas son una maravilla, el zoom es nítido y la fluidez de los 120Hz es adictiva.',
      isVerifiedPurchase: true,
      createdAt: '2026-08-18T10:15:00Z'
    }
  ],
  '10000000-0000-0000-0000-000000000002': [
    {
      id: 'rev-3',
      productId: '10000000-0000-0000-0000-000000000002',
      userId: 'u-3',
      userName: 'Martín Romero',
      rating: 5,
      title: 'Cancelación de ruido brutal',
      comment: 'Aísla completamente el sonido en la oficina y el transporte público. Bajos profundos y sonido balanceado.',
      isVerifiedPurchase: true,
      createdAt: '2026-08-12T19:00:00Z'
    }
  ]
};
