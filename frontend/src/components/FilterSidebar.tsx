'use client';

import { X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FilterState } from '@/types/product';
import { CATEGORIES, BRANDS } from '@/types/product';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string | number) => void;
  onReset: () => void;
  // Mobile
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const MAX_PRICE = 300000;
const MAX_ALCOHOL = 60;

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-white/5 pb-5 mb-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 text-left"
      >
        <span className="text-sm font-semibold uppercase tracking-widest text-vdm-secondary">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={cn('text-vdm-text-muted transition-transform', open ? 'rotate-180' : '')}
        />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function FilterContent({ filters, onFilterChange, onReset }: Pick<FilterSidebarProps, 'filters' | 'onFilterChange' | 'onReset'>) {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl text-white">Filtros</h2>
        <button
          onClick={onReset}
          className="text-xs text-vdm-text-muted hover:text-vdm-primary transition-colors uppercase tracking-wider"
        >
          Limpiar todo
        </button>
      </div>

      {/* Categoría */}
      <FilterSection title="Categoría">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onFilterChange('category', cat.slug)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                filters.category === cat.slug
                  ? 'bg-vdm-primary border-vdm-primary text-white'
                  : 'bg-transparent border-white/10 text-vdm-text-muted hover:border-vdm-primary/50 hover:text-white'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Rango de precio */}
      <FilterSection title="Precio">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-vdm-text-muted">
            <span>${filters.minPrice.toLocaleString('es-CL')}</span>
            <span>${filters.maxPrice === MAX_PRICE ? '300.000+' : filters.maxPrice.toLocaleString('es-CL')}</span>
          </div>
          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            step={1000}
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', Number(e.target.value))}
            className="w-full accent-vdm-primary cursor-pointer"
          />
        </div>
      </FilterSection>

      {/* Marca */}
      <FilterSection title="Marca">
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brand === brand}
                onChange={() =>
                  onFilterChange('brand', filters.brand === brand ? '' : brand)
                }
                className="w-4 h-4 accent-vdm-primary rounded"
              />
              <span className="text-sm text-vdm-text-muted group-hover:text-white transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Graduación alcohólica */}
      <FilterSection title="Graduación Alcohólica">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-vdm-text-muted">
            <span>0°</span>
            <span>{filters.maxAlcohol}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={MAX_ALCOHOL}
            step={0.5}
            value={filters.maxAlcohol}
            onChange={(e) => onFilterChange('maxAlcohol', Number(e.target.value))}
            className="w-full accent-vdm-primary cursor-pointer"
          />
        </div>
      </FilterSection>
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onReset,
  isMobileOpen,
  onMobileClose,
}: FilterSidebarProps) {
  return (
    <>
      {/* ─── Desktop sidebar ─── */}
      <aside className="hidden lg:block w-64 shrink-0 bg-vdm-surface rounded-2xl border border-white/5 self-start sticky top-24 max-h-[calc(100vh-7rem)] overflow-hidden">
        <FilterContent filters={filters} onFilterChange={onFilterChange} onReset={onReset} />
      </aside>

      {/* ─── Mobile modal ─── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
            />
            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-vdm-surface border-r border-white/10 lg:hidden"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-5 right-5 p-2 rounded-lg hover:bg-white/10 text-vdm-text-muted hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <FilterContent filters={filters} onFilterChange={onFilterChange} onReset={onReset} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function FilterToggleButton({ onClick, activeCount }: { onClick: () => void; activeCount: number }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-vdm-surface border border-white/10 text-sm font-medium text-vdm-text-primary hover:border-vdm-primary/50 transition-all"
    >
      <SlidersHorizontal size={18} className="text-vdm-primary" />
      <span>Filtros</span>
      {activeCount > 0 && (
        <span className="w-5 h-5 rounded-full bg-vdm-primary text-white text-xs flex items-center justify-center">
          {activeCount}
        </span>
      )}
    </button>
  );
}
