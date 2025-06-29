import Menu from "./components/menu/Menu";
import Cart from "./components/cart/Cart";
import Header from "./components/header/Header";

export default async function HomePage() {
  try {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Menu />
        </main>

        <Cart />
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
