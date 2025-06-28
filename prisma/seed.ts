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
        displayName: "Mario's Pizza",
        isActive: true,
      },
    }),
    prisma.tenant.create({
      data: {
        name: "pizza-express",
        subdomain: "express",
        displayName: "Pizza Express",
        isActive: true,
      },
    }),
    prisma.tenant.create({
      data: {
        name: "gustavs-pizzeria",
        subdomain: "gustavs",
        domain: "gustavspizza.se", // Premium tenant with custom domain
        displayName: "Gustav's Pizzeria",
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
        name: "Main Menu",
        description: "Our delicious selection of pizzas and more",
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
          name: "Pizzas",
          description: "Fresh-baked pizzas with premium toppings",
          sortOrder: 1,
          isActive: true,
        },
      }),
      prisma.menuCategory.create({
        data: {
          menuId: menu.id,
          name: "Drinks",
          description: "Refreshing beverages",
          sortOrder: 2,
          isActive: true,
        },
      }),
      prisma.menuCategory.create({
        data: {
          menuId: menu.id,
          name: "Sides",
          description: "Perfect accompaniments",
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
            description: "Fresh mozzarella, tomato sauce, basil",
            price: 12.99,
            isAvailable: true,
            sortOrder: 1,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[0].id,
            name: "Pepperoni",
            description: "Spicy pepperoni with melted cheese",
            price: 14.99,
            isAvailable: true,
            sortOrder: 2,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[0].id,
            name: "Quattro Stagioni",
            description: "Four seasons: ham, mushrooms, artichokes, olives",
            price: 16.99,
            isAvailable: true,
            sortOrder: 3,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[1].id, // Drinks
            name: "Coca-Cola",
            description: "Classic cola, 330ml",
            price: 2.99,
            isAvailable: true,
            sortOrder: 1,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[2].id, // Sides
            name: "Garlic Bread",
            description: "Fresh garlic bread with herbs",
            price: 4.99,
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
            name: "BBQ Chicken",
            description: "BBQ sauce, chicken, red onions, mozzarella",
            price: 15.99,
            isAvailable: true,
            sortOrder: 1,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[0].id,
            name: "Veggie Supreme",
            description: "Bell peppers, mushrooms, onions, olives, tomatoes",
            price: 13.99,
            isAvailable: true,
            sortOrder: 2,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[0].id,
            name: "Hawaiian",
            description: "Ham and pineapple - love it or hate it!",
            price: 14.99,
            isAvailable: true,
            sortOrder: 3,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[1].id,
            name: "Lemonade",
            description: "Fresh squeezed lemonade",
            price: 3.99,
            isAvailable: true,
            sortOrder: 1,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[2].id,
            name: "Chicken Wings",
            description: "6 crispy wings with your choice of sauce",
            price: 8.99,
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
            name: "Truffle Mushroom",
            description: "Wild mushrooms, truffle oil, aged parmesan",
            price: 22.99,
            isAvailable: true,
            sortOrder: 1,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[0].id,
            name: "Prosciutto e Rucola",
            description: "Prosciutto di Parma, arugula, shaved parmesan",
            price: 24.99,
            isAvailable: true,
            sortOrder: 2,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[0].id,
            name: "Seafood Delight",
            description: "Shrimp, calamari, mussels in white wine sauce",
            price: 26.99,
            isAvailable: true,
            sortOrder: 3,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[1].id,
            name: "Craft Beer",
            description: "Local craft beer selection",
            price: 6.99,
            isAvailable: true,
            sortOrder: 1,
          },
        }),
        prisma.menuItem.create({
          data: {
            menuId: menu.id,
            categoryId: categories[2].id,
            name: "Burrata Caprese",
            description: "Fresh burrata, heirloom tomatoes, basil",
            price: 12.99,
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
