"use client";

import { useState } from "react";
import { useCartStore } from "@/zustand/useCartStore";

interface CheckoutModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutModal({
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const items = useCartStore((state) => state.items);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderType: "delivery" as "delivery" | "pickup",
    address: "",
    instructions: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement order submission
    console.log("Submitting order:", { formData, items, total });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Complete Your Order</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contact Info */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            {/* Order Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Order Type
              </label>
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="radio"
                    name="orderType"
                    value="delivery"
                    checked={formData.orderType === "delivery"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orderType: e.target.value as "delivery" | "pickup",
                      })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`p-3 border rounded-lg text-center cursor-pointer ${
                      formData.orderType === "delivery"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    Delivery
                  </div>
                </label>
                <label className="flex-1">
                  <input
                    type="radio"
                    name="orderType"
                    value="pickup"
                    checked={formData.orderType === "pickup"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orderType: e.target.value as "delivery" | "pickup",
                      })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`p-3 border rounded-lg text-center cursor-pointer ${
                      formData.orderType === "pickup"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    Pickup
                  </div>
                </label>
              </div>
            </div>

            {/* Address (for delivery) */}
            {formData.orderType === "delivery" && (
              <textarea
                placeholder="Delivery Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
                required
              />
            )}

            {/* Instructions */}
            <textarea
              placeholder="Special instructions for your order"
              value={formData.instructions}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              className="w-full p-3 border rounded-lg resize-none"
              rows={2}
            />

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
