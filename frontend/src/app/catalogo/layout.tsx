import { Suspense } from 'react';
import CatalogPage from './page';

export const metadata = {
  title: 'Catálogo | Viña del Mal',
  description: 'Explora nuestra selección completa de vinos, licores y destilados premium con filtros avanzados.',
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-vdm-dark flex items-center justify-center text-vdm-text-muted">Cargando catálogo...</div>}>
      <CatalogPage />
    </Suspense>
  );
}
