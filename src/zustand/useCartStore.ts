// Private function for tenant-aware cart storage
function getTenantKey(): string {
  if (typeof window === "undefined") return "default";
  const hostname = window.location.hostname;
  // Main domain or localhost: use default
  if (
    hostname === "localhost" ||
    hostname === "localhost:3000" ||
    hostname === "yourplatform.com"
  ) {
    return "default";
  }
  // Subdomain or custom domain
  return hostname.split(".")[0];
}

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  specialInstructions?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateSpecialInstructions: (itemId: string, instructions: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed values
  totalItems: number;
  subtotal: number;
  tax: number;
  total: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.id === item.id);

        if (existingItem) {
          // Update quantity if item already exists
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          // Add new item with quantity 1
          set({
            items: [...items, { ...item, quantity: 1 }],
          });
        }
      },

      removeItem: (itemId) => {
        const { items } = get();
        set({
          items: items.filter((item) => item.id !== itemId),
        });
      },

      updateQuantity: (itemId, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set({
          items: items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      updateSpecialInstructions: (itemId, instructions) => {
        const { items } = get();
        set({
          items: items.map((item) =>
            item.id === itemId
              ? { ...item, specialInstructions: instructions }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      // Computed values
      get totalItems() {
        const state = get();
        if (!state || !state.items) return 0;
        return state.items.reduce((sum, item) => sum + item.quantity, 0);
      },

      get subtotal() {
        const state = get();
        if (!state || !state.items) return 0;
        return state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      get tax() {
        // Tax calculation removed - keeping for future use
        return 0;
      },

      get total() {
        const state = get();
        if (!state) return 0;
        return state.subtotal;
      },
    }),
    {
      name: `cart-storage-${getTenantKey()}`,
      partialize: (state) => ({ items: state.items }),
    }
  )
);
