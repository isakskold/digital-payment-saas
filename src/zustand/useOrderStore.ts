// Private function for tenant-aware order storage
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

export interface ActiveOrder {
  id: string;
  orderNumber: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "READY"
    | "OUT_FOR_DELIVERY"
    | "CANCELLED"
    | "COMPLETED";
  totalAmount: number;
  orderType: "PICKUP" | "DELIVERY";
  estimatedTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress?: string;
  orderInstructions?: string;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    specialInstructions?: string;
  }>;
}

interface OrderStore {
  orders: ActiveOrder[];
  selectedOrderId: string | null;
  activeOrder: ActiveOrder | null;
  isOrderStatusOpen: boolean;

  // Actions
  addOrder: (order: ActiveOrder) => void;
  selectOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: ActiveOrder["status"]) => void;
  clearActiveOrder: () => void;
  toggleOrderStatus: () => void;
  openOrderStatus: () => void;
  closeOrderStatus: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      selectedOrderId: null,
      activeOrder: null,
      isOrderStatusOpen: false,

      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
          selectedOrderId: order.id,
          activeOrder: order,
          isOrderStatusOpen: true,
        }));
      },

      selectOrder: (orderId) => {
        const order = get().orders.find((o) => o.id === orderId) || null;
        set({
          selectedOrderId: orderId,
          activeOrder: order,
          isOrderStatusOpen: true,
        });
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
          activeOrder:
            state.activeOrder && state.activeOrder.id === orderId
              ? { ...state.activeOrder, status }
              : state.activeOrder,
        }));
      },

      clearActiveOrder: () => {
        set((state) => {
          const remaining = state.orders.filter(
            (o) => o.id !== state.selectedOrderId
          );
          return {
            orders: remaining,
            selectedOrderId: remaining[0]?.id || null,
            activeOrder: remaining[0] || null,
            isOrderStatusOpen: remaining.length > 0 && state.isOrderStatusOpen,
          };
        });
      },

      toggleOrderStatus: () => {
        set((state) => ({ isOrderStatusOpen: !state.isOrderStatusOpen }));
      },

      openOrderStatus: () => {
        set({ isOrderStatusOpen: true });
      },

      closeOrderStatus: () => {
        set({ isOrderStatusOpen: false });
      },
    }),
    {
      name: `order-storage-${getTenantKey()}`,
      partialize: (state) => ({
        orders: state.orders,
        selectedOrderId: state.selectedOrderId,
        activeOrder: state.activeOrder,
      }),
    }
  )
);
