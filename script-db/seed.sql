-- ==============================================================================
-- DATOS DE PRUEBA (SEED DATA) PARA E-COMMERCE (PostgreSQL)
-- ==============================================================================

-- 1. USUARIOS DE PRUEBA
-- Nota: En producción, los hashes deben generarse con bcrypt/argon2 desde el backend.
-- Aquí usamos valores simulados o hashes válidos de prueba para fines demostrativos.
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, is_active)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@tienda.com', crypt('Admin1234!', gen_salt('bf')), 'Carlos', 'Administrador', '+5491112345678', 'admin', true),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'juan.perez@email.com', crypt('Cliente1234!', gen_salt('bf')), 'Juan', 'Pérez', '+5491187654321', 'customer', true),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'maria.gomez@email.com', crypt('Cliente1234!', gen_salt('bf')), 'María', 'Gómez', '+5491145678901', 'customer', true);

-- 2. DIRECCIONES
INSERT INTO addresses (id, user_id, title, recipient_name, recipient_phone, street_address_1, city, state_province, postal_code, country, is_default_shipping, is_default_billing)
VALUES 
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Casa', 'Juan Pérez', '+5491187654321', 'Av. Corrientes 1234, Piso 4B', 'Buenos Aires', 'CABA', 'C1043', 'Argentina', true, true),
    ('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a45', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Departamento', 'María Gómez', '+5491145678901', 'Calle San Martín 567', 'Rosario', 'Santa Fe', 'S2000', 'Argentina', true, true);

-- 3. MARCAS
INSERT INTO brands (id, name, slug, description, logo_url)
VALUES
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'TechBrand', 'techbrand', 'Líder en dispositivos electrónicos de vanguardia', 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=100'),
    ('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a56', 'UrbanStyle', 'urbanstyle', 'Moda urbana contemporánea y sostenible', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100'),
    ('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a57', 'AudioPro', 'audiopro', 'Equipos de audio de alta fidelidad', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=100');

-- 4. CATEGORÍAS (CON JERARQUÍA PADRE / HIJO)
INSERT INTO categories (id, parent_id, name, slug, description, display_order)
VALUES
    ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', NULL, 'Electrónica', 'electronica', 'Dispositivos tecnológicos y accesorios', 1),
    ('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a67', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Smartphones', 'smartphones', 'Teléfonos inteligentes de última generación', 1),
    ('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a68', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Audio & Sonido', 'audio-y-sonido', 'Auriculares y parlantes inalámbricos', 2),
    ('f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a69', NULL, 'Ropa & Calzado', 'ropa-y-calzado', 'Indumentaria para todas las temporadas', 2),
    ('f4eebc99-9c0b-4ef8-bb6d-6bb9bd380a70', 'f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a69', 'Remeras & Camisetas', 'remeras-y-camisetas', 'Remeras casuales de algodón', 1);

-- 5. PRODUCTOS
INSERT INTO products (id, brand_id, name, slug, short_description, description, sku, base_price, discount_price, cost_price, stock_quantity, weight_kg, is_featured, is_active)
VALUES
    (
        '10000000-0000-0000-0000-000000000001',
        'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
        'Smartphone Titan Pro 5G',
        'smartphone-titan-pro-5g',
        'Pantalla AMOLED de 6.7 pulgadas, cámara de 108MP y batería de larga duración.',
        'El Smartphone Titan Pro 5G está diseñado para brindar la máxima potencia y rendimiento. Equipado con procesador octa-core, carga ultra rápida de 65W y acabado en vidrio mate resistente a huellas.',
        'TITAN-5G-BASE',
        899.99,
        799.99,
        500.00,
        45,
        0.220,
        true,
        true
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a57',
        'Auriculares Inalámbricos NoiseCancel X',
        'auriculares-inalambricos-noisecancel-x',
        'Cancelación activa de ruido, hasta 30 horas de autonomía y sonido envolvente Hi-Res.',
        'Experimenta un audio inmersivo sin interrupciones con los NoiseCancel X. Almohadillas de memoria viscoelástica, conectividad Bluetooth 5.3 y micrófono con reducción de ruido ambiental para llamadas cristalinas.',
        'NCX-AUDIO-01',
        199.99,
        149.99,
        80.00,
        120,
        0.280,
        true,
        true
    ),
    (
        '10000000-0000-0000-0000-000000000003',
        'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a56',
        'Remera Oversize Algodón Premium',
        'remera-oversize-algodon-premium',
        '100% Algodón peinado de alto gramaje, corte moderno y textura ultra suave.',
        'Una prenda esencial para tu guardarropa diario. Confeccionada con algodón sustentable de máxima durabilidad, costuras reforzadas y ajuste relajado.',
        'REM-OVER-001',
        39.99,
        NULL,
        15.00,
        200,
        0.200,
        false,
        true
    );

-- 6. ASOCIACIÓN PRODUCTO - CATEGORÍA
INSERT INTO product_categories (product_id, category_id)
VALUES
    ('10000000-0000-0000-0000-000000000001', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66'),
    ('10000000-0000-0000-0000-000000000001', 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a67'),
    ('10000000-0000-0000-0000-000000000002', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66'),
    ('10000000-0000-0000-0000-000000000002', 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a68'),
    ('10000000-0000-0000-0000-000000000003', 'f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a69'),
    ('10000000-0000-0000-0000-000000000003', 'f4eebc99-9c0b-4ef8-bb6d-6bb9bd380a70');

-- 7. VARIANTES DE PRODUCTO
INSERT INTO product_variants (id, product_id, sku, variant_name, price_modifier, stock_quantity, attributes)
VALUES
    -- Variantes Smartphone Titan Pro 5G
    ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'TITAN-5G-128-BLK', '128GB / Negro Phantom', 0.00, 20, '{"almacenamiento": "128GB", "color": "Negro Phantom"}'::jsonb),
    ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'TITAN-5G-256-SLV', '256GB / Plata Titanio', 100.00, 25, '{"almacenamiento": "256GB", "color": "Plata Titanio"}'::jsonb),
    
    -- Variantes Remera
    ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'REM-OVER-BLK-M', 'Negro / Talle M', 0.00, 80, '{"color": "Negro", "talle": "M"}'::jsonb),
    ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', 'REM-OVER-BLK-L', 'Negro / Talle L', 0.00, 70, '{"color": "Negro", "talle": "L"}'::jsonb),
    ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 'REM-OVER-WHT-M', 'Blanco / Talle M', 0.00, 50, '{"color": "Blanco", "talle": "M"}'::jsonb);

-- 8. IMÁGENES DE PRODUCTOS
INSERT INTO product_images (product_id, variant_id, image_url, alt_text, is_primary, display_order)
VALUES
    ('10000000-0000-0000-0000-000000000001', NULL, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800', 'Smartphone Titan Pro 5G Vista Frontal', true, 1),
    ('10000000-0000-0000-0000-000000000002', NULL, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'Auriculares NoiseCancel X', true, 1),
    ('10000000-0000-0000-0000-000000000003', NULL, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', 'Remera Oversize Algodon Premium', true, 1);

-- 9. CUPÓN DE DESCUENTO
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, used_count, valid_from, valid_until, is_active)
VALUES
    ('30000000-0000-0000-0000-000000000001', 'BIENVENIDO10', '10% de descuento en tu primera compra', 'percentage', 10.00, 50.00, 100.00, 500, 1, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP + INTERVAL '90 days', true),
    ('30000000-0000-0000-0000-000000000002', 'ENVIOGRATIS', 'Descuento fijo de $15 en el envío', 'fixed_amount', 15.00, 100.00, NULL, NULL, 0, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '30 days', true);

-- 10. CARRITO DE EJEMPLO (Usuario María)
INSERT INTO shopping_carts (id, user_id)
VALUES ('40000000-0000-0000-0000-000000000001', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33');

INSERT INTO cart_items (cart_id, product_id, variant_id, quantity)
VALUES 
    ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 2);

-- 11. PEDIDO DE EJEMPLO REALIZADO (Usuario Juan Pérez)
INSERT INTO orders (
    id, order_number, user_id, coupon_id, status,
    subtotal_amount, discount_amount, shipping_amount, tax_amount, total_amount,
    shipping_address, billing_address, shipping_method, tracking_number
)
VALUES (
    '50000000-0000-0000-0000-000000000001',
    'ORD-2026-00001',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    '30000000-0000-0000-0000-000000000001',
    'processing',
    799.99,
    80.00, -- 10% del cupón
    15.00,
    0.00,
    734.99,
    '{"recipient_name": "Juan Pérez", "street_address": "Av. Corrientes 1234, Piso 4B", "city": "Buenos Aires", "state_province": "CABA", "postal_code": "C1043", "country": "Argentina", "phone": "+5491187654321"}'::jsonb,
    '{"recipient_name": "Juan Pérez", "street_address": "Av. Corrientes 1234, Piso 4B", "city": "Buenos Aires", "state_province": "CABA", "postal_code": "C1043", "country": "Argentina", "phone": "+5491187654321"}'::jsonb,
    'Envío Express a Domicilio',
    'TRK-ARG-987654321'
);

-- Ítems del Pedido
INSERT INTO order_items (order_id, product_id, variant_id, product_name, variant_name, sku, unit_price, quantity, total_price)
VALUES (
    '50000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Smartphone Titan Pro 5G',
    '128GB / Negro Phantom',
    'TITAN-5G-128-BLK',
    799.99,
    1,
    799.99
);

-- Pago del Pedido
INSERT INTO payments (order_id, payment_method, payment_status, transaction_id, amount, currency, paid_at, gateway_response)
VALUES (
    '50000000-0000-0000-0000-000000000001',
    'credit_card',
    'completed',
    'ch_3Mtw1234567890abcdef',
    734.99,
    'USD',
    CURRENT_TIMESTAMP,
    '{"status": "succeeded", "last4": "4242", "brand": "Visa"}'::jsonb
);

-- 12. RESEÑA DE PRODUCTO
INSERT INTO product_reviews (product_id, user_id, order_id, rating, title, comment, is_verified_purchase, is_approved)
VALUES (
    '10000000-0000-0000-0000-000000000001',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    '50000000-0000-0000-0000-000000000001',
    5,
    'Excelente relación calidad-precio',
    'Llegó en perfectas condiciones y la pantalla se ve increíble. La batería dura más de un día completo de uso continuo.',
    true,
    true
);
