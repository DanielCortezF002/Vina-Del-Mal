import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pago Fallido | Viña del Mal',
};

export default function CheckoutFailurePage() {
  return (
    <div className="min-h-screen bg-vdm-dark flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Failure icon */}
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-8 border-2 border-red-500/40">
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="font-heading text-4xl text-white mb-4">Pago no procesado</h1>

        <p className="text-vdm-text-muted text-base mb-3 leading-relaxed">
          Tu pago no pudo ser completado. No se realizó ningún cargo a tu cuenta.
          Puedes intentar nuevamente o usar otro medio de pago.
        </p>

        <p className="text-xs text-vdm-text-muted/70 mb-8">
          Si el problema persiste, contáctanos a soporte@vinadelmal.cl
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/checkout"
            className="px-6 py-3 rounded-xl bg-vdm-primary text-white font-semibold hover:bg-vdm-accent transition-all"
          >
            Reintentar Pago
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
