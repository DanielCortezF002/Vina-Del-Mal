import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-vdm-dark flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-heading text-8xl text-vdm-primary mb-4">404</p>
        <h2 className="font-heading text-3xl text-white mb-3">Página no encontrada</h2>
        <p className="text-vdm-text-muted text-sm mb-8">
          La página que buscas no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-vdm-primary text-white font-semibold hover:bg-vdm-accent transition-all"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
