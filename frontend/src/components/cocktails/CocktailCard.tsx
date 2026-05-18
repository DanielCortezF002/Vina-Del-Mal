'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { Cocktail } from '@/types/cocktail';
import { DIFFICULTY_COLORS } from '@/types/cocktail';
import { cn } from '@/lib/utils';

export default function CocktailCard({ cocktail }: { cocktail: Cocktail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-vdm-surface border border-white/5 hover:border-vdm-primary/40 rounded-2xl overflow-hidden transition-all duration-300"
    >
      <Link href={`/cocteles/${cocktail.slug}`}>
        <div className="relative h-52 overflow-hidden">
          <Image
            src={cocktail.image}
            alt={cocktail.name}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-vdm-surface via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {cocktail.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-vdm-secondary border border-vdm-secondary/30">
                {tag}
              </span>
            ))}
          </div>
          <div className={cn('absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-md border backdrop-blur-sm', DIFFICULTY_COLORS[cocktail.difficulty])}>
            {cocktail.difficulty}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-heading text-lg text-white leading-tight group-hover:text-vdm-secondary transition-colors">
              {cocktail.name}
            </h3>
            <div className="flex items-center gap-1 text-vdm-text-muted shrink-0 text-xs mt-0.5">
              <Clock size={12} />
              <span>{cocktail.prepTime}min</span>
            </div>
          </div>
          <p className="text-vdm-text-muted text-sm line-clamp-2 mb-3">{cocktail.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-vdm-text-muted">{cocktail.ingredients.length} ingredientes</span>
            <span className="text-xs font-medium text-vdm-primary group-hover:underline">Ver receta →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
