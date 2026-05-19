'use client';

import { useState } from 'react';
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import type { Product } from '@/types/product';

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.imageUrl,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-1">
        <p className="text-xs text-vdm-text-muted uppercase tracking-wider mr-3">Cantidad</p>
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="w-9 h-9 rounded-lg bg-vdm-surface border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          aria-label="Reducir cantidad"
        >
          <Minus size={14} />
        </button>
        <span className="w-12 text-center text-white font-semibold text-lg">{qty}</span>
        <button
          onClick={() => setQty(qty + 1)}
          className="w-9 h-9 rounded-lg bg-vdm-surface border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          aria-label="Aumentar cantidad"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        disabled={!product.isActive}
        className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-3 transition-all duration-300 ${
          added
            ? 'bg-green-600/20 text-green-400 border border-green-500/30'
            : product.isActive
              ? 'bg-vdm-primary text-white hover:bg-vdm-accent hover:shadow-[0_0_30px_rgba(139,0,0,0.4)] hover:-translate-y-0.5'
              : 'bg-vdm-surface text-vdm-text-muted cursor-not-allowed border border-white/5'
        }`}
      >
        {added ? (
          <><Check size={20} /> ¡Agregado al carrito!</>
        ) : product.isActive ? (
          <><ShoppingCart size={20} /> Agregar al Carrito — ${(product.price * qty).toLocaleString('es-CL')}</>
        ) : (
          'Producto agotado'
        )}
      </button>
    </div>
  );
}
