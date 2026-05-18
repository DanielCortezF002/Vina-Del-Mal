import { Suspense } from 'react';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export const metadata = {
  title: 'Checkout | Viña del Mal',
  description: 'Completa tu pedido de forma segura.',
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-vdm-dark">
      <div className="border-b border-white/5 bg-black/30">
        <div className="container mx-auto px-4 py-10">
          <h1 className="font-heading text-4xl text-white mb-2">Checkout</h1>
          <p className="text-vdm-text-muted text-sm">Completa tu información para recibir tu pedido</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-10">
        <Suspense fallback={<div className="text-vdm-text-muted">Cargando...</div>}>
          <CheckoutForm />
        </Suspense>
      </div>
    </div>
  );
}
