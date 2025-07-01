import { db } from "@/lib/db";
import { headers } from "next/headers";
import AddToCartButton from "./AddToCartButton";

async function getMenuData(tenantId: string) {
  const menu = await db.menu.findFirst({
    where: {
      tenantId,
      isActive: true,
      isDefault: true,
    },
    include: {
      categories: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: {
          items: {
            where: { isAvailable: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });

  return menu;
}

export default async function Menu() {
  const headersList = await headers();
  const subdomain = headersList.get("x-tenant-subdomain");

  if (!subdomain) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Kunde inte ladda meny</p>
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
        <p className="text-gray-600">Restaurangen hittades inte</p>
      </div>
    );
  }

  const menu = await getMenuData(tenant.id);

  if (!menu) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Meny ej tillgänglig</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Menu Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{menu.name}</h2>
        {menu.description && (
          <p className="text-gray-600">{menu.description}</p>
        )}
      </div>

      {/* Menu Categories */}
      {menu.categories.map((category) => (
        <div key={category.id} className="space-y-4">
          <div className="border-b border-gray-200 pb-2">
            <h3 className="text-2xl font-semibold text-gray-900">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-gray-600 mt-1">{category.description}</p>
            )}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                {item.imageUrl && (
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h4>
                    <span className="text-lg font-bold text-green-600">
                      {Math.round(Number(item.price))} SEK
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {item.description}
                    </p>
                  )}
                  <AddToCartButton
                    id={item.id}
                    name={item.name}
                    price={Number(item.price)}
                    imageUrl={item.imageUrl ?? undefined}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
