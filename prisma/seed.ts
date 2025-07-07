import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create new tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: "pizzeria-restaurang",
      subdomain: "milano",
      displayName: "Pizzeria Restaurang",
      isActive: true,
    },
  });

  console.log(
    `✅ Created tenant: ${tenant.displayName} (${tenant.subdomain}.yourplatform.com)`
  );

  // Create menu for the new tenant
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
        name: "Pizza Klass 1",
        description: "TOMATSÅS OCH OST INGÅR I ALLA PIZZOR",
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Pizza Klass 2",
        description: "TOMATSÅS OCH OST INGÅR I ALLA PIZZOR",
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Pizza Klass 3",
        description: "TOMATSÅS OCH OST INGÅR I ALLA PIZZOR",
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Pizza Klass 4",
        description: "TOMATSÅS OCH OST INGÅR I ALLA PIZZOR",
        sortOrder: 4,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Vegetariska Pizzor",
        description: "Vegetariska pizzor med tomatsås och ost",
        sortOrder: 5,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Kycklingpizzor",
        description: "Utsökta pizzor med kyckling",
        sortOrder: 6,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Specialpizzor",
        description: "Till alla pizzor ingår bearnaisesås",
        sortOrder: 7,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Kebabpizzor",
        description:
          "Till alla kebabpizzor ingår valfri sås. Välj mellan nötkött och gyros",
        sortOrder: 8,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Förrätter",
        description: "Goda förrätter",
        sortOrder: 9,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Kötträtter",
        description:
          "Serveras med stekt potatis, pommes frites eller klyftpotatis",
        sortOrder: 10,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Tillbehör",
        description: "Extra tillbehör",
        sortOrder: 11,
        isActive: true,
      },
    }),
  ]);

  // Pizza Klass 1
  const pizzaKlass1 = [
    { name: "Margherita", description: "Tomatsås, ost", price: 105 },
    {
      name: "Al Fungi",
      description: "Tomatsås, ost, champinjoner",
      price: 105,
    },
    { name: "Vesuvio", description: "Tomatsås, ost, skinka", price: 105 },
    {
      name: "Capricciosa",
      description: "Tomatsås, ost, skinka, champinjoner",
      price: 105,
    },
    {
      name: "Bolognese",
      description: "Tomatsås, ost, köttfärssås",
      price: 105,
    },
    { name: "Salami", description: "Tomatsås, ost, salami", price: 105 },
  ];

  // Pizza Klass 2
  const pizzaKlass2 = [
    {
      name: "Calzone",
      description: "Tomatsås, ost, skinka (inbakad)",
      price: 110,
    },
    {
      name: "Hawaii",
      description: "Tomatsås, ost, skinka, ananas",
      price: 110,
    },
    {
      name: "Bussola",
      description: "Tomatsås, ost, skinka, räkor",
      price: 110,
    },
    {
      name: "Al tunno",
      description: "Tomatsås, ost, tonfisk, lök",
      price: 110,
    },
    {
      name: "Marinara",
      description: "Tomatsås, ost, räkor, musslor, lök",
      price: 110,
    },
  ];

  // Pizza Klass 3
  const pizzaKlass3 = [
    {
      name: "Pazza",
      description: "Tomatsås, ost, skinka, räkor, champinjoner",
      price: 115,
    },
    {
      name: "Calzone Special",
      description: "Tomatsås, ost, skinka, räkor, champinjoner (inbakad)",
      price: 115,
    },
    {
      name: "Riva",
      description: "Tomatsås, ost, skinka, räkor, ananas",
      price: 115,
    },
    {
      name: "Mexico",
      description: "Tomatsås, ost, köttfärs, lök, tabasco",
      price: 115,
    },
    {
      name: "Indiana",
      description: "Tomatsås, ost, ananas, banan, curry, bacon",
      price: 115,
    },
  ];

  // Pizza Klass 4
  const pizzaKlass4 = [
    {
      name: "Quattro Stagioni",
      description:
        "Tomatsås, ost, skinka, champinjoner, räkor, musslor, oliver, kronärtskocka",
      price: 120,
    },
    {
      name: "Kebab",
      description: "Tomatsås, ost, kebabkött, lök, champinjoner, tomater",
      price: 120,
    },
    {
      name: "Viking",
      description: "Tomatsås, ost, skinka, oxfilé, champinjoner, bearnaise",
      price: 120,
    },
  ];

  // Vegetariska Pizzor
  const vegetariskaPizzor = [
    {
      name: "Vegetarisk",
      description:
        "Tomatsås, ost, kronärtskocka, färska tomater, lök, champinjoner, paprika, oliver, sparris",
      price: 120,
    },
    {
      name: "Orientalisk",
      description:
        "Tomatsås, ost, kronärtskocka, paprika, lök, oliver, vitlök, färska tomater",
      price: 120,
    },
    {
      name: "Bahamas",
      description:
        "Tomatsås, ost, ananas, jordnötter, banan, curry, bearnaisesås",
      price: 120,
    },
  ];

  // Kycklingpizzor
  const kycklingpizzor = [
    {
      name: "Rimini",
      description: "Tomatsås, ost, kyckling, räkor, ananas, banan, curry",
      price: 135,
    },
    {
      name: "Hot",
      description: "Tomatsås, ost, kyckling, paprika, lök, ananas, vitlök",
      price: 135,
    },
    {
      name: "Milano special",
      description: "Tomatsås, ost, kyckling, räkor, jordnötter, bearnaisesås",
      price: 135,
    },
  ];

  // Specialpizzor
  const specialpizzor = [
    {
      name: "Havets pizza",
      description:
        "Tomatsås, ost, räkor, musslor, tonfisk, lök, färska tomater, paprika",
      price: 135,
    },
    {
      name: "Favorit",
      description:
        "Tomatsås, ost, oxfilé, paprika, lök, färska tomater, bearnaisesås",
      price: 135,
    },
    {
      name: "Gorgonzola",
      description: "Tomatsås, ost, oxfilé, lök, champinjoner, färska tomater",
      price: 135,
    },
  ];

  // Kebabpizzor
  const kebabpizzor = [
    {
      name: "Kebab pizza",
      description: "Tomatsås, ost, kebabkött, lök, champinjoner, tomater",
      price: 135,
    },
    {
      name: "Favoriten",
      description:
        "Tomatsås, ost, kebabkött, isbergssallad, lök, färska tomater, gurka, feferoni, vitlökssås",
      price: 135,
    },
    {
      name: "Milano kebab",
      description: "Tomatsås, ost, kebabkött, ananas, banan, curry",
      price: 135,
    },
  ];

  // Förrätter
  const forratter = [
    {
      name: "Vitlöksbröd med tzatziki",
      description: "Nybakat vitlöksbröd med tzatziki",
      price: 70,
    },
    {
      name: "Tomatsallad",
      description: "Tomat, salladslök, oliver, vitlök, salladsdressing",
      price: 69,
    },
  ];

  // Kötträtter
  const kottratter = [
    {
      name: "Black and White",
      description: "Med oxfilé, fläskfilé, rödvinssås, bearnaisesås",
      price: 259,
    },
    {
      name: "Fläskfilé",
      description: "Med rödvinssås eller bearnaisesås",
      price: 199,
    },
    { name: "Kycklingfilé på spett", description: "Med tzatziki", price: 169 },
  ];

  // Extra tillbehör
  const extraTillbehor = [
    { name: "Ostkant", description: "Extra ostkant till pizza", price: 30 },
    { name: "Vitlöksås", description: "Hemlagad vitlökssås", price: 30 },
    {
      name: "Extra ostkant",
      description: "Dubbel ostkant till pizza",
      price: 50,
    },
    { name: "Pommes", description: "Portion pommes frites", price: 25 },
    {
      name: "Glutenfri pizzabotten",
      description: "Alla pizzor kan fås med glutenfri pizzabotten",
      price: 30,
    },
    { name: "Pizzasallad", description: "Portion pizzasallad", price: 15 },
  ];

  // Create all menu items
  const menuItemsData = [
    { items: pizzaKlass1, categoryIndex: 0 },
    { items: pizzaKlass2, categoryIndex: 1 },
    { items: pizzaKlass3, categoryIndex: 2 },
    { items: pizzaKlass4, categoryIndex: 3 },
    { items: vegetariskaPizzor, categoryIndex: 4 },
    { items: kycklingpizzor, categoryIndex: 5 },
    { items: specialpizzor, categoryIndex: 6 },
    { items: kebabpizzor, categoryIndex: 7 },
    { items: forratter, categoryIndex: 8 },
    { items: kottratter, categoryIndex: 9 },
    { items: extraTillbehor, categoryIndex: 10 },
  ];

  for (const { items, categoryIndex } of menuItemsData) {
    for (let i = 0; i < items.length; i++) {
      await prisma.menuItem.create({
        data: {
          menuId: menu.id,
          categoryId: categories[categoryIndex].id,
          name: items[i].name,
          description: items[i].description,
          price: items[i].price,
          isAvailable: true,
          sortOrder: i + 1,
        },
      });
    }
  }

  console.log(`  ✅ Created menu with categories and items`);

  console.log("\n🎉 Seeding completed!");
  console.log("\n📊 Summary:");
  console.log(`  - 1 restaurant created`);
  console.log(`  - 1 menu created`);
  console.log(`  - ${categories.length} categories created`);
  console.log(
    `  - ${menuItemsData.reduce(
      (acc, { items }) => acc + items.length,
      0
    )} menu items created`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
