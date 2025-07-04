import Menu from "./components/menu/Menu";
import Cart from "./components/cart/Cart";
import Header from "./components/header/Header";
import OrderStatusModal from "./components/order/OrderStatusModal";
import CartIndicator from "./components/cart/CartIndicator";

export default async function HomePage() {
  try {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />

        <main className="max-w-3xl mx-auto w-full px-4 pb-12 pt-0">
          <Menu />
        </main>

        <Cart />
        <OrderStatusModal />
        <CartIndicator />
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Restaurang hittades inte
          </h1>
          <p className="text-gray-600 mt-2">
            Denna restaurang finns inte eller är inte aktiv.
          </p>
        </div>
      </div>
    );
  }
}
