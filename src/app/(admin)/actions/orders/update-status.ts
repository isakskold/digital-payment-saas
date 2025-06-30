"use server";

import { db } from "@/lib/db";
import { OrderStatus } from "../../../../generated/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
) {
  try {
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
