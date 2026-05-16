'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgeVerification } from '@/hooks/useAgeVerification';

// ── Variantes de animación separadas para claridad ────────────────────────────
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 8 },
};

// ── Componente ────────────────────────────────────────────────────────────────
export default function AgeVerificationModal() {
  const { status, verify, reject } = useAgeVerification();

  // 'pending' = estamos en SSR o en la hidratación inicial → render null
  // El portal solo se monta cuando sabemos la respuesta del cliente
  const isOpen = status === 'rejected';

  // Bloquear scroll del body cuando el modal está activo
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // createPortal requiere el DOM, que solo existe en el cliente.
  // En Next.js 14 App Router, 'use client' garantiza que el componente
  // no se ejecuta en el servidor, pero `document` aún puede no existir
  // durante el primer render reactivo. La guarda de status === 'pending' lo resuelve.
  if (status === 'pending') return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="age-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          // Evitar cierre accidental al hacer clic fuera
          aria-modal="true"
          role="dialog"
          aria-labelledby="age-modal-title"
          aria-describedby="age-modal-description"
        >
          <motion.div
            key="age-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md text-center"
          >
            {/* Borde con gradiente para efecto premium */}
            <div className="rounded-2xl border border-vdm-primary/60 bg-vdm-surface shadow-2xl shadow-black/60 p-8 md:p-10">
              
              {/* Decorador superior */}
              <div className="mx-auto mb-6 w-12 h-1 rounded-full bg-gradient-to-r from-vdm-primary to-vdm-secondary" />

              {/* Logo / Nombre */}
              <h2
                id="age-modal-title"
                className="font-heading text-3xl md:text-4xl text-vdm-secondary mb-3 tracking-wide"
              >
                Viña del Mal
              </h2>

              {/* Aviso de contenido adulto */}
              <p className="text-xs uppercase tracking-widest text-vdm-text-muted mb-6 font-medium">
                Contenido Solo Para Adultos
              </p>

              {/* Texto legal */}
              <p
                id="age-modal-description"
                className="text-vdm-text-primary text-sm md:text-base leading-relaxed mb-8"
              >
                Para ingresar a nuestra tienda debes ser mayor de{' '}
                <strong className="text-vdm-secondary">18 años</strong>. Al
                confirmar, declaras bajo responsabilidad propia cumplir con la
                edad legal para la adquisición de bebidas alcohólicas según la
                legislación chilena vigente.
              </p>

              {/* Acciones */}
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                {/* Secundario: Rechazar */}
                <button
                  id="age-reject-btn"
                  type="button"
                  onClick={reject}
                  className="flex-1 px-6 py-3 rounded-lg border border-vdm-primary/60 text-vdm-text-muted text-sm font-medium
                             transition-all duration-200
                             hover:border-vdm-primary hover:text-vdm-text-primary
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vdm-primary focus-visible:ring-offset-2 focus-visible:ring-offset-vdm-surface"
                >
                  No, salir
                </button>

                {/* Primario: Confirmar */}
                <button
                  id="age-verify-btn"
                  type="button"
                  onClick={verify}
                  className="flex-1 px-6 py-3 rounded-lg bg-vdm-primary text-white text-sm font-semibold
                             transition-all duration-200
                             hover:bg-vdm-accent hover:shadow-lg hover:shadow-vdm-primary/30
                             active:scale-95
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vdm-accent focus-visible:ring-offset-2 focus-visible:ring-offset-vdm-surface"
                >
                  Soy mayor de 18
                </button>
              </div>

              {/* Aviso legal de pie */}
              <p className="mt-6 text-xs text-vdm-text-muted/70 leading-snug">
                Este sitio contiene información sobre productos con alcohol. El consumo de
                alcohol es perjudicial para la salud. Prohibida su venta a menores de 18 años.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
