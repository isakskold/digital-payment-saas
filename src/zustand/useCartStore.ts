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
      totalItems: 0,
      subtotal: 0,
      tax: 0,
      total: 0,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.id === item.id);

        let newItems;
        if (existingItem) {
          // Update quantity if item already exists
          newItems = items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          // Add new item with quantity 1
          newItems = [...items, { ...item, quantity: 1 }];
        }

        // Calculate computed values
        const totalItems = newItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const subtotal = newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        set({
          items: newItems,
          totalItems,
          subtotal,
          total: subtotal,
        });
      },

      removeItem: (itemId) => {
        const { items } = get();
        const newItems = items.filter((item) => item.id !== itemId);

        // Calculate computed values
        const totalItems = newItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const subtotal = newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        set({
          items: newItems,
          totalItems,
          subtotal,
          total: subtotal,
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const { items } = get();
        const newItems = items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );

        // Calculate computed values
        const totalItems = newItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const subtotal = newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        set({
          items: newItems,
          totalItems,
          subtotal,
          total: subtotal,
        });
      },

      updateSpecialInstructions: (itemId, instructions) => {
        const { items } = get();
        const newItems = items.map((item) =>
          item.id === itemId
            ? { ...item, specialInstructions: instructions }
            : item
        );

        set({
          items: newItems,
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          subtotal: 0,
          total: 0,
        });
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
    }),
    {
      name: `cart-storage-${getTenantKey()}`,
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        subtotal: state.subtotal,
        total: state.total,
      }),
    }
  )
);
