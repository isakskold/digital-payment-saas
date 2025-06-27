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

  console.log("�� Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
