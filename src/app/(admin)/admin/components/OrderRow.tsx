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
  isMobile?: boolean;
}

export default function OrderRow({ order, isMobile = false }: OrderRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mobile Card Layout
  if (isMobile) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">
                  #{order.orderNumber}
                </h3>
                <span className="text-sm text-gray-500">
                  {order.customerName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">
                  {Math.round(Number(order.totalAmount))} SEK
                </span>
                <span
                  className="text-xs text-gray-500"
                  suppressHydrationWarning
                >
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {isExpanded ? "Dölj detaljer" : "Visa detaljer"}
          </button>

          <div className="flex-shrink-0">
            {order.status === "PENDING" ? (
              <AcceptOrderButton orderId={order.id} />
            ) : (
              <UpdateOrderStatus
                orderId={order.id}
                currentStatus={order.status}
                orderType={order.orderType}
              />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-4">
              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Beställda artiklar
                </h4>
                <ul className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-2">
                      <div className="flex justify-between">
                        <span className="text-sm">
                          {item.quantity}x {item.menuItem.name}
                        </span>
                        <span className="text-sm font-medium">
                          {Math.round(Number(item.totalPrice))} SEK
                        </span>
                      </div>
                      {item.specialInstructions && (
                        <p className="text-xs text-gray-500 mt-1">
                          <em>Notering: {item.specialInstructions}</em>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer & Order Details */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Detaljer</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Kund:</strong> {order.customerName}
                  </p>
                  <p>
                    <strong>Kontakt:</strong> {order.customerEmail} /{" "}
                    {order.customerPhone}
                  </p>
                  <p>
                    <strong>Typ:</strong>{" "}
                    {order.orderType === "DELIVERY"
                      ? "Hemleverans"
                      : "Avhämtning"}
                  </p>
                  {order.orderType === "DELIVERY" && order.deliveryAddress && (
                    <p>
                      <strong>Adress:</strong> {order.deliveryAddress}
                    </p>
                  )}
                  {order.orderInstructions && (
                    <p>
                      <strong>Anteckningar:</strong> {order.orderInstructions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop Table Layout
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
          {Math.round(Number(order.totalAmount))} SEK
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
                  Beställda artiklar
                </h4>
                <ul className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-2">
                      <div className="flex justify-between">
                        <span>
                          {item.quantity}x {item.menuItem.name}
                        </span>
                        <span>{Math.round(Number(item.totalPrice))} SEK</span>
                      </div>
                      {item.specialInstructions && (
                        <p className="text-sm text-gray-500 mt-1">
                          <em>Notering: {item.specialInstructions}</em>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer & Order Details */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Detaljer</h4>
                <div className="text-sm space-y-2">
                  <p>
                    <strong>Kund:</strong> {order.customerName}
                  </p>
                  <p>
                    <strong>Kontakt:</strong> {order.customerEmail} /{" "}
                    {order.customerPhone}
                  </p>
                  <p>
                    <strong>Typ:</strong>{" "}
                    {order.orderType === "DELIVERY"
                      ? "Hemleverans"
                      : "Avhämtning"}
                  </p>
                  {order.orderType === "DELIVERY" && order.deliveryAddress && (
                    <p>
                      <strong>Adress:</strong> {order.deliveryAddress}
                    </p>
                  )}
                  {order.orderInstructions && (
                    <p>
                      <strong>Anteckningar:</strong> {order.orderInstructions}
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
