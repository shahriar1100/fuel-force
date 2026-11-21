import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { ProductHighlights } from "@/components/landing/product-highlights";
import { ProductDescription } from "@/components/landing/product-description";
import { ProductGallery } from "@/components/landing/product-gallery";
import { IngredientsSection } from "@/components/landing/ingredients-section";
import { ProductInfo } from "@/components/landing/product-info";
import { FAQSection } from "@/components/landing/faq-section";
import { OrderCTASection } from "@/components/landing/order-cta-section";
import { Footer } from "@/components/landing/footer";
import { MobileStickyBar } from "@/components/landing/mobile-sticky-bar";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-brand-bg flex flex-col">
      {/* A. Header */}
      <Header />

      <main className="flex-1">
        {/* B. Hero Section */}
        <HeroSection />

        {/* C. Product Highlights */}
        <ProductHighlights />

        {/* D. Product Description */}
        <ProductDescription />

        {/* E. Product Gallery */}
        <ProductGallery />

        {/* F. Ingredients Section */}
        <IngredientsSection />

        {/* G. Product Information */}
        <ProductInfo />

        {/* H. FAQ */}
        <FAQSection />

        {/* I. Order CTA Section */}
        <OrderCTASection />
      </main>

      {/* J. Footer */}
      <Footer />

      {/* Sticky Bottom Buy Now on Mobile */}
      <MobileStickyBar />
    </div>
  );
}
