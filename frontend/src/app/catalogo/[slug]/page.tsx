import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/types/product';
import type { Metadata } from 'next';
import ProductActions from './ProductActions';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = MOCK_PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) return { title: 'Producto no encontrado' };
  return {
    title: `${product.name} | Viña del Mal`,
    description: `${product.name} — ${product.brand}. ${product.category}. $${product.price.toLocaleString('es-CL')} CLP.`,
  };
}

export default function ProductDetailPage({ params }: Props) {
  const product = MOCK_PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const related = MOCK_PRODUCTS
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-vdm-dark">
      {/* Breadcrumb */}
      <div className="border-b border-white/5 bg-black/20">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs text-vdm-text-muted">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link>
            <span>/</span>
            <span className="text-vdm-secondary">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-vdm-surface border border-white/5 group">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-black/60 backdrop-blur-sm text-vdm-secondary border border-vdm-secondary/30">
                {product.category}
              </span>
              {product.alcoholPercentage && (
                <span className="px-3 py-1 text-xs font-medium rounded-md bg-black/60 backdrop-blur-sm text-vdm-text-muted">
                  {product.alcoholPercentage}°
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <p className="text-sm text-vdm-text-muted mb-2 uppercase tracking-wider">{product.brand}</p>
            <h1 className="font-heading text-3xl md:text-4xl text-white mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-vdm-secondary">
                ${product.price.toLocaleString('es-CL')}
              </span>
              <span className="text-sm text-vdm-text-muted">CLP</span>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-5 rounded-xl bg-vdm-surface/50 border border-white/5">
              <div>
                <p className="text-xs text-vdm-text-muted uppercase tracking-wider mb-1">Categoría</p>
                <p className="text-sm text-white font-medium">{product.category}</p>
              </div>
              <div>
                <p className="text-xs text-vdm-text-muted uppercase tracking-wider mb-1">Marca</p>
                <p className="text-sm text-white font-medium">{product.brand}</p>
              </div>
              {product.alcoholPercentage && (
                <div>
                  <p className="text-xs text-vdm-text-muted uppercase tracking-wider mb-1">Graduación</p>
                  <p className="text-sm text-white font-medium">{product.alcoholPercentage}° GL</p>
                </div>
              )}
              <div>
                <p className="text-xs text-vdm-text-muted uppercase tracking-wider mb-1">Estado</p>
                <p className={`text-sm font-medium ${product.isActive ? 'text-green-400' : 'text-red-400'}`}>
                  {product.isActive ? '✓ Disponible' : '✗ Agotado'}
                </p>
              </div>
            </div>

            {/* Add to cart — client component */}
            <ProductActions product={product} />
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-1 bg-vdm-primary rounded-full" />
              También te puede gustar
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/catalogo/${r.slug}`}
                  className="group block rounded-xl overflow-hidden bg-vdm-surface border border-white/5 hover:border-vdm-primary/40 transition-all"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={r.imageUrl}
                      alt={r.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-75 group-hover:opacity-100"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-vdm-text-muted">{r.brand}</p>
                    <h3 className="text-sm text-white font-medium line-clamp-1">{r.name}</h3>
                    <p className="text-vdm-secondary font-bold text-sm mt-1">${r.price.toLocaleString('es-CL')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
