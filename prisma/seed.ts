import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Taverna Storfors tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: "taverna-storfors",
      subdomain: "taverna",
      displayName: "Taverna Storfors",
      isActive: true,
    },
  });

  console.log(
    `✅ Created tenant: ${tenant.displayName} (${tenant.subdomain}.yourplatform.com)`
  );

  // Create menu for Taverna Storfors
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

  // Create categories for Taverna Storfors
  const tavernaCategories = await Promise.all([
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Taverna Pizza Klass 1",
        description: "TOMATSÅS OCH OST INGÅR I ALLA PIZZOR",
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Taverna Pizza Klass 2",
        description: "TOMATSÅS OCH OST INGÅR I ALLA PIZZOR",
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Taverna Pizza Klass 3",
        description: "TOMATSÅS OCH OST INGÅR I ALLA PIZZOR",
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Taverna Pizza Klass 4",
        description: "TOMATSÅS OCH OST INGÅR I ALLA PIZZOR",
        sortOrder: 4,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Taverna Vegetariska Pizzor",
        description: "Vegetariska pizzor med tomatsås och ost",
        sortOrder: 5,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Taverna Kycklingpizzor",
        description: "Utsökta pizzor med kyckling",
        sortOrder: 6,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Taverna Specialpizzor",
        description: "Till alla pizzor ingår bearnaisesås",
        sortOrder: 7,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Taverna Kebabpizzor",
        description:
          "Till alla kebabpizzor ingår valfri sås. Välj mellan nötkött och gyros",
        sortOrder: 8,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Taverna Förrätter",
        description: "Goda förrätter",
        sortOrder: 9,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Taverna Kötträtter",
        description:
          "Serveras med stekt potatis, pommes frites eller klyftpotatis",
        sortOrder: 10,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: menu.id,
        name: "Taverna Tillbehör",
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

  // Pizza Klass 2 - Sample items
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

  // Pizza Klass 3 - Sample items
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

  // Pizza Klass 4 - Sample items
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
      name: "Rita special",
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
      name: "Värmland",
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
    {
      name: "Kycklingfilé på spett",
      description: "Med tzatziki",
      price: 169,
    },
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

  // Create Pizza Klass 1 items
  for (let i = 0; i < pizzaKlass1.length; i++) {
    await prisma.menuItem.create({
      data: {
        menuId: menu.id,
        categoryId: tavernaCategories[0].id,
        name: pizzaKlass1[i].name,
        description: pizzaKlass1[i].description,
        price: pizzaKlass1[i].price,
        isAvailable: true,
        sortOrder: i + 1,
      },
    });
  }

  // Create Pizza Klass 2 items
  for (let i = 0; i < pizzaKlass2.length; i++) {
    await prisma.menuItem.create({
      data: {
        menuId: menu.id,
        categoryId: tavernaCategories[1].id,
        name: pizzaKlass2[i].name,
        description: pizzaKlass2[i].description,
        price: pizzaKlass2[i].price,
        isAvailable: true,
        sortOrder: i + 1,
      },
    });
  }

  // Create Pizza Klass 3 items
  for (let i = 0; i < pizzaKlass3.length; i++) {
    await prisma.menuItem.create({
      data: {
        menuId: menu.id,
        categoryId: tavernaCategories[2].id,
        name: pizzaKlass3[i].name,
        description: pizzaKlass3[i].description,
        price: pizzaKlass3[i].price,
        isAvailable: true,
        sortOrder: i + 1,
      },
    });
  }

  // Create Pizza Klass 4 items
  for (let i = 0; i < pizzaKlass4.length; i++) {
    await prisma.menuItem.create({
      data: {
        menuId: menu.id,
        categoryId: tavernaCategories[3].id,
        name: pizzaKlass4[i].name,
        description: pizzaKlass4[i].description,
        price: pizzaKlass4[i].price,
        isAvailable: true,
        sortOrder: i + 1,
      },
    });
  }

  // Create Vegetariska Pizzor items
  for (let i = 0; i < vegetariskaPizzor.length; i++) {
    await prisma.menuItem.create({
      data: {
        menuId: menu.id,
        categoryId: tavernaCategories[4].id,
        name: vegetariskaPizzor[i].name,
        description: vegetariskaPizzor[i].description,
        price: vegetariskaPizzor[i].price,
        isAvailable: true,
        sortOrder: i + 1,
      },
    });
  }

  // Create Kycklingpizzor items
  for (let i = 0; i < kycklingpizzor.length; i++) {
    await prisma.menuItem.create({
      data: {
        menuId: menu.id,
        categoryId: tavernaCategories[5].id,
        name: kycklingpizzor[i].name,
        description: kycklingpizzor[i].description,
        price: kycklingpizzor[i].price,
        isAvailable: true,
        sortOrder: i + 1,
      },
    });
  }

  // Create Specialpizzor items
  for (let i = 0; i < specialpizzor.length; i++) {
    await prisma.menuItem.create({
      data: {
        menuId: menu.id,
        categoryId: tavernaCategories[6].id,
        name: specialpizzor[i].name,
        description: specialpizzor[i].description,
        price: specialpizzor[i].price,
        isAvailable: true,
        sortOrder: i + 1,
      },
    });
  }

  // Create Kebabpizzor items
  for (let i = 0; i < kebabpizzor.length; i++) {
    await prisma.menuItem.create({
      data: {
        menuId: menu.id,
        categoryId: tavernaCategories[7].id,
        name: kebabpizzor[i].name,
        description: kebabpizzor[i].description,
        price: kebabpizzor[i].price,
        isAvailable: true,
        sortOrder: i + 1,
      },
    });
  }

  // Create Förrätter items
  for (let i = 0; i < forratter.length; i++) {
    await prisma.menuItem.create({
      data: {
        menuId: menu.id,
        categoryId: tavernaCategories[8].id,
        name: forratter[i].name,
        description: forratter[i].description,
        price: forratter[i].price,
        isAvailable: true,
        sortOrder: i + 1,
      },
    });
  }

  // Create Kötträtter items
  for (let i = 0; i < kottratter.length; i++) {
    await prisma.menuItem.create({
      data: {
        menuId: menu.id,
        categoryId: tavernaCategories[9].id,
        name: kottratter[i].name,
        description: kottratter[i].description,
        price: kottratter[i].price,
        isAvailable: true,
        sortOrder: i + 1,
      },
    });
  }

  // Create Extra Tillbehör items
  for (let i = 0; i < extraTillbehor.length; i++) {
    await prisma.menuItem.create({
      data: {
        menuId: menu.id,
        categoryId: tavernaCategories[10].id,
        name: extraTillbehor[i].name,
        description: extraTillbehor[i].description,
        price: extraTillbehor[i].price,
        isAvailable: true,
        sortOrder: i + 1,
      },
    });
  }

  console.log(`  ✅ Created menu with categories and items`);

  // ────────────────────────────────────────────────────────────────
  // Ny tenant: Pizzeria Folkets Hus (Storfors)
  // ────────────────────────────────────────────────────────────────

  // Skapa tenant
  const folketsTenant = await prisma.tenant.create({
    data: {
      name: "pizzeria-folkets-hus",
      subdomain: "folketshus",
      displayName: "Pizzeria Folkets Hus",
      isActive: true,
    },
  });

  console.log(
    `✅ Created tenant: ${folketsTenant.displayName} (${folketsTenant.subdomain}.yourplatform.com)`
  );

  // Skapa huvudmeny
  const folketsMenu = await prisma.menu.create({
    data: {
      tenantId: folketsTenant.id,
      name: "Huvudmeny",
      description: "Klassiska pizzor – tomatsås och ost ingår",
      isDefault: true,
      isActive: true,
      sortOrder: 1,
    },
  });

  console.log(`\n🍕 Creating menu for ${folketsTenant.displayName}...`);

  // Skapa pizzakategorier (klass 1-4)
  const folketsCategories = await Promise.all([
    prisma.menuCategory.create({
      data: {
        menuId: folketsMenu.id,
        name: "Pizzor Klass 1",
        description: "Tomatsås och ost ingår i alla pizzor",
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: folketsMenu.id,
        name: "Pizzor Klass 2",
        description: "Tomatsås och ost ingår i alla pizzor",
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: folketsMenu.id,
        name: "Pizzor Klass 3",
        description: "Tomatsås och ost ingår i alla pizzor",
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        menuId: folketsMenu.id,
        name: "Pizzor Klass 4",
        description: "Tomatsås och ost ingår i alla pizzor",
        sortOrder: 4,
        isActive: true,
      },
    }),
  ]);

  // Lägg till pizzor för varje klass
  for (let i = 0; i < pizzaKlass1.length; i++) {
    await prisma.menuItem.create({
      data: {
        menuId: folketsMenu.id,
        categoryId: folketsCategories[0].id,
        name: pizzaKlass1[i].name,
        description: pizzaKlass1[i].description,
        price: pizzaKlass1[i].price,
        isAvailable: true,
        sortOrder: i + 1,
      },
    });
  }

  for (let i = 0; i < pizzaKlass2.length; i++) {
    await prisma.menuItem.create({
      data: {
        menuId: folketsMenu.id,
        categoryId: folketsCategories[1].id,
        name: pizzaKlass2[i].name,
        description: pizzaKlass2[i].description,
        price: pizzaKlass2[i].price,
        isAvailable: true,
        sortOrder: i + 1,
      },
    });
  }

  for (let i = 0; i < pizzaKlass3.length; i++) {
    await prisma.menuItem.create({
      data: {
        menuId: folketsMenu.id,
        categoryId: folketsCategories[2].id,
        name: pizzaKlass3[i].name,
        description: pizzaKlass3[i].description,
        price: pizzaKlass3[i].price,
        isAvailable: true,
        sortOrder: i + 1,
      },
    });
  }

  for (let i = 0; i < pizzaKlass4.length; i++) {
    await prisma.menuItem.create({
      data: {
        menuId: folketsMenu.id,
        categoryId: folketsCategories[3].id,
        name: pizzaKlass4[i].name,
        description: pizzaKlass4[i].description,
        price: pizzaKlass4[i].price,
        isAvailable: true,
        sortOrder: i + 1,
      },
    });
  }

  console.log(
    `  ✅ Created menu with categories and items för ${folketsTenant.displayName}`
  );

  console.log("\n🎉 Seeding completed!");
  console.log("\n📊 Summary:");
  console.log(`  - 1 restaurant created`);
  console.log(`  - 1 menu created`);
  console.log(`  - 11 categories created`);
  console.log(
    `  - ${
      pizzaKlass1.length +
      pizzaKlass2.length +
      pizzaKlass3.length +
      pizzaKlass4.length +
      vegetariskaPizzor.length +
      kycklingpizzor.length +
      specialpizzor.length +
      kebabpizzor.length +
      forratter.length +
      kottratter.length +
      extraTillbehor.length
    } menu items created`
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
