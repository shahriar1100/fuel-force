# FORCE FUEL – EAGLE ENDURANCE FOR MEN

Production-ready, high-converting Single Product E-commerce Landing Page with integrated Cart, Cash on Delivery (COD) Checkout, and full Admin Panel for **FORCE FUEL – EAGLE ENDURANCE FOR MEN**.

Built with Next.js (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL, Authentication, Storage), Lucide Icons, React Hook Form, Zod, and Framer Motion.

---

## 💎 Features

- **Brand & Luxury Aesthetic**: Premium black (`#0B0B0D`), deep purple (`#632B78`), and gold (`#D1AD62`) design tailored to the authentic packaging.
- **Verified Product Content**: Centered around genuine active extracts (**G115® Ginseng** and **KSM-66® Ashwagandha**) as shown on product packaging, strictly adhering to scientific and legal compliance without unsupported health claims.
- **Product Gallery**: Interactive main image preview with clickable thumbnails, modal lightbox zoom, and smooth transitions.
- **E-Commerce Cart**: Slide-out cart drawer with quantity adjustments, subtotal, and direct checkout navigation.
- **Cash on Delivery Checkout**:
  - Bangladeshi mobile number validation (`01XXXXXXXXX`).
  - Automatic delivery charge calculation based on district (Inside Dhaka: ৳70, Outside Dhaka: ৳130).
  - Server-side price calculation and tamper protection (never trusts client price).
  - Rate limiting & duplicate order submission guard.
  - Generates unique Order ID (`FF-YYYYMMDD-XXXX`).
- **Order Confirmation Page**: Detailed breakdown with unique Order ID, copy-to-clipboard, delivery address, and preparation notice.
- **Admin Panel (`/admin`)**:
  - Essential statistics dashboard (Total Orders, Pending Orders, Delivered Orders, Total Sales).
  - Order Management: Filter by status, search by phone/Order ID, view customer delivery address, update order status across 7 stages (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`, `Returned`).
  - One-Click Printable Invoices (`/admin/invoice/[id]`) formatted for thermal / standard paper printing.
  - Product Management: Update name, description, price, stock quantity, and manage gallery images (upload, delete, set primary).
  - Website Settings: Update delivery rates and customer support numbers.
- **SEO & Performance**: Open Graph metadata, Twitter cards, JSON-LD Schema.org Product structured data, automated `sitemap.xml`, and `robots.txt`.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend / DB**: [Supabase (PostgreSQL + RLS + Storage + Auth)](https://supabase.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```
force-fuel/
├── public/
│   ├── images/
│   │   └── product/
│   │       ├── product-1.jpg    # Authentic studio display shot
│   │       ├── product-2.jpg    # High-detail supplement packaging shot
│   │       ├── product-3.jpg    # Natural botanicals setting shot
│   │       └── product-4.jpg    # Lifestyle presentation shot
│   └── uploads/                 # Local image upload fallback
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── invoice/[id]/    # Printable invoice route
│   │   │   ├── login/           # Admin sign-in route
│   │   │   └── page.tsx         # Admin dashboard & management
│   │   ├── api/
│   │   │   ├── admin/           # Protected admin APIs (orders, products, images, settings)
│   │   │   └── orders/          # Public checkout & order verification API
│   │   ├── checkout/            # Doorstep Cash on Delivery checkout page
│   │   ├── order-confirmation/  # Order success confirmation page
│   │   ├── layout.tsx           # Root layout with fonts, JSON-LD, CartProvider
│   │   ├── page.tsx             # Customer-facing landing page
│   │   ├── robots.ts            # Dynamic robots.txt
│   │   └── sitemap.ts           # Dynamic sitemap.xml
│   ├── components/
│   │   ├── cart/                # Slide-out cart drawer
│   │   └── landing/             # Header, Hero, Highlights, Gallery, FAQ, CTA, Footer
│   ├── context/                 # Cart context & localStorage persistence
│   ├── lib/                     # Supabase clients, Zod schemas, constants
│   └── types/                   # TypeScript interfaces
└── supabase/
    └── migrations/
        └── 01_initial_schema.sql # Complete PostgreSQL schema, RLS, Storage & Seeds
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node v20/v22/v26)
- npm or yarn or pnpm

### 2. Installation
```bash
# Clone or navigate to the project directory
cd "fuel force"

# Install dependencies
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase project credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note**: Even before linking your live Supabase database, the application includes a local fallback persistence layer (`.local-db.json`) allowing immediate, full end-to-end testing of customer orders and admin order status updates!

### 4. Supabase Database Migration
To set up your Supabase database:
1. Go to your [Supabase Dashboard](https://app.supabase.com).
2. Open the **SQL Editor**.
3. Copy and paste the contents of `supabase/migrations/01_initial_schema.sql`.
4. Click **Run**.

This migration automatically:
- Creates `products`, `product_images`, `customers`, `orders`, `order_items`, and `site_settings` tables.
- Enables PostgreSQL Row Level Security (RLS) on all tables with strict access rules.
- Creates the `product-images` storage bucket with secure upload and public read policies.
- Seeds the initial single product, local default images, and website delivery settings.

### 5. Running the Application
```bash
# Run the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- Customer Landing Page: `http://localhost:3000`
- Checkout: `http://localhost:3000/checkout`
- Admin Login: `http://localhost:3000/admin/login` (Default demo credentials: `admin@forcefuel.com` / `admin123`)
- Admin Dashboard: `http://localhost:3000/admin`

---

## 🛡 Security Highlights

- **Server-Side Validation**: All orders, quantities, mobile numbers, and districts are validated server-side with Zod.
- **Server Price Calculation**: Product prices and delivery charges are calculated securely on the server; client-submitted prices are ignored.
- **Rate Limiting & Duplicate Protection**: Rapid duplicate submissions for the same phone number are rejected with status 429.
- **Row Level Security**: Public anonymous users can only read active products and submit orders; admin orders, customers, and inventory require authenticated credentials.
- **Service Role Protection**: `SUPABASE_SERVICE_ROLE_KEY` is only accessed inside Next.js server route handlers and is never leaked to the client bundle.

---

## 📦 Production Build & Deployment

```bash
# Build the production application
npm run build

# Start production server
npm start
```

Can be deployed instantly to **Vercel**, **Netlify**, or any Node.js hosting platform with the environment variables configured.
