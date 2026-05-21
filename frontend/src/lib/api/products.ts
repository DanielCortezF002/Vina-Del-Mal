/**
 * API de Productos — Viña del Mal
 * Fallback a MOCK_PRODUCTS si el backend no está disponible.
 */

import { apiFetch, isApiAvailable } from '../api';
import { MOCK_PRODUCTS, type Product } from '@/types/product';

export async function getProducts(category?: string): Promise<Product[]> {
  if (!isApiAvailable()) {
    const filtered = MOCK_PRODUCTS.filter((p) => p.isActive);
    if (category) return filtered.filter((p) => p.categorySlug === category);
    return filtered;
  }

  try {
    const params = category ? `?category=${category}` : '';
    return await apiFetch<Product[]>(`/api/v1/products${params}`);
  } catch {
    return MOCK_PRODUCTS.filter((p) => p.isActive);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isApiAvailable()) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  try {
    return await apiFetch<Product>(`/api/v1/products/slug/${slug}`);
  } catch {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function createProduct(
  data: Partial<Product>,
  token: string,
): Promise<Product> {
  return apiFetch<Product>('/api/v1/products', {
    method: 'POST',
    body: data,
    token,
  });
}

export async function updateProduct(
  id: number,
  data: Partial<Product>,
  token: string,
): Promise<Product> {
  return apiFetch<Product>(`/api/v1/products/${id}`, {
    method: 'PUT',
    body: data,
    token,
  });
}

export async function deleteProduct(id: number, token: string): Promise<void> {
  await apiFetch(`/api/v1/products/${id}`, { method: 'DELETE', token });
}
