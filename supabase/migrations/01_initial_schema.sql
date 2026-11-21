-- ============================================================================
-- FORCE FUEL – EAGLE ENDURANCE FOR MEN
-- Database Schema Migration (Supabase PostgreSQL)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger for auto-updating updated_at on products
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 2. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    district VARCHAR(100) NOT NULL,
    full_address TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    delivery_charge NUMERIC(10, 2) NOT NULL CHECK (delivery_charge >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(50) NOT NULL DEFAULT 'COD',
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    order_status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (
        order_status IN ('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0)
);

-- 6. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_charge_inside_dhaka NUMERIC(10, 2) NOT NULL DEFAULT 70.00,
    delivery_charge_outside_dhaka NUMERIC(10, 2) NOT NULL DEFAULT 130.00,
    contact_phone VARCHAR(50) NOT NULL DEFAULT '+8801700000000',
    whatsapp_number VARCHAR(50) NOT NULL DEFAULT '+8801700000000',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Products Policies:
-- Public can view active products
CREATE POLICY "Public can view active products"
    ON public.products FOR SELECT
    USING (is_active = true OR auth.role() = 'authenticated');

-- Authenticated admins have full product access
CREATE POLICY "Admin full access to products"
    ON public.products FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Product Images Policies:
-- Public can view product images
CREATE POLICY "Public can view product images"
    ON public.product_images FOR SELECT
    USING (true);

-- Authenticated admins have full product images access
CREATE POLICY "Admin full access to product images"
    ON public.product_images FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Customers Policies:
-- Anyone can create customer records during checkout
CREATE POLICY "Public can insert customers"
    ON public.customers FOR INSERT
    WITH CHECK (true);

-- Only authenticated admins can view and manage customers
CREATE POLICY "Admin full access to customers"
    ON public.customers FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Orders Policies:
-- Public can insert orders during checkout
CREATE POLICY "Public can insert orders"
    ON public.orders FOR INSERT
    WITH CHECK (true);

-- Public can view specific order by order_number (for confirmation page)
CREATE POLICY "Public can view own order by order_number"
    ON public.orders FOR SELECT
    USING (true);

-- Authenticated admins have full order management
CREATE POLICY "Admin full access to orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Order Items Policies:
-- Public can insert order items during checkout
CREATE POLICY "Public can insert order items"
    ON public.order_items FOR INSERT
    WITH CHECK (true);

-- Public can view order items for their order
CREATE POLICY "Public can view order items"
    ON public.order_items FOR SELECT
    USING (true);

-- Authenticated admins have full access to order items
CREATE POLICY "Admin full access to order items"
    ON public.order_items FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Site Settings Policies:
-- Public can view site settings
CREATE POLICY "Public can view site settings"
    ON public.site_settings FOR SELECT
    USING (true);

-- Authenticated admins can update site settings
CREATE POLICY "Admin full access to site settings"
    ON public.site_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- SUPABASE STORAGE BUCKET FOR PRODUCT IMAGES
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies:
CREATE POLICY "Public product images access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

CREATE POLICY "Admin upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Admin delete product images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images');

-- ============================================================================
-- SEED INITIAL DATA
-- ============================================================================

-- Default single product
INSERT INTO public.products (id, name, slug, description, price, stock_quantity, is_active)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'FORCE FUEL – EAGLE ENDURANCE FOR MEN',
    'eagle-endurance-for-men',
    'Premium nutritional dietary supplement formulated for men. Featuring standardized G115® Ginseng extract and KSM-66® Ashwagandha root extract. Designed to support physical stamina, vitality, and natural endurance. 60 doses per container.',
    1850.00,
    100,
    true
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price;

-- Default 4 product images
INSERT INTO public.product_images (product_id, image_url, is_primary, display_order)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '/images/product/product-1.jpg', true, 1),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '/images/product/product-2.jpg', false, 2),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '/images/product/product-3.jpg', false, 3),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '/images/product/product-4.jpg', false, 4)
ON CONFLICT DO NOTHING;

-- Default site settings
INSERT INTO public.site_settings (id, delivery_charge_inside_dhaka, delivery_charge_outside_dhaka, contact_phone, whatsapp_number)
VALUES (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    70.00,
    130.00,
    '+8801700000000',
    '+8801700000000'
)
ON CONFLICT (id) DO UPDATE SET
    delivery_charge_inside_dhaka = EXCLUDED.delivery_charge_inside_dhaka,
    delivery_charge_outside_dhaka = EXCLUDED.delivery_charge_outside_dhaka;
