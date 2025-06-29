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
      case "PREPARING":
        return "bg-orange-500";
      case "READY":
        return "bg-green-500";
      case "OUT_FOR_DELIVERY":
        return "bg-purple-500";
      case "DELIVERED":
        return "bg-green-600";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "CONFIRMED":
        return "Confirmed";
      case "PREPARING":
        return "Preparing";
      case "READY":
        return "Ready";
      case "OUT_FOR_DELIVERY":
        return "Out for Delivery";
      case "DELIVERED":
        return "Delivered";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <button
      onClick={toggleOrderStatus}
      className="relative flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-lg px-4 py-2 transition-colors"
    >
      {ordersCount > 1 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {ordersCount}
        </span>
      )}
      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${getStatusColor(
            activeOrder.status
          )}`}
        />
        <span className="font-medium text-gray-900">
          Order #{activeOrder.orderNumber}
        </span>
      </div>

      {/* Status text */}
      <span className="text-sm text-gray-600">
        {getStatusText(activeOrder.status)}
      </span>
    </button>
  );
}
