'use client';

import Image from 'next/image';
import { ShoppingCart, Info } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-vdm-surface rounded-xl border border-white/5 hover:border-vdm-primary/40 transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-black/60">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-75 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vdm-surface/90 via-transparent to-transparent" />

        {/* Category badge */}
        <span className="absolute top-3 left-3 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-vdm-secondary border border-vdm-secondary/30">
          {product.category}
        </span>

        {/* Alcohol badge */}
        {product.alcoholPercentage && (
          <span className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-vdm-text-muted">
            {product.alcoholPercentage}°
          </span>
        )}

        {/* Hover overlay with Ver detalles */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            href={`/catalogo/${product.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white text-sm font-medium border border-white/20 hover:bg-white/20 transition-colors"
          >
            <Info size={16} />
            Ver detalles
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-vdm-text-muted mb-1">{product.brand}</p>
        <h3 className="font-heading text-base text-vdm-text-primary mb-3 line-clamp-2 flex-grow leading-snug">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-auto">
          <p className="text-vdm-secondary font-bold text-lg">
            ${product.price.toLocaleString('es-CL')}
          </p>

          <button
            onClick={handleAdd}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300',
              added
                ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                : 'bg-vdm-primary/10 text-vdm-text-primary border border-vdm-primary/30 hover:bg-vdm-primary hover:text-white hover:border-vdm-primary'
            )}
          >
            <ShoppingCart size={16} />
            {added ? '¡Listo!' : 'Agregar'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
