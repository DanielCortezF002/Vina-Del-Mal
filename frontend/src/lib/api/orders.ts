/**
 * API de Órdenes — Viña del Mal
 * Fallback a datos mock si el backend no está disponible.
 */

import { apiFetch, isApiAvailable } from '../api';
import type { OrderResponse, PendingOrder } from '@/types/sprint2';
import { MOCK_PENDING_ORDERS } from '@/data/mockData';

interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address?: string;
  items: { product_id: number; quantity: number }[];
}

export async function createOrder(
  data: CreateOrderPayload,
): Promise<OrderResponse> {
  if (!isApiAvailable()) {
    // Simular latencia de red
    await new Promise((r) => setTimeout(r, 1500));
    return {
      orderId: `ORD-${Date.now()}`,
      status: 'pending',
      flowUrl: `https://www.flow.cl/app/pay.php?token=mock_${Date.now()}`,
      total: 0,
      createdAt: new Date().toISOString(),
    };
  }

  return apiFetch<OrderResponse>('/api/v1/orders', {
    method: 'POST',
    body: data,
  });
}

export async function getOrders(token: string): Promise<PendingOrder[]> {
  if (!isApiAvailable()) return MOCK_PENDING_ORDERS;

  try {
    return await apiFetch<PendingOrder[]>('/api/v1/orders', { token });
  } catch {
    return MOCK_PENDING_ORDERS;
  }
}

export async function updateOrderStatus(
  orderId: number,
  status: string,
  token: string,
): Promise<void> {
  await apiFetch(`/api/v1/orders/${orderId}/status`, {
    method: 'PATCH',
    body: { status },
    token,
  });
}
