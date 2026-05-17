'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FEATURED_PRODUCTS = [
  { id: 1, name: "Whisky Johnnie Walker Blue Label", price: 215000, img: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600&auto=format&fit=crop" },
  { id: 2, name: "Vino Don Melchor Cabernet Sauvignon", price: 120000, img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop" },
  { id: 3, name: "Gin Hendrick's", price: 35000, img: "https://images.unsplash.com/photo-1609951651556-5334e2706168?q=80&w=600&auto=format&fit=crop" },
  { id: 4, name: "Vodka Grey Goose", price: 42000, img: "https://images.unsplash.com/photo-1614316131362-e6e22f280a74?q=80&w=600&auto=format&fit=crop" },
  { id: 5, name: "Tequila Don Julio 1942", price: 185000, img: "https://images.unsplash.com/photo-1516535794938-6063878f08cc?q=80&w=600&auto=format&fit=crop" },
];

export default function FeaturedCarousel() {
  return (
    <section className="py-20 bg-vdm-dark">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading text-vdm-secondary mb-2">Destacados</h2>
            <div className="w-12 h-1 bg-vdm-primary rounded-full"></div>
          </div>
          <Link href="/catalogo" className="text-vdm-text-muted hover:text-vdm-primary transition-colors text-sm font-medium uppercase tracking-wider">
            Ver Todos
          </Link>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="pb-12"
        >
          {FEATURED_PRODUCTS.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="group bg-vdm-surface rounded-xl border border-vdm-surface hover:border-vdm-primary/50 transition-all duration-300 overflow-hidden flex flex-col h-full">
                <div className="relative aspect-square overflow-hidden bg-black/50">
                  <Image 
                    src={product.img} 
                    alt={product.name} 
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vdm-surface via-transparent to-transparent opacity-80"></div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-heading text-lg text-vdm-text-primary mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-vdm-secondary font-semibold text-xl mt-auto mb-4">
                    ${product.price.toLocaleString('es-CL')}
                  </p>
                  
                  <button className="w-full py-2.5 rounded-lg bg-vdm-surface border border-vdm-primary/50 text-vdm-text-primary flex items-center justify-center gap-2 transition-all hover:bg-vdm-primary hover:text-white">
                    <ShoppingCart size={18} />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
