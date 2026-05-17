'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutGrid, List, Package } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import FilterSidebar, { FilterToggleButton } from '@/components/FilterSidebar';
import { MOCK_PRODUCTS } from '@/types/product';
import type { FilterState } from '@/types/product';
import { cn } from '@/lib/utils';

const DEFAULT_FILTERS: FilterState = {
  category: '',
  minPrice: 0,
  maxPrice: 300000,
  brand: '',
  minAlcohol: 0,
  maxAlcohol: 60,
  search: '',
};

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name';

export default function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Inicializar filtros desde URL params (FE-4 shareable)
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') ?? '',
    minPrice: Number(searchParams.get('minPrice') ?? 0),
    maxPrice: Number(searchParams.get('maxPrice') ?? 300000),
    brand: searchParams.get('brand') ?? '',
    minAlcohol: 0,
    maxAlcohol: 60,
    search: searchParams.get('search') ?? '',
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  // Sync filters to URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.minPrice > 0) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice < 300000) params.set('maxPrice', String(filters.maxPrice));
    if (filters.search) params.set('search', filters.search);
    router.replace(`/catalogo?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: string | number) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Client-side filtering (FE-4)
  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter((p) => {
      if (filters.category && p.categorySlug !== filters.category) return false;
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      if (filters.brand && p.brand !== filters.brand) return false;
      if (p.alcoholPercentage !== null && (p.alcoholPercentage ?? 0) > filters.maxAlcohol) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [filters, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.maxPrice < 300000) count++;
    if (filters.maxAlcohol < 60) count++;
    return count;
  }, [filters]);

  return (
    <div className="min-h-screen bg-vdm-dark">
      {/* Page Header */}
      <div className="border-b border-white/5 bg-black/30">
        <div className="container mx-auto px-4 py-10">
          <h1 className="font-heading text-4xl text-white mb-2">Catálogo</h1>
          <p className="text-vdm-text-muted text-sm">
            Descubre nuestra selección de licores, vinos y destilados premium
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <FilterToggleButton onClick={() => setMobileFilterOpen(true)} activeCount={activeFilterCount} />
            <p className="text-sm text-vdm-text-muted">
              <span className="text-white font-semibold">{filteredProducts.length}</span> productos
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-vdm-surface border border-white/10 text-sm text-vdm-text-primary rounded-xl px-3 py-2.5 focus:outline-none focus:border-vdm-primary/50 cursor-pointer"
            >
              <option value="relevance">Relevancia</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name">Nombre A-Z</option>
            </select>

            {/* Layout toggle */}
            <div className="hidden sm:flex bg-vdm-surface border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setLayout('grid')}
                className={cn('p-2.5 transition-colors', layout === 'grid' ? 'bg-vdm-primary text-white' : 'text-vdm-text-muted hover:text-white')}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={cn('p-2.5 transition-colors', layout === 'list' ? 'bg-vdm-primary text-white' : 'text-vdm-text-muted hover:text-white')}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-8 items-start">
          {/* Sidebar FE-4 */}
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            isMobileOpen={mobileFilterOpen}
            onMobileClose={() => setMobileFilterOpen(false)}
          />

          {/* Grid FE-3 */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Package size={48} className="text-vdm-primary/30 mb-4" />
                <h3 className="font-heading text-xl text-white mb-2">Sin resultados</h3>
                <p className="text-vdm-text-muted text-sm mb-6">
                  No encontramos productos con esos filtros
                </p>
                <button
                  onClick={handleReset}
                  className="px-5 py-2 rounded-xl bg-vdm-primary text-white text-sm font-medium hover:bg-vdm-accent transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className={cn(
                  'grid gap-5',
                  layout === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
                    : 'grid-cols-1'
                )}
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
