import { getCurrentTenant } from "@/lib/tenant";
import CartToggle from "./CartToggle";

export default async function Header() {
  const tenant = await getCurrentTenant();
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to {tenant.displayName}
            </h1>
            <p className="mt-2 text-gray-600">Order delicious food online</p>
          </div>
          <CartToggle />
        </div>
      </div>
    </header>
  );
}
