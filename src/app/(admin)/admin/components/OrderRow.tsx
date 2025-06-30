"use client";

import { useState } from "react";
import { Prisma } from "../../../../generated/prisma";
import UpdateOrderStatus from "./UpdateOrderStatus";
import AcceptOrderButton from "./AcceptOrderButton";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        menuItem: true;
      };
    };
  };
}>;

// Create a new type for the order payload where Decimals are strings
type SerializableOrderItem = Omit<
  OrderWithItems["items"][0],
  "totalPrice" | "unitPrice" | "menuItem"
> & {
  totalPrice: string;
  unitPrice: string;
  menuItem: Omit<OrderWithItems["items"][0]["menuItem"], "price"> & {
    price: string;
  };
};

export type SerializableOrder = Omit<
  OrderWithItems,
  | "totalAmount"
  | "taxAmount"
  | "deliveryFee"
  | "items"
  | "createdAt"
  | "updatedAt"
> & {
  totalAmount: string;
  taxAmount: string;
  deliveryFee: string;
  items: SerializableOrderItem[];
  createdAt: string;
  updatedAt: string;
};

interface OrderRowProps {
  order: SerializableOrder;
}

export default function OrderRow({ order }: OrderRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr
        key={order.id}
        className="cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {order.orderNumber}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {order.customerName}
        </td>
        <td
          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
          suppressHydrationWarning
        >
          {new Date(order.createdAt).toLocaleString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${order.totalAmount}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {order.status === "PENDING" ? (
            <AcceptOrderButton orderId={order.id} />
          ) : (
            <UpdateOrderStatus
              orderId={order.id}
              currentStatus={order.status}
              orderType={order.orderType}
            />
          )}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={5} className="p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Order Items
                </h4>
                <ul className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-2">
                      <div className="flex justify-between">
                        <span>
                          {item.quantity}x {item.menuItem.name}
                        </span>
                        <span>${item.totalPrice}</span>
                      </div>
                      {item.specialInstructions && (
                        <p className="text-sm text-gray-500 mt-1">
                          <em>Note: {item.specialInstructions}</em>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer & Order Details */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Details</h4>
                <div className="text-sm space-y-2">
                  <p>
                    <strong>Customer:</strong> {order.customerName}
                  </p>
                  <p>
                    <strong>Contact:</strong> {order.customerEmail} /{" "}
                    {order.customerPhone}
                  </p>
                  <p>
                    <strong>Type:</strong> {order.orderType}
                  </p>
                  {order.orderType === "DELIVERY" && order.deliveryAddress && (
                    <p>
                      <strong>Address:</strong> {order.deliveryAddress}
                    </p>
                  )}
                  {order.orderInstructions && (
                    <p>
                      <strong>Notes:</strong> {order.orderInstructions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
