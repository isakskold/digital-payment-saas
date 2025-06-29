"use client";

import { useCartStore } from "@/zustand/useCartStore";

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

  const handleAdd = () => {
    addItem({ id, name, price, imageUrl });
  };

  return (
    <button
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
      onClick={handleAdd}
      type="button"
    >
      Add to cart
    </button>
  );
}
