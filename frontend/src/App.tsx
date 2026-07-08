import { useProducts } from "./commons/useProducts";
import ProductCard from "./components/ProductCard";

export default function App() {
  const { products, error } = useProducts();

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8 text-gray-900 font-sans antialiased">
      <div className="max-w-5xl mx-auto">

        {/* Minimalist Header */}
        <header className="border-b border-gray-100 pb-6 mb-10">
          <h1 className="text-xl font-medium tracking-tight">Inventory</h1>
          <p className="text-xs text-gray-400 mt-0.5">Local database live view</p>
        </header>

        {/* Error State - Essential for debugging your DB connection */}
        {error && (
          <div className="text-center py-4 max-w-md mx-auto">
            <p className="text-xs font-mono text-red-500">Database connection failed: {error}</p>
          </div>
        )}

        {/* Clean Grid Display */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          !error && <p className="text-xs text-gray-400 text-center py-10">No products found.</p>
        )}

      </div>
    </div>
  );
}
