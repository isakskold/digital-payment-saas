"use server";

import { db } from "@/lib/db";
import { OrderStatus } from "../../../../generated/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      select: { orderType: true },
    });

    if (!order) {
      return { success: false, message: "Order not found." };
    }

    const isPickupOrder = order.orderType === "PICKUP";

    if (isPickupOrder && newStatus === "OUT_FOR_DELIVERY") {
      return {
        success: false,
        message: "OUT_FOR_DELIVERY is not a valid status for PICKUP orders.",
      };
    }

    if (!isPickupOrder && newStatus === "READY") {
      return {
        success: false,
        message: "READY is not a valid status for DELIVERY orders.",
      };
    }

    await db.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, message: "Failed to update order status." };
  }
}
