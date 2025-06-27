import { db } from "./db";
import { headers } from "next/headers";

export async function getCurrentTenant() {
  const headersList = await headers();
  const subdomain = headersList.get("x-tenant-subdomain");

  if (!subdomain) {
    throw new Error("No tenant subdomain found");
  }

  const tenant = await db.tenant.findFirst({
    where: {
      OR: [{ subdomain }, { domain: subdomain }],
    },
  });

  if (!tenant) {
    throw new Error(`Tenant not found: ${subdomain}`);
  }

  return tenant;
}
