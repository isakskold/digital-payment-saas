import { NextRequest, NextResponse } from "next/server";
import { getCurrentTenant } from "@/lib/tenant";
import { db } from "@/lib/db";

interface OrderSubmissionData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: "PICKUP" | "DELIVERY";
  deliveryAddress?: string;
  orderInstructions?: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const tenant = await getCurrentTenant();
    const data: OrderSubmissionData = await request.json();

    // Validate required fields
    if (!data.customerName || !data.customerEmail || !data.customerPhone) {
      return NextResponse.json(
        { error: "Missing required customer information" },
        { status: 400 }
      );
    }

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    if (data.orderType === "DELIVERY" && !data.deliveryAddress) {
      return NextResponse.json(
        { error: "Delivery address is required for delivery orders" },
        { status: 400 }
      );
    }

    // Fetch menu items to validate and calculate prices
    const menuItemIds = data.items.map((item) => item.menuItemId);
    const menuItems = await db.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        isAvailable: true,
        menu: {
          tenantId: tenant.id,
          isActive: true,
        },
      },
    });

    // Validate all items exist and are available
    if (menuItems.length !== menuItemIds.length) {
      return NextResponse.json(
        { error: "Some menu items are not available" },
        { status: 400 }
      );
    }

    // Calculate total amount server-side
    let totalAmount = 0;
    const orderItems = data.items.map((item) => {
      const menuItem = menuItems.find((mi) => mi.id === item.menuItemId);
      if (!menuItem) {
        throw new Error(`Menu item ${item.menuItemId} not found`);
      }

      const itemTotal = Number(menuItem.price) * item.quantity;
      totalAmount += itemTotal;

      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: menuItem.price,
        totalPrice: itemTotal,
        specialInstructions: item.specialInstructions || null,
      };
    });

    // Generate order number
    const orderCount = await db.order.count({
      where: { tenantId: tenant.id },
    });
    const orderNumber = `${tenant.subdomain.toUpperCase()}-${String(
      orderCount + 1
    ).padStart(3, "0")}`;

    // Create order with items
    const order = await db.order.create({
      data: {
        tenantId: tenant.id,
        orderNumber,
        orderType: data.orderType,
        status: "PENDING",
        totalAmount,
        taxAmount: 0, // No tax for now
        deliveryFee: 0, // No delivery fee for now
        deliveryAddress:
          data.orderType === "DELIVERY" ? data.deliveryAddress : null,
        orderInstructions: data.orderInstructions || null,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        orderType: order.orderType,
        estimatedTime:
          data.orderType === "PICKUP" ? "15-20 minutes" : "30-45 minutes",
      },
    });
  } catch (error) {
    console.error("Order submission error:", error);

    if (error instanceof Error && error.message.includes("Tenant not found")) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit order. Please try again." },
      { status: 500 }
    );
  }
}
