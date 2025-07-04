"use client";

import { useOrderStore } from "@/zustand/useOrderStore";

export default function OrderStatusToggle() {
  const activeOrder = useOrderStore((state) => state.activeOrder);
  const ordersCount = useOrderStore((state) => state.orders.length);
  const toggleOrderStatus = useOrderStore((state) => state.toggleOrderStatus);

  // Only render if there's an active order
  if (!activeOrder) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "CONFIRMED":
        return "bg-blue-500";
      case "READY":
        return "bg-green-500";
      case "OUT_FOR_DELIVERY":
        return "bg-purple-500";
      case "CANCELLED":
        return "bg-red-500";
      case "COMPLETED":
        return "bg-green-600";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Väntar";
      case "CONFIRMED":
        return "Bekräftad";
      case "READY":
        return "Redo";
      case "OUT_FOR_DELIVERY":
        return "Levereras";
      case "CANCELLED":
        return "Avbruten";
      case "COMPLETED":
        return "Klar";
      default:
        return status;
    }
  };

  return (
    <button
      onClick={toggleOrderStatus}
      className="relative flex items-center gap-1.5 bg-white border border-gray-300 hover:border-gray-400 rounded-md px-2.5 py-1.5 transition-colors shadow-sm text-xs"
    >
      {ordersCount > 1 && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
          {ordersCount}
        </span>
      )}
      {/* Status indicator */}
      <div
        className={`w-2 h-2 rounded-full ${getStatusColor(activeOrder.status)}`}
      />
      <span className="font-medium text-gray-900">
        #{activeOrder.orderNumber}
      </span>

      {/* Status text */}
      <span className="text-gray-600">{getStatusText(activeOrder.status)}</span>
    </button>
  );
}
