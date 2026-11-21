import type { Metadata, Viewport } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-context";
import { CartProvider } from "@/context/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { BRAND_NAME, PRODUCT_NAME, PRODUCT_NAME_BN, PRODUCT_PRICE, PRODUCT_SUBTITLE } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0B0B0D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://forcefuel.com"),
  title: `${BRAND_NAME} – ${PRODUCT_NAME_BN} | অফিশিয়াল স্টোর`,
  description: `${PRODUCT_SUBTITLE}। আসল স্ট্যান্ডার্ডাইজড G115® জিনসেং ও KSM-66® অশ্বগন্ধা রুট এক্সট্রাক্ট সমৃদ্ধ। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।`,
  keywords: [
    "Force Fuel",
    "Eagle Endurance",
    "G115 Ginseng",
    "KSM-66 Ashwagandha",
    "পুরুষদের ভিটামিন সাপ্লিমেন্ট",
    "স্ট্যামিনা ডায়েটারি সাপ্লিমেন্ট",
    "ক্যাশ অন ডেলিভারি বাংলাদেশ",
  ],
  authors: [{ name: BRAND_NAME }],
  openGraph: {
    title: `${BRAND_NAME} – ${PRODUCT_NAME} (${PRODUCT_NAME_BN})`,
    description: `${PRODUCT_SUBTITLE}। স্ট্যান্ডার্ডাইজড G115® জিনসেং ও KSM-66® অশ্বগন্ধা। ৬০ ডোজ। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।`,
    url: "https://forcefuel.com",
    siteName: BRAND_NAME,
    images: [
      {
        url: "/images/product/product-1.jpg",
        width: 1200,
        height: 1200,
        alt: `${BRAND_NAME} – ${PRODUCT_NAME}`,
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} – ${PRODUCT_NAME_BN}`,
    description: `${PRODUCT_SUBTITLE}। ৬০ ডোজ। ক্যাশ অন ডেলিভারি।`,
    images: ["/images/product/product-1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${BRAND_NAME} – ${PRODUCT_NAME}`,
    image: ["/images/product/product-1.jpg"],
    description: `${PRODUCT_SUBTITLE}. Formulated with standardized G115® Ginseng and KSM-66® Ashwagandha root extract. 60 doses.`,
    brand: {
      "@type": "Brand",
      name: BRAND_NAME,
    },
    offers: {
      "@type": "Offer",
      url: "https://forcefuel.com",
      priceCurrency: "BDT",
      price: PRODUCT_PRICE,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: BRAND_NAME,
      },
    },
  };

  // Inline script to prevent theme flickering on page load
  const themeInitScript = `
    (function() {
      try {
        var stored = localStorage.getItem('force_fuel_theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (stored === 'dark' || (!stored && prefersDark)) {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        }
      } catch (e) {}
    })();
  `;

  return (
    <html lang="bn" suppressHydrationWarning className={`${inter.variable} ${cinzel.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      </head>
      <body className="bg-brand-bg text-brand-text min-h-screen antialiased selection:bg-brand-gold selection:text-black">
        <ThemeProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
