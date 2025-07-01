"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useOrderStore, ActiveOrder } from "@/zustand/useOrderStore";

export default function RealtimeCustomerOrdersListener() {
  const orders = useOrderStore((state) => state.orders);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  useEffect(() => {
    const orderIds = orders.map((o) => o.id);
    if (orderIds.length === 0) {
      return;
    }
    console.log(`Subscribing to updates for order IDs: ${orderIds.join(", ")}`);

    const channel = supabase
      .channel("customer-orders")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Order",
          filter: `id=in.(${orderIds.join(",")})`,
        },
        (payload) => {
          console.log("Order update received", payload);
          const updatedOrder = payload.new as {
            id: string;
            status: ActiveOrder["status"];
          };
          if (updatedOrder) {
            updateOrderStatus(updatedOrder.id, updatedOrder.status);
          }
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error("Supabase customer subscription error:", err);
        }
        console.log("Supabase customer subscription status:", status);
      });

    return () => {
      console.log("Unsubscribing from customer order updates");
      supabase.removeChannel(channel);
    };
  }, [orders, updateOrderStatus]);

  return null;
}
