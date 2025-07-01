"use client";

import { useState } from "react";
import { useCartStore } from "@/zustand/useCartStore";
import { useOrderStore, ActiveOrder } from "@/zustand/useOrderStore";

interface CheckoutModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutModal({
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const items = useCartStore((state) => state.items);
  const addOrder = useOrderStore((state) => state.addOrder);
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const orderData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        orderType: formData.orderType.toUpperCase() as "PICKUP" | "DELIVERY",
        deliveryAddress:
          formData.orderType === "delivery" ? formData.address : undefined,
        orderInstructions: formData.instructions || undefined,
        items: items.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || undefined,
        })),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit order");
      }

      // Create order object for the store
      const activeOrder: ActiveOrder = {
        id: result.order.id,
        orderNumber: result.order.orderNumber,
        status: result.order.status,
        totalAmount: Number(result.order.totalAmount),
        orderType: result.order.orderType,
        estimatedTime: result.order.estimatedTime,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        deliveryAddress:
          formData.orderType === "delivery" ? formData.address : undefined,
        orderInstructions: formData.instructions || undefined,
        createdAt: new Date().toISOString(),
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unitPrice: Number(item.price),
          totalPrice: Number(item.price) * item.quantity,
          specialInstructions: item.specialInstructions,
        })),
      };

      // Save order to store and clear cart
      addOrder(activeOrder);
      useCartStore.getState().clearCart();
      onSuccess();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Kunde inte skicka beställningen"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Slutför din beställning
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contact Info */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Ditt namn"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="E-post"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="tel"
                placeholder="Telefon"
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
                Beställningstyp
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
                    Hemleverans
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
                    Avhämtning
                  </div>
                </label>
              </div>
            </div>

            {/* Address (for delivery) */}
            {formData.orderType === "delivery" && (
              <textarea
                placeholder="Leveransadress"
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
              placeholder="Särskilda instruktioner för din beställning"
              value={formData.instructions}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              className="w-full p-3 border rounded-lg resize-none"
              rows={2}
            />

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Totalt</span>
                <span>{Math.round(total)} SEK</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Avbryt
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {isSubmitting ? "Skickar..." : "Skicka beställning"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
