"use client";

import { useOrderStore } from "@/zustand/useOrderStore";
import RealtimeCustomerOrdersListener from "./RealtimeCustomerOrdersListener";

export default function OrderStatusModal() {
  const activeOrder = useOrderStore((state) => state.activeOrder);
  const orders = useOrderStore((state) => state.orders);
  const selectOrder = useOrderStore((state) => state.selectOrder);
  const isOrderStatusOpen = useOrderStore((state) => state.isOrderStatusOpen);
  const closeOrderStatus = useOrderStore((state) => state.closeOrderStatus);
  const clearActiveOrder = useOrderStore((state) => state.clearActiveOrder);

  if (!isOrderStatusOpen || !activeOrder) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "CONFIRMED":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "READY":
        return "text-green-600 bg-green-50 border-green-200";
      case "OUT_FOR_DELIVERY":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "CANCELLED":
        return "text-red-600 bg-red-50 border-red-200";
      case "COMPLETED":
        return "text-green-700 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Beställning mottagen";
      case "CONFIRMED":
        return "Bekräftad & tillagas";
      case "READY":
        return "Klar för avhämtning";
      case "OUT_FOR_DELIVERY":
        return "Levereras";
      case "CANCELLED":
        return "Avbruten";
      case "COMPLETED":
        return "Slutförd";
      default:
        return status;
    }
  };

  const getProgressSteps = () => {
    const steps =
      activeOrder.orderType === "DELIVERY"
        ? ["PENDING", "CONFIRMED", "OUT_FOR_DELIVERY", "COMPLETED"]
        : ["PENDING", "CONFIRMED", "READY", "COMPLETED"];

    const currentIndex = steps.indexOf(activeOrder.status);

    return steps.map((step, index) => ({
      status: step,
      label: getStatusText(step),
      isActive: index <= currentIndex,
      isCurrent: step === activeOrder.status,
    }));
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const isCompleted =
    activeOrder.status === "COMPLETED" || activeOrder.status === "CANCELLED";

  return (
    <>
      <RealtimeCustomerOrdersListener />
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Beställning #{activeOrder.orderNumber}
                </h2>
                <p className="text-gray-600 mt-1">
                  Beställd {formatDateTime(activeOrder.createdAt)}
                </p>
              </div>
              <button
                onClick={closeOrderStatus}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Order navigation if multiple orders */}
            {orders.length > 1 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => selectOrder(order.id)}
                    className={`px-3 py-1 rounded-lg text-sm border transition-colors ${
                      order.id === activeOrder.id
                        ? "bg-blue-600 text-white border-blue-700"
                        : "bg-white border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    #{order.orderNumber}
                  </button>
                ))}
              </div>
            )}

            {/* Current Status */}
            <div
              className={`p-4 rounded-lg border mb-6 ${getStatusColor(
                activeOrder.status
              )}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {getStatusText(activeOrder.status)}
                  </h3>
                  <p className="text-sm opacity-80">
                    Beräknad tid: {activeOrder.estimatedTime}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {activeOrder.orderType === "DELIVERY"
                      ? "Hemleverans"
                      : "Avhämtning"}
                  </p>
                  <p className="text-sm opacity-80">
                    {Math.round(Number(activeOrder.totalAmount))} SEK
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            {!isCompleted && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-4">
                  Beställningsstatus
                </h4>
                <div className="flex items-center justify-between relative">
                  {/* Background lines */}
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
                  {getProgressSteps().map((step, index) => (
                    <div
                      key={step.status}
                      className="flex flex-col items-center flex-1 relative z-10"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step.isActive
                            ? step.isCurrent
                              ? "bg-blue-600 text-white"
                              : "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step.isActive && !step.isCurrent ? "✓" : index + 1}
                      </div>
                      <p
                        className={`text-xs mt-2 text-center ${
                          step.isActive ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  ))}
                  {/* Active progress line */}
                  <div
                    className="absolute top-4 left-0 h-0.5 bg-green-500 transition-all duration-300"
                    style={{
                      width: `${
                        (getProgressSteps().findIndex(
                          (step) => step.status === activeOrder.status
                        ) /
                          (getProgressSteps().length - 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Order Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                Beställningsinformation
              </h4>

              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium mb-2">Kundinformation</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Namn:</strong> {activeOrder.customerName}
                  </p>
                  <p>
                    <strong>E-post:</strong> {activeOrder.customerEmail}
                  </p>
                  <p>
                    <strong>Telefon:</strong> {activeOrder.customerPhone}
                  </p>
                  {activeOrder.deliveryAddress && (
                    <p>
                      <strong>Leveransadress:</strong>{" "}
                      {activeOrder.deliveryAddress}
                    </p>
                  )}
                  {activeOrder.orderInstructions && (
                    <p>
                      <strong>Instruktioner:</strong>{" "}
                      {activeOrder.orderInstructions}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h5 className="font-medium mb-3">Beställda artiklar</h5>
                <div className="space-y-2">
                  {activeOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Antal: {item.quantity} ×{" "}
                          {Math.round(Number(item.unitPrice))} SEK
                        </p>
                        {item.specialInstructions && (
                          <p className="text-sm text-gray-500 italic">
                            Notering: {item.specialInstructions}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {Math.round(Number(item.totalPrice))} SEK
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-lg">
                  {Math.round(Number(activeOrder.totalAmount))} SEK
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeOrderStatus}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Stäng
              </button>
              {isCompleted && (
                <button
                  onClick={clearActiveOrder}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Clear Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
