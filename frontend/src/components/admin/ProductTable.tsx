'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Edit2,
  EyeOff,
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { MOCK_PRODUCTS, type Product } from '@/types/product';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 5;

/* ── Modal de producto (crear / editar) ────────────────────────────────── */

function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product?: Product;
  onClose: () => void;
  onSave: (data: Product) => void;
}) {
  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [brand, setBrand] = useState(product?.brand ?? '');
  const [category, setCategory] = useState(product?.category ?? '');
  const [abv, setAbv] = useState(product?.alcoholPercentage?.toString() ?? '');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Nombre requerido';
    if (!slug.trim()) errs.slug = 'Slug requerido';
    if (!price || Number(price) <= 0) errs.price = 'Precio inválido';
    if (!brand.trim()) errs.brand = 'Marca requerida';
    if (!category.trim()) errs.category = 'Categoría requerida';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const catSlug = category.toLowerCase().replace(/\s+/g, '-');
    const saved: Product = {
      id: product?.id ?? Date.now(),
      name: name.trim(),
      slug: slug.trim(),
      price: Number(price),
      brand: brand.trim(),
      category: category.trim(),
      categorySlug: catSlug,
      alcoholPercentage: abv ? Number(abv) : null,
      imageUrl:
        imageUrl.trim() ||
        'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600&auto=format&fit=crop',
      isActive: product?.isActive ?? true,
    };
    onSave(saved);
    onClose();
  };

  // Auto-generar slug desde nombre
  const handleNameChange = (v: string) => {
    setName(v);
    if (!product) {
      setSlug(
        v
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-vdm-surface border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h3 className="font-heading text-xl text-white">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg text-vdm-text-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-vdm-text-muted mb-1">Nombre</label>
              <input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-vdm-primary/60"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-vdm-text-muted mb-1">
                Slug (URL)
              </label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-vdm-primary/60"
              />
              {errors.slug && (
                <p className="text-red-400 text-xs mt-1">{errors.slug}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-vdm-text-muted mb-1">
                Precio (CLP)
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-vdm-primary/60"
              />
              {errors.price && (
                <p className="text-red-400 text-xs mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-vdm-text-muted mb-1">Marca</label>
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-vdm-primary/60"
              />
              {errors.brand && (
                <p className="text-red-400 text-xs mt-1">{errors.brand}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-vdm-text-muted mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-vdm-primary/60"
              >
                <option value="">Seleccionar...</option>
                {[
                  'Whisky',
                  'Vinos',
                  'Gin',
                  'Vodka',
                  'Tequila',
                  'Ron',
                  'Cerveza',
                  'Espumante',
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-400 text-xs mt-1">{errors.category}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-vdm-text-muted mb-1">
                Graduación (%)
              </label>
              <input
                value={abv}
                onChange={(e) => setAbv(e.target.value)}
                type="number"
                step="0.1"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-vdm-primary/60"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-vdm-text-muted mb-1">
                URL de imagen
              </label>
              <div className="flex gap-3">
                {imageUrl && (
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black/50 shrink-0">
                    <Image
                      src={imageUrl}
                      alt="preview"
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                )}
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-vdm-primary/60"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-vdm-text-muted hover:border-white/30 hover:text-white transition-all text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-vdm-primary text-white text-sm font-semibold hover:bg-vdm-accent transition-all"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Modal de confirmación de eliminación ──────────────────────────────── */

function DeleteConfirm({
  productName,
  onConfirm,
  onCancel,
}: {
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-vdm-surface border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-red-400" />
        </div>
        <h3 className="font-heading text-xl text-white mb-2">¿Eliminar producto?</h3>
        <p className="text-sm text-vdm-text-muted mb-6">
          Se eliminará <strong className="text-white">{productName}</strong> del catálogo.
          Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-vdm-text-muted hover:border-white/30 hover:text-white transition-all text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Tabla principal ───────────────────────────────────────────────────── */

export default function ProductTable() {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<{ open: boolean; product?: Product }>({
    open: false,
  });
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paged = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleActive = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
    );
  };

  const handleSave = (saved: Product) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === saved.id);
      if (exists) {
        return prev.map((p) => (p.id === saved.id ? saved : p));
      }
      return [saved, ...prev];
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl text-white mb-1">Productos</h1>
          <p className="text-vdm-text-muted text-sm">
            {products.length} productos registrados
          </p>
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
                {[
                  'Producto',
                  'Categoría',
                  'Precio',
                  'Alcohol',
                  'Estado',
                  'Acciones',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-vdm-text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr
                  key={p.id}
                  className={cn(
                    'border-b border-white/5 hover:bg-white/[0.02] transition-colors',
                    !p.isActive && 'opacity-50',
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-black/50 shrink-0">
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white">{p.name}</p>
                        <p className="text-xs text-vdm-text-muted">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-vdm-text-muted">{p.category}</td>
                  <td className="px-4 py-3 font-semibold text-vdm-secondary">
                    ${p.price.toLocaleString('es-CL')}
                  </td>
                  <td className="px-4 py-3 text-vdm-text-muted">
                    {p.alcoholPercentage ? `${p.alcoholPercentage}°` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'text-xs font-medium px-2 py-1 rounded-full border',
                        p.isActive
                          ? 'bg-green-500/10 text-green-400 border-green-500/30'
                          : 'bg-red-500/10 text-red-400 border-red-500/30',
                      )}
                    >
                      {p.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModal({ open: true, product: p })}
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
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-vdm-text-muted hover:text-red-400 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={15} />
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
            Mostrando {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, products.length)} de {products.length}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded-lg border border-white/10 text-vdm-text-muted hover:border-white/30 hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded-lg border border-white/10 text-vdm-text-muted hover:border-white/30 hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {modal.open && (
        <ProductModal
          product={modal.product}
          onClose={() => setModal({ open: false })}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          productName={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
