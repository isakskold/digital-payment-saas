"use client";

import { useCartStore } from "@/zustand/useCartStore";
import { useOrderStore } from "@/zustand/useOrderStore";
import { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";

export default function CartIndicator() {
  const {
    totalItems,
    subtotal,
    toggleCart,
    isOpen: isCartOpen,
  } = useCartStore();
  const isOrderStatusOpen = useOrderStore((state) => state.isOrderStatusOpen);
  const [isFlashing, setIsFlashing] = useState(false);
  const [prevTotalItems, setPrevTotalItems] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  // Fix hydration mismatch by ensuring component only renders after client hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Flash effect when items are added
  useEffect(() => {
    if (totalItems > prevTotalItems && prevTotalItems > 0) {
      setIsFlashing(true);
      const timeout = setTimeout(() => setIsFlashing(false), 600);
      return () => clearTimeout(timeout);
    }
    setPrevTotalItems(totalItems);
  }, [totalItems, prevTotalItems]);

  // Don't render during server-side rendering, if cart is empty, or if any modal is open
  if (!isHydrated || totalItems === 0 || isCartOpen || isOrderStatusOpen)
    return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`
          bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg cursor-pointer
          transition-all duration-300 hover:bg-blue-700 hover:scale-105
          flex items-center space-x-3 min-w-[200px] justify-center
          ${isFlashing ? "animate-pulse bg-green-600" : ""}
        `}
        onClick={toggleCart}
      >
        <div className="relative">
          <FiShoppingCart className="h-5 w-5" />
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {totalItems}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {totalItems} artikel{totalItems !== 1 ? "ar" : ""}
          </span>
          <span className="text-xs opacity-90">
            {Math.round(subtotal)} SEK • Tryck för att visa
          </span>
        </div>
      </div>
    </div>
  );
}
