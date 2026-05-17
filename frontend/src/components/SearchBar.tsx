'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import { MOCK_PRODUCTS } from '@/types/product';
import type { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300); // FE-5: 300ms debounce

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // FE-5: Filter products on debounced query
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const q = debouncedQuery.toLowerCase();
    const filtered = MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    ).slice(0, 6);
    setResults(filtered);
    setIsOpen(true);
  }, [debouncedQuery]);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (product: Product) => {
    setQuery('');
    setIsOpen(false);
    router.push(`/catalogo/${product.slug}`);
    onClose?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      onClose?.();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <Search
            size={18}
            className="absolute left-4 text-vdm-text-muted pointer-events-none"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar producto, marca..."
            className="w-full bg-vdm-surface/80 backdrop-blur-md border border-white/10 rounded-2xl pl-11 pr-10 py-3 text-sm text-vdm-text-primary placeholder:text-vdm-text-muted focus:outline-none focus:border-vdm-primary/60 transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
              className="absolute right-3 p-1 rounded-full hover:bg-white/10 text-vdm-text-muted hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete dropdown */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-vdm-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 z-50"
          >
            <ul>
              {results.map((product, i) => (
                <li key={product.id}>
                  <button
                    onClick={() => handleSelect(product)}
                    className={cn(
                      'flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors text-left',
                      i < results.length - 1 && 'border-b border-white/5'
                    )}
                  >
                    {/* Thumbnail FE-5 */}
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-black/50 shrink-0">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="40px"
                        className="object-cover opacity-80"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-vdm-text-primary font-medium truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-vdm-text-muted">
                        {product.brand} · ${product.price.toLocaleString('es-CL')}
                      </p>
                    </div>
                    <span className="text-xs text-vdm-secondary shrink-0">{product.category}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-4 py-2.5 border-t border-white/5">
              <button
                onClick={handleSubmit as () => void}
                className="text-xs text-vdm-primary hover:underline"
              >
                Ver todos los resultados para &quot;{query}&quot; →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
