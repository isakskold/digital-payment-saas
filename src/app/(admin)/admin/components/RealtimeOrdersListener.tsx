"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface RealtimeOrdersListenerProps {
  tenantId: string;
}

export default function RealtimeOrdersListener({
  tenantId,
}: RealtimeOrdersListenerProps) {
  const router = useRouter();

  useEffect(() => {
    console.log("Subscribing to realtime order updates");
    const channel = supabase
      .channel("public:Order")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Order",
          filter: `tenantId=eq.${tenantId}`,
        },
        (payload) => {
          console.log("postgres_changes event", payload);
          router.refresh();
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error("Supabase subscription error:", err);
        }
        console.log("Supabase subscription status:", status);
      });

    return () => {
      console.log("Unsubscribing from realtime order updates");
      supabase.removeChannel(channel);
    };
  }, [router, tenantId]);

  return null;
}
