"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function confirmOrder(orderId: string) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { success: false, message: "Order not found." };
    }

    if (order.status !== "PENDING") {
      return {
        success: false,
        message: "Order has already been handled.",
      };
    }

    await db.order.update({
      where: { id: orderId },
      data: { status: "CONFIRMED" },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to confirm order:", error);
    return { success: false, message: "Failed to confirm order." };
  }
}
