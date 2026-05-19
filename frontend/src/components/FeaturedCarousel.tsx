'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ShoppingCart, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { MOCK_PRODUCTS } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FEATURED = MOCK_PRODUCTS.slice(0, 6);

export default function FeaturedCarousel() {
  const addItem = useCartStore((s) => s.addItem);
  const [addedId, setAddedId] = useState<number | null>(null);

  const handleAdd = (product: typeof FEATURED[number]) => {
    addItem({ id: product.id, name: product.name, price: product.price, img: product.imageUrl });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

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
          {FEATURED.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="group bg-vdm-surface rounded-xl border border-vdm-surface hover:border-vdm-primary/50 transition-all duration-300 overflow-hidden flex flex-col h-full">
                <div className="relative aspect-square overflow-hidden bg-black/50">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vdm-surface via-transparent to-transparent opacity-80"></div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-heading text-lg text-vdm-text-primary mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-vdm-secondary font-semibold text-xl mt-auto mb-4">
                    ${product.price.toLocaleString('es-CL')}
                  </p>

                  <button
                    onClick={() => handleAdd(product)}
                    className={`w-full py-2.5 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                      addedId === product.id
                        ? 'bg-green-600/20 text-green-400 border-green-500/30'
                        : 'bg-vdm-surface border-vdm-primary/50 text-vdm-text-primary hover:bg-vdm-primary hover:text-white'
                    }`}
                  >
                    {addedId === product.id ? (
                      <><Check size={18} /><span>¡Agregado!</span></>
                    ) : (
                      <><ShoppingCart size={18} /><span>Agregar</span></>
                    )}
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

