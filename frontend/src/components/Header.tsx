'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, LayoutDashboard } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import CartSidebar from '@/components/CartSidebar';

export default function Header() {
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Block scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-vdm-dark/90 backdrop-blur-md border-b border-vdm-primary/20">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-heading text-2xl text-vdm-secondary tracking-wider shrink-0">
            VdM.
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-wider text-vdm-text-primary">
            <Link href="/catalogo" className="hover:text-vdm-primary transition-colors">
              Catálogo
            </Link>
            <Link href="/cocteles" className="hover:text-vdm-primary transition-colors">
              Cócteles
            </Link>
            <Link href="/promociones" className="hover:text-vdm-primary transition-colors">
              Promociones
            </Link>
            <Link href="/nosotros" className="hover:text-vdm-primary transition-colors">
              Nosotros
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 text-white">
            {/* Search toggle */}
            <button
              id="header-search-btn"
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-white/10 hover:text-vdm-primary transition-colors"
              aria-label="Abrir búsqueda"
            >
              <Search size={22} />
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="p-2 relative rounded-lg hover:bg-white/10 hover:text-vdm-primary transition-colors"
              aria-label="Ver carrito"
            >
              <ShoppingCart size={22} />
              {mounted && getTotalItems() > 0 && (
                <span className="absolute top-1 right-1 bg-vdm-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Admin shortcut — desktop only */}
            <Link
              href="/admin"
              className="hidden md:flex p-2 rounded-lg hover:bg-white/10 hover:text-vdm-secondary transition-colors"
              aria-label="Panel de administración"
              title="Admin"
            >
              <LayoutDashboard size={20} />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Search overlay (FE-5) ─── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            key="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col items-center pt-32 px-4"
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.05 }}
              className="w-full max-w-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-vdm-text-muted uppercase tracking-widest">Búsqueda</p>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-vdm-text-muted hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <SearchBar onClose={() => setSearchOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Mobile menu ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-0 right-0 z-40 bg-vdm-dark border-b border-vdm-primary/20 md:hidden"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-5 text-base font-medium uppercase tracking-wider">
              {[
                { href: '/catalogo', label: 'Catálogo' },
                { href: '/cocteles', label: 'Cócteles' },
                { href: '/promociones', label: 'Promociones' },
                { href: '/nosotros', label: 'Nosotros' },
                { href: '/admin', label: '⚙ Admin' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-vdm-text-primary hover:text-vdm-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Cart Sidebar (CART-2) ─── */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
