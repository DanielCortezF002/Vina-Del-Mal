import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ChefHat, ShoppingCart } from 'lucide-react';
import { COCKTAILS } from '@/data/cocktails';
import { MOCK_PRODUCTS } from '@/types/product';
import { DIFFICULTY_COLORS } from '@/types/cocktail';
import { cn } from '@/lib/utils';

export async function generateStaticParams() {
  return COCKTAILS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cocktail = COCKTAILS.find((c) => c.slug === slug);
  if (!cocktail) return {};
  return {
    title: `${cocktail.name} | Cócteles Viña del Mal`,
    description: cocktail.description,
  };
}

export default async function CocktailDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cocktail = COCKTAILS.find((c) => c.slug === slug);
  if (!cocktail) notFound();

  // COCKTAIL-2: "Productos necesarios" — link ingredients to catalog
  const relatedProducts = cocktail.ingredients
    .filter((i) => i.productSlug)
    .map((i) => ({
      ingredient: i,
      product: MOCK_PRODUCTS.find((p) => p.slug === i.productSlug),
    }))
    .filter((r) => r.product !== undefined);

  return (
    <div className="min-h-screen bg-vdm-dark">
      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <Image src={cocktail.image} alt={cocktail.name} fill className="object-cover opacity-40" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-vdm-dark via-vdm-dark/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={cn('text-xs font-medium px-3 py-1 rounded-full border', DIFFICULTY_COLORS[cocktail.difficulty])}>
              {cocktail.difficulty}
            </span>
            <span className="flex items-center gap-1 text-xs text-vdm-text-muted">
              <Clock size={12} />
              {cocktail.prepTime} minutos
            </span>
            <span className="text-xs text-vdm-text-muted">{cocktail.glassType}</span>
            {cocktail.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-black/60 text-vdm-secondary border border-vdm-secondary/30">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-heading text-5xl text-white">{cocktail.name}</h1>
          <p className="text-vdm-text-muted mt-2 max-w-xl">{cocktail.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 grid lg:grid-cols-3 gap-10">
        {/* Left: Ingredients */}
        <div className="lg:col-span-1">
          <div className="bg-vdm-surface border border-white/5 rounded-2xl p-6 sticky top-24">
            <h2 className="font-heading text-xl text-white mb-5 flex items-center gap-2">
              <ChefHat size={20} className="text-vdm-primary" />
              Ingredientes
            </h2>
            <ul className="space-y-3">
              {cocktail.ingredients.map((ing, i) => (
                <li key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-vdm-text-primary text-sm">{ing.name}</span>
                  <span className="text-vdm-secondary text-sm font-semibold ml-3 shrink-0">
                    {ing.amount} {ing.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Steps + Related Products */}
        <div className="lg:col-span-2 space-y-10">
          {/* Steps */}
          <div>
            <h2 className="font-heading text-2xl text-white mb-6">Preparación</h2>
            <ol className="space-y-5">
              {cocktail.steps.map((step, i) => (
                <li key={i} className="flex gap-5">
                  <div className="w-9 h-9 rounded-xl bg-vdm-primary/20 border border-vdm-primary/40 flex items-center justify-center shrink-0 font-heading text-vdm-primary font-bold">
                    {i + 1}
                  </div>
                  <p className="text-vdm-text-primary leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* COCKTAIL-2: Productos necesarios */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="font-heading text-2xl text-white mb-5 flex items-center gap-2">
                <ShoppingCart size={22} className="text-vdm-secondary" />
                Productos necesarios
              </h2>
              <p className="text-vdm-text-muted text-sm mb-5">
                Consigue los ingredientes directamente desde nuestro catálogo
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedProducts.map(({ ingredient, product }) => product && (
                  <Link
                    key={product.id}
                    href={`/catalogo/${product.slug}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-vdm-surface border border-white/5 hover:border-vdm-primary/40 transition-all group"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black/50 shrink-0">
                      <Image src={product.imageUrl} alt={product.name} fill sizes="56px" className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-vdm-text-muted mb-0.5">{ingredient.name}</p>
                      <p className="text-sm font-medium text-white truncate">{product.name}</p>
                      <p className="text-vdm-secondary font-bold text-sm">${product.price.toLocaleString('es-CL')}</p>
                    </div>
                    <span className="text-vdm-primary text-xs font-medium shrink-0 group-hover:underline">Ver →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back */}
          <Link href="/cocteles" className="inline-flex items-center gap-2 text-vdm-text-muted hover:text-vdm-primary transition-colors text-sm">
            ← Volver a cócteles
          </Link>
        </div>
      </div>
    </div>
  );
}
