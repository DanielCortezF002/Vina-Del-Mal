import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?q=80&w=2072&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-vdm-dark/70 via-vdm-dark/80 to-vdm-dark"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <div className="mb-6 w-16 h-1 rounded-full bg-gradient-to-r from-vdm-primary to-vdm-secondary" />
        
        <h1 className="text-5xl md:text-7xl font-heading text-vdm-secondary mb-6 tracking-wide drop-shadow-lg">
          Viña del Mal
        </h1>
        
        <p className="text-lg md:text-2xl text-vdm-text-primary mb-10 font-light max-w-2xl leading-relaxed">
          Descubre nuestra selección exclusiva de vinos, licores y destilados premium. 
          Entregas rápidas y discretas directo a tu puerta.
        </p>

        <Link 
          href="/catalogo"
          className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-vdm-primary text-white text-lg font-semibold tracking-wide transition-all duration-300 hover:bg-vdm-accent hover:shadow-[0_0_20px_rgba(139,0,0,0.4)] hover:-translate-y-1"
        >
          Ver Catálogo
        </Link>
      </div>
    </section>
  );
}
