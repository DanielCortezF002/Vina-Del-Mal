import Hero from "@/components/Hero";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-vdm-dark">
      <Hero />
      <FeaturedCarousel />
      <Footer />
    </main>
  );
}
