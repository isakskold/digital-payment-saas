import { getCurrentTenant } from "@/lib/tenant";
import CartToggle from "./CartToggle";
import OrderStatusToggle from "./OrderStatusToggle";
import SearchBar from "./SearchBar";
import { FiMapPin, FiPhone } from "react-icons/fi";

export default async function Header() {
  const tenant = await getCurrentTenant();
  return (
    <>
      {/* Restaurant info - normal flow */}
      <div
        className="border-b border-gray-200"
        style={{ backgroundColor: "var(--primary-color)" }}
      >
        <div className="max-w-3xl mx-auto px-4 py-4 md:py-6 lg:py-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            {tenant.displayName}
          </h1>
          <p className="mt-1 md:mt-2 text-gray-200 text-sm md:text-base">
            Goda pizzor i trevlig miljö
          </p>

          {/* Mobile: Stack vertically, Desktop: Horizontal */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-4 text-xs sm:text-sm md:text-base text-gray-200">
            <div className="flex items-center">
              <span className="h-2 md:h-2.5 w-2 md:w-2.5 rounded-full bg-white mr-2"></span>
              <span>Open until 10:00 PM</span>
            </div>
            <div className="flex items-center">
              <FiMapPin className="w-3 sm:w-4 h-3 sm:h-4 mr-2 flex-shrink-0" />
              <span className="text-center sm:text-left">
                Stationsgatan 74, 688 30 Storfors
              </span>
            </div>
            <div className="flex items-center">
              <FiPhone className="w-3 sm:w-4 h-3 sm:h-4 mr-2 flex-shrink-0" />
              <span>0550-622 43</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and controls - fixed */}
      <div
        className="fixed top-0 left-0 right-0 z-40 border-b border-gray-200 shadow-sm transform translate-y-0"
        style={{ position: "sticky", backgroundColor: "var(--primary-color)" }}
      >
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Search */}
            <SearchBar />

            {/* Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <OrderStatusToggle />
              <CartToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
