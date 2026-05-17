'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';

export default function Header() {
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-vdm-dark/90 backdrop-blur-md border-b border-vdm-primary/20">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="font-heading text-2xl text-vdm-secondary tracking-wider">
          VdM.
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-wider text-vdm-text-primary">
          <Link href="/catalogo" className="hover:text-vdm-primary transition-colors">
            Catálogo
          </Link>
          <Link href="/promociones" className="hover:text-vdm-primary transition-colors">
            Promociones
          </Link>
          <Link href="/nosotros" className="hover:text-vdm-primary transition-colors">
            Nosotros
          </Link>
        </nav>

        <div className="flex items-center gap-4 text-white">
          <button className="p-2 hover:text-vdm-primary transition-colors">
            <Search size={22} />
          </button>
          
          <button className="p-2 relative hover:text-vdm-primary transition-colors">
            <ShoppingCart size={22} />
            {mounted && getTotalItems() > 0 && (
              <span className="absolute top-0 right-0 bg-vdm-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4">
                {getTotalItems()}
              </span>
            )}
          </button>

          <button className="p-2 md:hidden hover:text-vdm-primary transition-colors">
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
