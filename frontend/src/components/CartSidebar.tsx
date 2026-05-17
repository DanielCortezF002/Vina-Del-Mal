'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DELIVERY_FEE = 2990;

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const subtotal = getTotalPrice();
  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="cart-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[60] w-full max-w-md bg-vdm-surface border-l border-white/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={22} className="text-vdm-primary" />
                <h2 className="font-heading text-xl text-white">Carrito</h2>
                {items.length > 0 && (
                  <span className="text-xs font-semibold bg-vdm-primary/20 text-vdm-primary border border-vdm-primary/30 rounded-full px-2 py-0.5">
                    {items.reduce((t, i) => t + i.quantity, 0)} items
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-vdm-text-muted hover:text-white transition-colors"
                aria-label="Cerrar carrito"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <ShoppingBag size={48} className="text-vdm-primary/20 mb-4" />
                    <p className="text-vdm-text-muted text-sm">Tu carrito está vacío</p>
                    <button
                      onClick={onClose}
                      className="mt-4 text-vdm-primary text-sm font-medium hover:underline"
                    >
                      Explorar catálogo →
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 p-4 rounded-2xl bg-black/30 border border-white/5"
                    >
                      {/* Image */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/50 shrink-0">
                        <Image
                          src={item.img}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover opacity-80"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-vdm-text-primary line-clamp-2 leading-snug mb-1">
                          {item.name}
                        </p>
                        <p className="text-vdm-secondary font-bold text-base">
                          ${(item.price * item.quantity).toLocaleString('es-CL')}
                        </p>
                        <p className="text-xs text-vdm-text-muted">
                          ${item.price.toLocaleString('es-CL')} c/u
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 rounded-lg hover:bg-vdm-primary/20 text-vdm-text-muted hover:text-vdm-primary transition-colors"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 size={14} />
                        </button>

                        <div className="flex items-center gap-1 bg-black/40 rounded-xl border border-white/10">
                          <button
                            onClick={() =>
                              item.quantity === 1
                                ? removeItem(item.id)
                                : updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-7 h-7 flex items-center justify-center text-vdm-text-muted hover:text-white transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-vdm-text-muted hover:text-white transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer summary */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/10 bg-black/20 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-vdm-text-muted">
                    <span>Subtotal</span>
                    <span className="text-vdm-text-primary">${subtotal.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between text-vdm-text-muted">
                    <span>Delivery estimado</span>
                    <span className="text-vdm-text-primary">${DELIVERY_FEE.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-white/10">
                    <span className="text-white">Total</span>
                    <span className="text-vdm-secondary">${total.toLocaleString('es-CL')}</span>
                  </div>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-vdm-primary text-white font-semibold text-sm tracking-wide hover:bg-vdm-accent transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,0,0,0.35)]"
                >
                  Ir al Checkout
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs text-vdm-text-muted hover:text-vdm-primary transition-colors py-1"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
