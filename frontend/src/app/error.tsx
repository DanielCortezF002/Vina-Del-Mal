'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: Sentry.captureException(error) when Sentry is configured
  }, [error]);

  return (
    <div className="min-h-screen bg-vdm-dark flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-vdm-primary/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="font-heading text-3xl text-white mb-3">Algo salió mal</h2>
        <p className="text-vdm-text-muted text-sm mb-8">
          Ocurrió un error inesperado. Por favor intenta nuevamente.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-vdm-primary text-white font-semibold hover:bg-vdm-accent transition-all"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
