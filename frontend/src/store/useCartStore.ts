import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  img: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'vdm-cart-storage',
      skipHydration: true,
    }
  )
);

/**
 * Hook to safely rehydrate the cart store on the client.
 * Prevents the 0→N flash on the cart badge during SSR hydration.
 * Usage: call once in a top-level client component (e.g., Header).
 */
export function useCartHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useCartStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  return hydrated;
}

