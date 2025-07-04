import { getCurrentTenant } from "@/lib/tenant";
import CartToggle from "./CartToggle";
import OrderStatusToggle from "./OrderStatusToggle";
import SearchBar from "./SearchBar";

export default async function Header() {
  const tenant = await getCurrentTenant();
  return (
    <>
      {/* Restaurant info - normal flow */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6 md:py-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {tenant.displayName}
          </h1>
          <p className="mt-1 md:mt-2 text-gray-600 text-sm md:text-base">
            Goda pizzor i trevlig miljö
          </p>

          <div className="flex items-center justify-center gap-6 mt-3 text-sm md:text-base text-gray-600">
            <div className="flex items-center">
              <span className="h-2 md:h-2.5 w-2 md:w-2.5 rounded-full bg-[var(--primary-color)] mr-2"></span>
              <span>Open until 10:00 PM</span>
            </div>
            <div className="flex items-center">
              <span>30-45 min delivery</span>
            </div>
            <div className="flex items-center">
              <span className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span>4.8 (240+ reviews)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and controls - fixed */}
      <div
        className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm transform translate-y-0"
        style={{ position: "sticky" }}
      >
        <div className="max-w-3xl mx-auto px-4 py-2 md:py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Search */}
            <SearchBar />

            {/* Controls */}
            <div className="flex items-center gap-2">
              <OrderStatusToggle />
              <CartToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
