"use client";

import { OrderStatus, OrderType } from "../../../../generated/prisma";
import { useState, useTransition } from "react";
import { updateOrderStatus } from "../../actions";

interface UpdateOrderStatusProps {
  orderId: string;
  currentStatus: OrderStatus;
  orderType: OrderType;
}

export default function UpdateOrderStatus({
  orderId,
  currentStatus,
  orderType,
}: UpdateOrderStatusProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as OrderStatus);
  };

  const handleUpdate = () => {
    startTransition(async () => {
      await updateOrderStatus(orderId, status);
    });
  };

  const allStatuses = Object.values(OrderStatus);

  const availableStatuses =
    orderType === "PICKUP"
      ? allStatuses.filter((s) => s !== "OUT_FOR_DELIVERY")
      : allStatuses.filter((s) => s !== "READY");

  return (
    <div className="flex items-center space-x-2">
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={isPending}
        onClick={(e) => e.stopPropagation()}
        className="p-1 border rounded hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        {availableStatuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleUpdate();
        }}
        disabled={isPending || status === currentStatus}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        {isPending ? "Updating..." : "Update"}
      </button>
    </div>
  );
}
