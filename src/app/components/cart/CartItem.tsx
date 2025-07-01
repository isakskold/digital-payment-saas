"use client";

import { useState } from "react";
import { type CartItem as CartItemType } from "@/zustand/useCartStore";

// Simple SVG icons
const XIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const MinusIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 12H4"
    />
  </svg>
);

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateInstructions: (id: string, instructions: string) => void;
}

export default function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
  onUpdateInstructions,
}: CartItemProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex gap-3">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-md"
          />
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <button
              onClick={() => onRemove(item.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <XIcon />
            </button>
          </div>
          <p className="text-sm text-gray-600">{Math.round(item.price)} SEK</p>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              <MinusIcon />
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              <PlusIcon />
            </button>
          </div>

          {/* Special Instructions */}
          <div className="mt-2">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {item.specialInstructions
                ? "Redigera instruktioner"
                : "Lägg till instruktioner"}
            </button>
            {showInstructions && (
              <textarea
                value={item.specialInstructions || ""}
                onChange={(e) => onUpdateInstructions(item.id, e.target.value)}
                placeholder="Särskilda instruktioner (valfritt)"
                className="w-full mt-1 p-2 text-sm border rounded-md resize-none"
                rows={2}
              />
            )}
            {item.specialInstructions && !showInstructions && (
              <p className="text-sm text-gray-600 mt-1">
                "{item.specialInstructions}"
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
