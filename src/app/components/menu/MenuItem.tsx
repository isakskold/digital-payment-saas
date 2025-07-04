"use client";

import { useState } from "react";
import { FiPlus, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useCartStore } from "@/zustand/useCartStore";

type MenuItemProps = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
};

export default function MenuItem({
  id,
  name,
  description,
  price,
  imageUrl,
}: MenuItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSize, setSelectedSize] = useState("medium");
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  // Sample size options
  const sizeOptions = [
    { id: "small", name: "Liten", price: price - 10 },
    { id: "medium", name: "Medium", price: price },
    { id: "large", name: "Stor", price: price + 15 },
  ];

  const handleAdd = () => {
    // Get the selected size price
    const selectedSizePrice =
      sizeOptions.find((size) => size.id === selectedSize)?.price || price;

    addItem({
      id,
      name: `${name} (${
        sizeOptions.find((size) => size.id === selectedSize)?.name || "Medium"
      })`,
      price: selectedSizePrice,
      imageUrl,
    });
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <div className="menu-item bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-sm transition-all duration-200">
      <div
        className="p-3 md:p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start gap-3 md:gap-4">
          <div className="flex-1">
            <h4 className="text-base md:text-lg font-semibold text-gray-900">
              {name}
            </h4>
            {description && (
              <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-1.5 line-clamp-2">
                {description}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className="text-base md:text-lg font-bold text-[var(--primary-color)]">
                {Math.round(price)} kr
              </span>
              {isExpanded ? (
                <FiChevronUp className="text-gray-400 h-4 w-4 md:h-5 md:w-5" />
              ) : (
                <FiChevronDown className="text-gray-400 h-4 w-4 md:h-5 md:w-5" />
              )}
            </div>
            {imageUrl && (
              <div className="mt-2 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-3 md:p-4 bg-gray-50">
          {/* Size Selection */}
          <div className="mb-3 md:mb-4">
            <h4 className="font-medium text-sm md:text-base text-gray-900 mb-2">
              Storlek
            </h4>
            <div className="space-y-2 md:space-y-3">
              {sizeOptions.map((size) => (
                <div
                  key={size.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <input
                      type="radio"
                      id={`${id}-${size.id}`}
                      name={`${id}-size`}
                      value={size.id}
                      checked={selectedSize === size.id}
                      onChange={() => setSelectedSize(size.id)}
                      className="text-[var(--primary-color)] focus:ring-[var(--primary-color)] h-3 w-3 md:h-4 md:w-4"
                    />
                    <label
                      htmlFor={`${id}-${size.id}`}
                      className="text-xs md:text-sm font-medium cursor-pointer"
                    >
                      {size.name}
                    </label>
                  </div>
                  <span className="text-xs md:text-sm text-gray-600">
                    {size.price} kr
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <span className="font-medium text-sm md:text-base text-gray-900">
                Totalt:
              </span>
              <span className="text-base md:text-lg font-bold text-[var(--primary-color)]">
                {sizeOptions.find((size) => size.id === selectedSize)?.price ||
                  price}
                kr
              </span>
            </div>
            <button
              className={`
                w-full py-1.5 md:py-2 px-4 rounded text-sm md:text-base font-medium transition-all duration-200 flex items-center justify-center
                ${
                  isAdding
                    ? "bg-green-500 text-white scale-95"
                    : "bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color)]/90"
                }
              `}
              onClick={(e) => {
                e.stopPropagation();
                handleAdd();
              }}
              type="button"
              disabled={isAdding}
            >
              <FiPlus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
              {isAdding ? "Tillagd!" : "Lägg i varukorg"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
