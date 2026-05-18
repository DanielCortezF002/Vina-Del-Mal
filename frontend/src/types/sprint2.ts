import { z } from 'zod';

// ── Checkout / CART-3 ─────────────────────────────────────────────────────

export const checkoutSchema = z.object({
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .regex(/^\+?56\s?9\s?\d{4}\s?\d{4}$/, 'Teléfono inválido. Ej: +56 9 1234 5678')
    .or(z.string().regex(/^9\d{8}$/, 'Teléfono inválido')),
  address: z.string().min(10, 'Dirección muy corta').max(200),
  city: z.string().min(2, 'Ciudad requerida'),
  commune: z.string().min(2, 'Comuna requerida'),
  branchId: z.string().min(1, 'Selecciona una sucursal'),
  notes: z.string().max(300).optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export interface Branch {
  id: string;
  name: string;
  address: string;
  commune: string;
  deliveryFee: number;
  estimatedMinutes: number;
  isOpen: boolean;
}

export interface OrderResponse {
  orderId: string;
  status: 'pending' | 'paid' | 'dispatched' | 'delivered' | 'cancelled';
  flowUrl?: string;
  total: number;
  createdAt: string;
}

// ── Admin ─────────────────────────────────────────────────────────────────

export interface SalesDataPoint {
  label: string;
  ventas: number;
  ordenes: number;
}

export interface TopProduct {
  id: number;
  name: string;
  imageUrl: string;
  unitsSold: number;
  revenue: number;
}

export interface PendingOrder {
  id: string;
  customerEmail: string;
  total: number;
  itemCount: number;
  createdAt: string;
  commune: string;
}

export interface StockItem {
  productId: number;
  productName: string;
  imageUrl: string;
  branch: string;
  currentStock: number;
  minStockAlert: number;
  lastMovement: string;
}

export interface StockMovement {
  id: string;
  productName: string;
  type: 'entrada' | 'salida' | 'ajuste';
  quantity: number;
  reason: string;
  branch: string;
  operatorName: string;
  createdAt: string;
}

export const stockAdjustSchema = z.object({
  productId: z.number(),
  branchId: z.string().min(1),
  type: z.enum(['entrada', 'salida', 'ajuste']),
  quantity: z.number().int().positive('Cantidad debe ser positiva'),
  reason: z.string().min(5, 'Ingresa el motivo del ajuste').max(200),
});

export type StockAdjustData = z.infer<typeof stockAdjustSchema>;

export const productFormSchema = z.object({
  name: z.string().min(3, 'Nombre muy corto').max(120),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  price: z.number().positive('Precio debe ser positivo'),
  categoryId: z.number().int().positive('Selecciona categoría'),
  brand: z.string().min(2),
  alcoholPercentage: z.number().min(0).max(100).optional(),
  imageUrl: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
