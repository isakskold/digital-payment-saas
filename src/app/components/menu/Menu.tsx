import { db } from "@/lib/db";
import { headers } from "next/headers";
import MenuItem from "./MenuItem";
import MenuTabs from "./MenuTabs";

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

  // Get category data for tabs
  const categories = menu.categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  return (
    <div className="space-y-4 md:space-y-6 pt-2">
      {/* Kategorier navigering med smooth scrolling */}
      <MenuTabs categories={categories} />

      {/* Menykategorier */}
      {menu.categories.map((category) => (
        <div
          key={category.id}
          className="category-section pt-3 md:pt-5 scroll-mt-[100px] md:scroll-mt-[115px]"
          id={category.id}
        >
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
              {category.name}
            </h3>

            {/* Menyalternativ */}
            <div className="space-y-3 md:space-y-4">
              {category.items.map((item) => (
                <MenuItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description || ""}
                  price={Number(item.price)}
                  imageUrl={item.imageUrl ?? undefined}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
