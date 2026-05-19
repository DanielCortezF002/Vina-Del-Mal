import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pago Exitoso | Viña del Mal',
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-vdm-dark flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8 border-2 border-green-500/40">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-heading text-4xl text-white mb-4">¡Pago Exitoso!</h1>

        <p className="text-vdm-text-muted text-base mb-3 leading-relaxed">
          Tu pedido ha sido confirmado y está siendo procesado.
          Recibirás un correo con los detalles de seguimiento.
        </p>

        <div className="bg-vdm-surface/50 rounded-xl p-5 mb-8 border border-white/5">
          <p className="text-xs text-vdm-text-muted uppercase tracking-wider mb-2">Número de orden</p>
          <p className="text-2xl font-bold text-vdm-secondary font-heading">#VDM-{Date.now().toString().slice(-6)}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/catalogo"
            className="px-6 py-3 rounded-xl bg-vdm-primary text-white font-semibold hover:bg-vdm-accent transition-all"
          >
            Seguir Comprando
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-white/10 text-vdm-text-muted font-medium hover:text-white hover:border-white/30 transition-all"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
