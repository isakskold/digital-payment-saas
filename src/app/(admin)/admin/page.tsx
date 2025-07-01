import { db } from "@/lib/db";
import { headers } from "next/headers";
import OrderTable from "./components/OrderTable";
import RealtimeOrdersListener from "./components/RealtimeOrdersListener";

async function getOrdersData(tenantId: string) {
  const orders = await db.order.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
  });
  return orders;
}

export default async function AdminPage() {
  const headersList = await headers();
  const subdomain = headersList.get("x-tenant-subdomain");

  if (!subdomain) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Tenant not identified</p>
      </div>
    );
  }

  const tenant = await db.tenant.findFirst({
    where: {
      OR: [{ subdomain }, { domain: subdomain }],
    },
  });

  if (!tenant) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Restaurant not found</p>
      </div>
    );
  }

  const orders = await getOrdersData(tenant.id);

  const serializableOrders = orders.map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    totalAmount: order.totalAmount.toFixed(2),
    taxAmount: order.taxAmount.toFixed(2),
    deliveryFee: order.deliveryFee.toFixed(2),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: item.unitPrice.toFixed(2),
      totalPrice: item.totalPrice.toFixed(2),
      menuItem: {
        ...item.menuItem,
        price: item.menuItem.price.toFixed(2),
      },
    })),
  }));

  const pendingOrders = serializableOrders.filter(
    (order) => order.status === "PENDING"
  );
  const deliveryOrders = serializableOrders.filter(
    (order) => order.orderType === "DELIVERY" && order.status !== "PENDING"
  );
  const pickupOrders = serializableOrders.filter(
    (order) => order.orderType === "PICKUP" && order.status !== "PENDING"
  );

  return (
    <div className="container mx-auto p-6">
      {/* Realtime listener for new incoming orders */}
      <RealtimeOrdersListener tenantId={tenant.id} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="text-lg">
          <span className="font-semibold">{tenant.displayName}</span>
        </div>
      </div>

      <div className="space-y-8">
        <OrderTable title="New Orders" orders={pendingOrders} />
        <OrderTable title="Delivery" orders={deliveryOrders} />
        <OrderTable title="Pickup" orders={pickupOrders} />
      </div>
    </div>
  );
}
