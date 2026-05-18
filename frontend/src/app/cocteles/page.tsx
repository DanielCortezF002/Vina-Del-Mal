'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CocktailCard from '@/components/cocktails/CocktailCard';
import { COCKTAILS } from '@/data/cocktails';
import { BASE_SPIRITS, DIFFICULTY_COLORS } from '@/types/cocktail';
import type { Cocktail } from '@/types/cocktail';
import { cn } from '@/lib/utils';

const DIFFICULTIES: Cocktail['difficulty'][] = ['fácil', 'medio', 'difícil'];

export default function CoctelesCatalog() {
  const [spirit, setSpirit] = useState('Todos');
  const [difficulty, setDifficulty] = useState('');
  const [tag, setTag] = useState('');

  const allTags = useMemo(() => {
    const set = new Set<string>();
    COCKTAILS.forEach((c) => c.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => COCKTAILS.filter((c) => {
    if (spirit !== 'Todos' && c.baseSpirit !== spirit) return false;
    if (difficulty && c.difficulty !== difficulty) return false;
    if (tag && !c.tags.includes(tag)) return false;
    return true;
  }), [spirit, difficulty, tag]);

  return (
    <div className="min-h-screen bg-vdm-dark">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/30">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-heading text-4xl text-white mb-2">Cócteles</h1>
          <p className="text-vdm-text-muted text-sm">
            {COCKTAILS.length} recetas clásicas para preparar en casa
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="space-y-4 mb-8">
          {/* Spirit filter */}
          <div>
            <p className="text-xs text-vdm-text-muted uppercase tracking-wider mb-2">Licor base</p>
            <div className="flex flex-wrap gap-2">
              {BASE_SPIRITS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpirit(s)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                    spirit === s
                      ? 'bg-vdm-primary border-vdm-primary text-white'
                      : 'bg-transparent border-white/10 text-vdm-text-muted hover:border-vdm-primary/50 hover:text-white'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Difficulty filter */}
            <div>
              <p className="text-xs text-vdm-text-muted uppercase tracking-wider mb-2">Dificultad</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDifficulty('')}
                  className={cn('px-3 py-1.5 rounded-xl text-xs font-medium border transition-all', !difficulty ? 'bg-vdm-primary border-vdm-primary text-white' : 'border-white/10 text-vdm-text-muted hover:text-white')}
                >
                  Todas
                </button>
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(difficulty === d ? '' : d)}
                    className={cn('px-3 py-1.5 rounded-xl text-xs font-medium border transition-all capitalize', difficulty === d ? DIFFICULTY_COLORS[d] : 'border-white/10 text-vdm-text-muted hover:text-white')}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag filter */}
            <div>
              <p className="text-xs text-vdm-text-muted uppercase tracking-wider mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {allTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(tag === t ? '' : t)}
                    className={cn('px-3 py-1.5 rounded-xl text-xs font-medium border transition-all capitalize', tag === t ? 'bg-vdm-secondary/20 border-vdm-secondary text-vdm-secondary' : 'border-white/10 text-vdm-text-muted hover:text-white')}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-vdm-text-muted mb-6">
          <span className="text-white font-semibold">{filtered.length}</span> recetas encontradas
        </p>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((cocktail) => (
              <motion.div key={cocktail.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CocktailCard cocktail={cocktail} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-vdm-text-muted">No hay recetas con esos filtros.</p>
            <button onClick={() => { setSpirit('Todos'); setDifficulty(''); setTag(''); }} className="mt-4 text-vdm-primary text-sm hover:underline">
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
