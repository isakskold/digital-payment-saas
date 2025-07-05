import { db } from "@/lib/db";
import { headers } from "next/headers";
import OrderTable from "./components/OrderTable";
import RealtimeOrdersListener from "./components/RealtimeOrdersListener";
import AdminNavigation from "./components/AdminNavigation";

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
        <p className="text-gray-600">Kund kunde inte identifieras</p>
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
        <p className="text-gray-600">Restaurang hittades inte</p>
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
    (order) =>
      order.orderType === "DELIVERY" &&
      order.status !== "PENDING" &&
      order.status !== "COMPLETED"
  );
  const pickupOrders = serializableOrders.filter(
    (order) =>
      order.orderType === "PICKUP" &&
      order.status !== "PENDING" &&
      order.status !== "COMPLETED"
  );
  const completedOrders = serializableOrders.filter(
    (order) => order.status === "COMPLETED"
  );

  // Create categories for navigation
  const categories = [
    {
      id: "nya-bestallningar",
      name: "Nya beställningar",
      count: pendingOrders.length,
    },
    {
      id: "hemleverans",
      name: "Hemleverans",
      count: deliveryOrders.length,
    },
    {
      id: "avhamtning",
      name: "Avhämtning",
      count: pickupOrders.length,
    },
    {
      id: "slutforda-bestallningar",
      name: "Slutförda beställningar",
      count: completedOrders.length,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Realtime listener for new incoming orders */}
      <RealtimeOrdersListener tenantId={tenant.id} />

      {/* Admin Navigation */}
      <AdminNavigation categories={categories} />

      {/* Main Content */}
      <div className="container mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Beställningar</h1>
          <div className="text-base sm:text-lg">
            <span className="font-semibold">{tenant.displayName}</span>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div id="nya-bestallningar" className="scroll-mt-20">
            <OrderTable title="Nya beställningar" orders={pendingOrders} />
          </div>
          <div id="hemleverans" className="scroll-mt-20">
            <OrderTable title="Hemleverans" orders={deliveryOrders} />
          </div>
          <div id="avhamtning" className="scroll-mt-20">
            <OrderTable title="Avhämtning" orders={pickupOrders} />
          </div>
          <div id="slutforda-bestallningar" className="scroll-mt-20">
            <OrderTable
              title="Slutförda beställningar"
              orders={completedOrders}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
