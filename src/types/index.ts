export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Returned";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  district: string;
  full_address: string;
  created_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: Product;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  subtotal: number;
  delivery_charge: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: OrderStatus;
  created_at: string;
  customer?: Customer;
  order_items?: OrderItem[];
}

export interface SiteSettings {
  id: string;
  delivery_charge_inside_dhaka: number;
  delivery_charge_outside_dhaka: number;
  contact_phone: string;
  whatsapp_number: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CheckoutFormValues {
  name: string;
  phone: string;
  district: string;
  full_address: string;
  quantity: number;
}
