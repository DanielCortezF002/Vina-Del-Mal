'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Truck, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { checkoutSchema, type CheckoutFormData, type OrderResponse } from '@/types/sprint2';
import { BRANCHES } from '@/data/mockData';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';

const DELIVERY_FEE_DEFAULT = 1990;

export default function CheckoutForm() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { branchId: '' },
  });

  const selectedBranchId = watch('branchId');
  const selectedBranch = BRANCHES.find((b) => b.id === selectedBranchId);
  const deliveryFee = selectedBranch?.deliveryFee ?? DELIVERY_FEE_DEFAULT;
  const subtotal = getTotalPrice();
  const total = subtotal + deliveryFee;

  const onSubmit = async (data: CheckoutFormData) => {
    setIsLoading(true);
    try {
      // Crear orden via API service (fallback a mock si backend no disponible)
      const { createOrder } = await import('@/lib/api/orders');
      const orderItems = items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const result = await createOrder({
        customer_name: data.email.split('@')[0],
        customer_email: data.email,
        customer_phone: data.phone,
        shipping_address: `${data.address}, ${data.commune}, ${data.city}`,
        items: orderItems,
      });

      // Ajustar total con delivery fee
      result.total = total;
      setOrder(result);
      clearCart();
    } catch {
      // Fallback: crear orden mock
      const mockOrder: OrderResponse = {
        orderId: `ORD-${Date.now()}`,
        status: 'pending',
        flowUrl: `https://www.flow.cl/app/pay.php?token=mock_${Date.now()}`,
        total,
        createdAt: new Date().toISOString(),
      };
      setOrder(mockOrder);
      clearCart();
    } finally {
      setIsLoading(false);
    }
  };

  if (order) {
    const estimatedMinutes = selectedBranch?.estimatedMinutes ?? 45;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-20"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={40} className="text-green-400" />
        </motion.div>
        <h2 className="font-heading text-3xl text-white mb-3">¡Orden Creada!</h2>
        <p className="text-vdm-text-muted mb-2">Orden #{order.orderId}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-medium mb-4">
          <Clock size={14} />
          Estado: Pendiente de pago
        </div>
        <div className="bg-vdm-surface border border-white/5 rounded-2xl p-5 mb-6 text-left">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-vdm-text-muted">Total</span>
            <span className="text-vdm-secondary font-bold">${order.total.toLocaleString('es-CL')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-vdm-text-muted">Entrega estimada</span>
            <span className="text-white flex items-center gap-1">
              <Truck size={14} />
              ~{estimatedMinutes} min
            </span>
          </div>
        </div>
        <p className="text-vdm-text-muted text-sm mb-6">
          Serás redirigido a <strong className="text-white">Flow</strong> para completar el pago
        </p>
        <a
          href={order.flowUrl}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-vdm-primary text-white font-semibold hover:bg-vdm-accent transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,0,0,0.35)]"
        >
          <CreditCard size={20} />
          Ir a pagar con Flow
        </a>
        <p className="text-xs text-vdm-text-muted/60 mt-4">Pago 100% seguro vía Flow · SSL</p>
      </motion.div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <p className="text-vdm-text-muted">Tu carrito está vacío.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {/* Left: Form fields */}
      <div className="space-y-6">
        <h2 className="font-heading text-2xl text-white">Datos de entrega</h2>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-vdm-text-muted mb-2">
            <Mail size={14} className="inline mr-1" />Email
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="tu@email.com"
            className={cn(
              'w-full bg-black/40 border rounded-xl px-4 py-3 text-white placeholder:text-vdm-text-muted/50 focus:outline-none transition-colors',
              errors.email ? 'border-red-500/60' : 'border-white/10 focus:border-vdm-primary/60'
            )}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-vdm-text-muted mb-2">
            <Phone size={14} className="inline mr-1" />Teléfono
          </label>
          <input
            {...register('phone')}
            placeholder="+56 9 1234 5678"
            className={cn(
              'w-full bg-black/40 border rounded-xl px-4 py-3 text-white placeholder:text-vdm-text-muted/50 focus:outline-none transition-colors',
              errors.phone ? 'border-red-500/60' : 'border-white/10 focus:border-vdm-primary/60'
            )}
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        {/* Branch selector */}
        <div>
          <label className="block text-sm font-medium text-vdm-text-muted mb-2">
            <Truck size={14} className="inline mr-1" />Sucursal más cercana
          </label>
          <select
            {...register('branchId')}
            className={cn(
              'w-full bg-black/40 border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors cursor-pointer',
              errors.branchId ? 'border-red-500/60' : 'border-white/10 focus:border-vdm-primary/60'
            )}
          >
            <option value="">Seleccionar sucursal...</option>
            {BRANCHES.map((b) => (
              <option key={b.id} value={b.id} disabled={!b.isOpen}>
                {b.name} — {b.commune} ({b.isOpen ? `$${b.deliveryFee.toLocaleString('es-CL')} · ~${b.estimatedMinutes}min` : 'Cerrado'})
              </option>
            ))}
          </select>
          {errors.branchId && <p className="text-red-400 text-xs mt-1">{errors.branchId.message}</p>}
          {selectedBranch && (
            <p className="text-xs text-vdm-text-muted mt-1.5 flex items-center gap-1">
              <MapPin size={12} className="text-vdm-primary" />
              {selectedBranch.address}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-vdm-text-muted mb-2">
            <MapPin size={14} className="inline mr-1" />Dirección de despacho
          </label>
          <input
            {...register('address')}
            placeholder="Av. Providencia 1234, Depto 5"
            className={cn(
              'w-full bg-black/40 border rounded-xl px-4 py-3 text-white placeholder:text-vdm-text-muted/50 focus:outline-none transition-colors',
              errors.address ? 'border-red-500/60' : 'border-white/10 focus:border-vdm-primary/60'
            )}
          />
          {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-vdm-text-muted mb-2">Ciudad</label>
            <input
              {...register('city')}
              placeholder="Santiago"
              className={cn(
                'w-full bg-black/40 border rounded-xl px-4 py-3 text-white placeholder:text-vdm-text-muted/50 focus:outline-none transition-colors',
                errors.city ? 'border-red-500/60' : 'border-white/10 focus:border-vdm-primary/60'
              )}
            />
            {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-vdm-text-muted mb-2">Comuna</label>
            <input
              {...register('commune')}
              placeholder="Providencia"
              className={cn(
                'w-full bg-black/40 border rounded-xl px-4 py-3 text-white placeholder:text-vdm-text-muted/50 focus:outline-none transition-colors',
                errors.commune ? 'border-red-500/60' : 'border-white/10 focus:border-vdm-primary/60'
              )}
            />
            {errors.commune && <p className="text-red-400 text-xs mt-1">{errors.commune.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-vdm-text-muted mb-2">Notas (opcional)</label>
          <textarea
            {...register('notes')}
            rows={2}
            placeholder="Instrucciones especiales para el despacho..."
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-vdm-text-muted/50 focus:outline-none focus:border-vdm-primary/60 transition-colors resize-none"
          />
        </div>
      </div>

      {/* Right: Order summary */}
      <div>
        <div className="bg-vdm-surface border border-white/5 rounded-2xl p-6 sticky top-24">
          <h3 className="font-heading text-xl text-white mb-5">Resumen del pedido</h3>
          <div className="space-y-3 mb-5">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-vdm-text-muted">
                  {item.name} <span className="text-vdm-text-muted/60">×{item.quantity}</span>
                </span>
                <span className="text-white">${(item.price * item.quantity).toLocaleString('es-CL')}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-vdm-text-muted">
              <span>Subtotal</span>
              <span className="text-white">${subtotal.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between text-vdm-text-muted">
              <span>Delivery</span>
              <span className="text-white">${deliveryFee.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-white/10">
              <span className="text-white">Total</span>
              <span className="text-vdm-secondary">${total.toLocaleString('es-CL')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-vdm-primary text-white font-semibold hover:bg-vdm-accent transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,0,0,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CreditCard size={20} />
                Pagar con Flow
              </>
            )}
          </button>
          <p className="text-center text-xs text-vdm-text-muted mt-3">
            Pago 100% seguro vía Flow · SSL
          </p>
        </div>
      </div>
    </form>
  );
}
