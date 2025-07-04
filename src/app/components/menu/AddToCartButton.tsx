"use client";

import { useCartStore } from "@/zustand/useCartStore";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

type AddToCartButtonProps = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
};

export default function AddToCartButton({
  id,
  name,
  price,
  imageUrl,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    addItem({ id, name, price, imageUrl });
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <button
      className={`
        py-1 px-3 rounded text-sm font-medium transition-all duration-200 flex items-center
        ${
          isAdding
            ? "bg-green-500 text-white scale-95"
            : "bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color)]/90"
        }
      `}
      onClick={handleAdd}
      type="button"
      disabled={isAdding}
    >
      <FiPlus className="mr-1" />
      {isAdding ? "Tillagd!" : "Lägg till"}
    </button>
  );
}
