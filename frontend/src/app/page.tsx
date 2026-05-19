import Hero from "@/components/Hero";
import FeaturedCarousel from "@/components/FeaturedCarousel";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-vdm-dark">
      <Hero />
      <FeaturedCarousel />
    </main>
  );
}

