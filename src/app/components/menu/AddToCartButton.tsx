"use client";

import { useCartStore } from "@/zustand/useCartStore";
import { useState } from "react";

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
        w-full py-2 px-4 rounded-md font-medium transition-all duration-200
        ${
          isAdding
            ? "bg-green-500 text-white scale-95"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }
      `}
      onClick={handleAdd}
      type="button"
      disabled={isAdding}
    >
      {isAdding ? "Tillagd!" : "Lägg i varukorg"}
    </button>
  );
}
