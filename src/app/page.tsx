import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { ProductHighlights } from "@/components/landing/product-highlights";
import { ProductDescription } from "@/components/landing/product-description";
import { ProductGallery } from "@/components/landing/product-gallery";
import { FAQSection } from "@/components/landing/faq-section";
import { OrderCTASection } from "@/components/landing/order-cta-section";
import { Footer } from "@/components/landing/footer";
import { MobileStickyBar } from "@/components/landing/mobile-sticky-bar";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-brand-bg flex flex-col">
      {/* Header */}
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Product Highlights */}
        <ProductHighlights />

        {/* Product Description & Specifications */}
        <ProductDescription />

        {/* Product Gallery */}
        <ProductGallery />

        {/* FAQ */}
        <FAQSection />

        {/* Order CTA Section */}
        <OrderCTASection />
      </main>

      {/* Compact Footer */}
      <Footer />

      {/* Sticky Bottom Buy Now on Mobile */}
      <MobileStickyBar />
    </div>
  );
}
