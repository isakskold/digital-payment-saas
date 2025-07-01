import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create test tenants
  const tenants = await Promise.all([
    prisma.tenant.create({
      data: {
        name: "marios-pizza",
        subdomain: "marios",
        displayName: "Marios Pizzeria",
        isActive: true,
      },
    }),
    prisma.tenant.create({
      data: {
        name: "express-pizza",
        subdomain: "express",
        displayName: "Express Pizzeria",
        isActive: true,
      },
    }),
    prisma.tenant.create({
      data: {
        name: "gustavs-pizzeria",
        subdomain: "gustavs",
        domain: "gustavspizza.se", // Premium tenant with custom domain
        displayName: "Gustavs Pizzeria",
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${tenants.length} tenants:`);
  tenants.forEach((tenant) => {
    console.log(
      `  - ${tenant.displayName} (${tenant.subdomain}.yourplatform.com)`
    );
    if (tenant.domain) {
      console.log(`    Custom domain: ${tenant.domain}`);
    }
  });

  // Create menus for each tenant
  for (const tenant of tenants) {
    console.log(`\n🍕 Creating menu for ${tenant.displayName}...`);

    // Create default menu
    const menu = await prisma.menu.create({
      data: {
        tenantId: tenant.id,
        name: "Huvudmeny",
        description: "Vårt utsökta utbud av pizzor och mer",
        isDefault: true,
        isActive: true,
        sortOrder: 1,
      },
    });

    // Create categories
    const categories = await Promise.all([
      prisma.menuCategory.create({
        data: {
          menuId: menu.id,
          name: "Pizzor",
          description: "Nybakade pizzor med förstklassiga toppings",
          sortOrder: 1,
          isActive: true,
        },
      }),
      prisma.menuCategory.create({
        data: {
          menuId: menu.id,
          name: "Drycker",
          description: "Uppfriskande drycker",
          sortOrder: 2,
          isActive: true,
        },
      }),
      prisma.menuCategory.create({
        data: {
          menuId: menu.id,
          name: "Tillbehör",
          description: "Perfekta komplement",
          sortOrder: 3,
          isActive: true,
        },
      }),
    ]);

    // Create menu items based on restaurant
    if (tenant.subdomain === "marios") {
      // Mario's Pizza - Classic Italian
      await Promise.all([
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[0].id, // Pizzas
            name: "Margherita",
            description: "Färsk mozzarella, tomatsås, basilika",
            price: 129,
            isAvailable: true,
            sortOrder: 1,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[0].id,
            name: "Pepperoni",
            description: "Stark pepperoni med smält ost",
            price: 149,
            isAvailable: true,
            sortOrder: 2,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[0].id,
            name: "Quattro Stagioni",
            description:
              "Fyra årstider: skinka, champinjoner, kronärtskocka, oliver",
            price: 169,
            isAvailable: true,
            sortOrder: 3,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[1].id, // Drinks
            name: "Coca-Cola",
            description: "Klassisk cola, 33cl",
            price: 29,
            isAvailable: true,
            sortOrder: 1,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[2].id, // Sides
            name: "Vitlöksbröd",
            description: "Färskt vitlöksbröd med örter",
            price: 49,
            isAvailable: true,
            sortOrder: 1,
          },
        }),
      ]);
    } else if (tenant.subdomain === "express") {
      // Pizza Express - Modern & Quick
      await Promise.all([
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[0].id,
            name: "BBQ Kyckling",
            description: "BBQ-sås, kyckling, rödlök, mozzarella",
            price: 159,
            isAvailable: true,
            sortOrder: 1,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[0].id,
            name: "Vegetarisk Special",
            description: "Paprika, champinjoner, lök, oliver, tomater",
            price: 139,
            isAvailable: true,
            sortOrder: 2,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[0].id,
            name: "Hawaii",
            description: "Skinka och ananas - älska eller hata den!",
            price: 149,
            isAvailable: true,
            sortOrder: 3,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[1].id,
            name: "Lemonad",
            description: "Färskpressad lemonad",
            price: 39,
            isAvailable: true,
            sortOrder: 1,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[2].id,
            name: "Kycklingvingar",
            description: "6 krispiga vingar med valfri sås",
            price: 89,
            isAvailable: true,
            sortOrder: 1,
          },
        }),
      ]);
    } else if (tenant.subdomain === "gustavs") {
      // Gustav's Pizzeria - Premium & Gourmet
      await Promise.all([
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[0].id,
            name: "Tryffelvego",
            description: "Vilda svampar, tryffelolja, lagrad parmesan",
            price: 229,
            isAvailable: true,
            sortOrder: 1,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[0].id,
            name: "Prosciutto e Rucola",
            description: "Parmaskinka, ruccola, hyvlad parmesan",
            price: 249,
            isAvailable: true,
            sortOrder: 2,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[0].id,
            name: "Havets Läckerheter",
            description: "Räkor, bläckfisk, musslor i vitvinssås",
            price: 269,
            isAvailable: true,
            sortOrder: 3,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[1].id,
            name: "Hantverksöl",
            description: "Lokalt bryggda ölsorter",
            price: 69,
            isAvailable: true,
            sortOrder: 1,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[2].id,
            name: "Burrata Caprese",
            description: "Färsk burrata, säsongens tomater, basilika",
            price: 129,
            isAvailable: true,
            sortOrder: 1,
          },
        }),
      ]);
    }

    console.log(`  ✅ Created menu with categories and items`);
  }

  console.log("\n🎉 Seeding completed!");
  console.log("\n📊 Summary:");
  console.log(`  - ${tenants.length} restaurants created`);
  console.log(`  - ${tenants.length} menus created`);
  console.log(`  - ${tenants.length * 3} categories created`);
  console.log(`  - ${tenants.length * 5} menu items created`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
