"use client";

import { useCartStore } from "@/zustand/useCartStore";
import { FiShoppingCart } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function CartToggle() {
  const { totalItems, openCart } = useCartStore();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label="Open cart"
    >
      <FiShoppingCart className="w-7 h-7" />
      {hasMounted && totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
          {totalItems}
        </span>
      )}
    </button>
  );
}
