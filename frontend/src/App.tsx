import { useState } from "react";
import { useProducts } from "./commons/useProducts";
import type { Product } from "./commons/types";
import ProductCard from "./components/ProductCard";

const EMPTY_FORM: Omit<Product, "id"> = {
  name: "",
  sku: "",
  description: "",
  category: "",
  price: 0,
  stock: 0,
  weightKg: 0,
};

export default function App() {
  const { products, error, deleteProduct, addProduct, updateProduct, buyProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "id">>(EMPTY_FORM);

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setIsPanelOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      weightKg: product.weightKg,
    });
    setIsPanelOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      await updateProduct(editingProduct.id, formData);
    } else {
      await addProduct(formData);
    }
    setIsPanelOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8 text-gray-900 font-sans antialiased relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="border-b border-gray-100 pb-6 mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium tracking-tight">Inventory Terminal</h1>
            <p className="text-xs text-gray-400 mt-0.5">Technical catalog management</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Filter by name, SKU or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 text-xs bg-white border border-gray-100 rounded-md px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-colors"
            />
            <button
              onClick={handleOpenCreate}
              className="w-full sm:w-auto text-xs font-medium px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              Add Item
            </button>
          </div>
        </header>

        {error && (
          <div className="text-center py-4 max-w-md mx-auto">
            <p className="text-xs font-mono text-red-500">Database connection failed: {error}</p>
          </div>
        )}

        {/* Grid System */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={deleteProduct}
                onEdit={handleOpenEdit}
                onBuy={buyProduct}
              />
            ))}
          </div>
        ) : (
          !error && (
            <p className="text-xs text-gray-400 text-center py-10">No items match your criteria.</p>
          )
        )}
      </div>

      {/* Slide-over Drawer Panel */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/5 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-white h-screen p-6 shadow-2xl border-l border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                <h2 className="text-sm font-medium text-gray-900">
                  {editingProduct ? `Modify ${editingProduct.sku}` : "New Database Record"}
                </h2>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="text-xs text-gray-400 hover:text-gray-900 cursor-pointer"
                >
                  Close
                </button>
              </div>

              <form id="crud-form" onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-gray-500 mb-1">Item Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded px-3 py-2 focus:outline-none focus:bg-white focus:border-gray-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-500 mb-1">SKU</label>
                    <input
                      required
                      type="text"
                      disabled={!!editingProduct}
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded px-3 py-2 focus:outline-none focus:bg-white focus:border-gray-300 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-500 mb-1">Category</label>
                    <input
                      required
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded px-3 py-2 focus:outline-none focus:bg-white focus:border-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-gray-500 mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded px-3 py-2 focus:outline-none focus:bg-white focus:border-gray-300 resize-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 font-mono">
                  <div>
                    <label className="block font-sans font-medium text-gray-500 mb-1">
                      Price ($)
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={formData.price || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-gray-50 border border-gray-100 rounded px-3 py-2 focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-sans font-medium text-gray-500 mb-1">Stock</label>
                    <input
                      required
                      type="number"
                      value={formData.stock || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-gray-50 border border-gray-100 rounded px-3 py-2 focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-sans font-medium text-gray-500 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      required
                      type="number"
                      step="0.1"
                      value={formData.weightKg || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-gray-50 border border-gray-100 rounded px-3 py-2 focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <button
                type="submit"
                form="crud-form"
                className="w-full text-xs font-medium py-2.5 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors cursor-pointer"
              >
                {editingProduct ? "Save Item Changes" : "Save to Database"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
