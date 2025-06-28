import { getCurrentTenant } from "@/lib/tenant";
import Menu from "./components/Menu";

export default async function HomePage() {
  try {
    const tenant = await getCurrentTenant();

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to {tenant.displayName}
            </h1>
            <p className="mt-2 text-gray-600">Order delicious food online</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Menu />
        </main>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Restaurant Not Found
          </h1>
          <p className="text-gray-600 mt-2">
            This restaurant doesn't exist or is not active.
          </p>
        </div>
      </div>
    );
  }
}
