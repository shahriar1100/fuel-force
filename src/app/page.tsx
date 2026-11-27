import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { ProductHighlights } from "@/components/landing/product-highlights";
import { ProductDescription } from "@/components/landing/product-description";
import { ProductGallery } from "@/components/landing/product-gallery";
import { FAQSection } from "@/components/landing/faq-section";
import { OrderCTASection } from "@/components/landing/order-cta-section";
import { Footer } from "@/components/landing/footer";
import { MobileStickyBar } from "@/components/landing/mobile-sticky-bar";
import { getStoreData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const { product, images, bannerImage, settings } = await getStoreData();

  return (
    <div className="relative min-h-screen bg-brand-bg flex flex-col">
      {/* Header with live settings (phone, announcement) */}
      <Header settings={settings} />

      <main className="flex-1">
        {/* Hero Section with Live Banner Image & Price */}
        <HeroSection product={product} bannerImage={bannerImage} />

        {/* Product Highlights */}
        <ProductHighlights />

        {/* Product Description & Specifications */}
        <ProductDescription product={product} image={images[1] || bannerImage} />

        {/* Dynamic Product Gallery */}
        <ProductGallery images={images} />

        {/* FAQ */}
        <FAQSection />

        {/* Order CTA Section with Live Banner Image & Price */}
        <OrderCTASection product={product} bannerImage={bannerImage} />
      </main>

      {/* Dynamic Compact Footer with DB Settings */}
      <Footer settings={settings} />

      {/* Sticky Bottom Buy Now on Mobile with Live Price */}
      <MobileStickyBar price={product.price} bannerImage={bannerImage.url} />
    </div>
  );
}
