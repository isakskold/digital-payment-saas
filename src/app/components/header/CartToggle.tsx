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
      className="relative flex items-center justify-center w-9 h-9 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 rounded-md shadow-sm transition-colors focus:outline-none"
      aria-label="Open cart"
    >
      <FiShoppingCart className="w-4 h-4" />
      {hasMounted && totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center border border-white">
          {totalItems}
        </span>
      )}
    </button>
  );
}
