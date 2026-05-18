'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit2, EyeOff, Eye, X, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { productFormSchema, type ProductFormData } from '@/types/sprint2';
import { MOCK_PRODUCTS } from '@/types/product';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 5;

function ProductModal({ product, onClose }: {
  product?: Partial<ProductFormData>;
  onClose: () => void;
}) {
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? '');
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { ...product, imageUrl: imageUrl },
  });

  const onSubmit = (_data: ProductFormData) => {
    // TODO: POST or PATCH /api/v1/products when backend is ready
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-vdm-surface border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h3 className="font-heading text-xl text-white">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-vdm-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-vdm-text-muted mb-1">Nombre</label>
              <input {...register('name')} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-vdm-primary/60" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-vdm-text-muted mb-1">Slug (URL)</label>
              <input {...register('slug')} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-vdm-primary/60" />
              {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-vdm-text-muted mb-1">Precio (CLP)</label>
              <input {...register('price', { valueAsNumber: true })} type="number" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-vdm-primary/60" />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-vdm-text-muted mb-1">Marca</label>
              <input {...register('brand')} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-vdm-primary/60" />
            </div>
            <div>
              <label className="block text-xs text-vdm-text-muted mb-1">Graduación (%)</label>
              <input {...register('alcoholPercentage', { valueAsNumber: true })} type="number" step="0.1" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-vdm-primary/60" />
            </div>
          </div>

          {/* Cloudinary Upload — ADMIN-2 */}
          <div>
            <label className="block text-xs text-vdm-text-muted mb-2">Imagen del producto</label>
            <div className="flex items-center gap-3">
              {imageUrl && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/50 shrink-0">
                  <Image src={imageUrl} alt="preview" fill sizes="64px" className="object-cover" />
                </div>
              )}
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? 'vdm_unsigned'}
                onSuccess={(result) => {
                  if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                    const url = (result.info as { secure_url: string }).secure_url;
                    setImageUrl(url);
                    setValue('imageUrl', url);
                  }
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-vdm-primary/50 text-vdm-primary text-sm hover:bg-vdm-primary/10 transition-colors"
                  >
                    <Upload size={16} />
                    {imageUrl ? 'Cambiar imagen' : 'Subir imagen'}
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-vdm-text-muted hover:border-white/30 hover:text-white transition-all text-sm">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-vdm-primary text-white text-sm font-semibold hover:bg-vdm-accent transition-all">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductTable() {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<{ open: boolean; product?: Partial<ProductFormData> }>({ open: false });
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paged = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleActive = (id: number) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl text-white mb-1">Productos</h1>
          <p className="text-vdm-text-muted text-sm">{products.length} productos registrados</p>
        </div>
        <button
          onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-vdm-primary text-white text-sm font-semibold hover:bg-vdm-accent transition-all"
        >
          <Plus size={18} />
          Nuevo producto
        </button>
      </div>

      <div className="bg-vdm-surface border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Producto', 'Categoría', 'Precio', 'Alcohol', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-vdm-text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id} className={cn('border-b border-white/5 hover:bg-white/2 transition-colors', !p.isActive && 'opacity-50')}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-black/50 shrink-0">
                        <Image src={p.imageUrl} alt={p.name} fill sizes="40px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{p.name}</p>
                        <p className="text-xs text-vdm-text-muted">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-vdm-text-muted">{p.category}</td>
                  <td className="px-4 py-3 font-semibold text-vdm-secondary">${p.price.toLocaleString('es-CL')}</td>
                  <td className="px-4 py-3 text-vdm-text-muted">{p.alcoholPercentage ? `${p.alcoholPercentage}°` : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs font-medium px-2 py-1 rounded-full border', p.isActive ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30')}>
                      {p.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModal({ open: true, product: { name: p.name, slug: p.slug, price: p.price, brand: p.brand, alcoholPercentage: p.alcoholPercentage ?? undefined, imageUrl: p.imageUrl } })}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-vdm-text-muted hover:text-white transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => toggleActive(p.id)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-vdm-text-muted hover:text-yellow-400 transition-colors"
                        title={p.isActive ? 'Desactivar' : 'Activar'}
                      >
                        {p.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
          <p className="text-xs text-vdm-text-muted">
            Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, products.length)} de {products.length}
          </p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-1.5 rounded-lg border border-white/10 text-vdm-text-muted hover:border-white/30 hover:text-white disabled:opacity-30 transition-all">
              <ChevronLeft size={16} />
            </button>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="p-1.5 rounded-lg border border-white/10 text-vdm-text-muted hover:border-white/30 hover:text-white disabled:opacity-30 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {modal.open && <ProductModal product={modal.product} onClose={() => setModal({ open: false })} />}
    </div>
  );
}
