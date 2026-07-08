import { useState } from "react";
import type { Product } from "./commons/types";
import ProductCard from "./components/ProductCard";

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Minimalist Desk Lamp",
    sku: "LMP-001-W",
    category: "Lighting",
    price: 45.00,
    description: "Dimmable LED light with a natural wooden base and modern arm design.",
    stock: 14,
    weightKg: 1.2,
    image: "https://unsplash.com"
  },
  {
    id: 2,
    name: "A5 Hardcover Notebook",
    sku: "NTE-A5-MATE",
    category: "Stationery",
    price: 12500.50,
    description: "80 sheets of high-grain textured paper. Hardcover with a silky mate finish.",
    stock: 50,
    weightKg: 0.35,
    image: "https://unsplash.com"
  }
];

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Simulates creating a product with all required fields
  const handleAddProduct = () => {
    const nextId = Date.now();
    const newProduct: Product = {
      id: nextId,
      name: `Premium Tool v${products.length + 1}`,
      sku: `GEN-${Math.floor(100 + Math.random() * 900)}-X`,
      category: "Tools",
      price: parseFloat((Math.random() * 80 + 10).toFixed(2)),
      description: "Industrial grade essential component designed for long-term usage and optimal weight balance.",
      stock: Math.floor(Math.random() * 25) + 1,
      weightKg: parseFloat((Math.random() * 3 + 0.1).toFixed(2)),
      image: "https://unsplash.com"
    };
    setProducts([...products, newProduct]);
  };

  // Delete a specific product by ID
  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8 text-gray-900 font-sans antialiased">
      <div className="max-w-5xl mx-auto">

        {/* Navigation & Action Header */}
        <header className="border-b border-gray-100 pb-6 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium tracking-tight">Inventory Dashboard</h1>
            <p className="text-xs text-gray-400 mt-0.5">Database schema UI validation</p>
          </div>

          {/* Minimalist Button Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddProduct}
              className="text-xs font-medium px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
            >
              Add New Product
            </button>
          </div>
        </header>

        {/* Dynamic Grid System */}
        {products.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-lg p-12 text-center">
            <p className="text-xs text-gray-400">Inventory is empty. Click the button above to add an item.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
