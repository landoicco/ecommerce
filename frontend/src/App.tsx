import { useState } from "react";
import { useProducts } from "./commons/useProducts";
import ProductCard from "./components/ProductCard";

export default function App() {
  const { products, error, deleteProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products client-side based on name, sku, or category
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8 text-gray-900 font-sans antialiased">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="border-b border-gray-100 pb-6 mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium tracking-tight">Inventory</h1>
            <p className="text-xs text-gray-400 mt-0.5">Local database live view</p>
          </div>

          {/* Minimalist Search Input */}
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search by name, SKU or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-white border border-gray-100 rounded-md px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-colors font-sans"
            />
          </div>
        </header>

        {/* Error State */}
        {error && (
          <div className="text-center py-4 max-w-md mx-auto">
            <p className="text-xs font-mono text-red-500">Database connection failed: {error}</p>
          </div>
        )}

        {/* Grid Display with Search Logic */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onDelete={deleteProduct} />
            ))}
          </div>
        ) : (
          !error && (
            <div className="text-center py-10">
              <p className="text-xs text-gray-400">
                {products.length === 0 ? "No products found." : "No results match your search."}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
