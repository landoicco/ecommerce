import type { Product } from "../commons/types";

interface ProductFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  formData: Omit<Product, "id">;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Product, "id">>>;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ProductFormDrawer({
  isOpen,
  onClose,
  editingProduct,
  formData,
  setFormData,
  onSubmit,
}: ProductFormDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/5 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-white h-screen p-6 shadow-2xl border-l border-gray-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-gray-50">
            <h2 className="text-sm font-medium text-gray-900">
              {editingProduct ? `Modify ${editingProduct.sku}` : "New Database Record"}
            </h2>
            <button
              onClick={onClose}
              className="text-xs text-gray-400 hover:text-gray-900 cursor-pointer"
            >
              Close
            </button>
          </div>

          <form id="crud-form" onSubmit={onSubmit} className="mt-6 space-y-4 text-xs">
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
                <label className="block font-sans font-medium text-gray-500 mb-1">Price ($)</label>
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
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white font-medium rounded hover:bg-gray-800 transition-colors cursor-pointer"
              >
                {editingProduct ? "Save Changes" : "Create Record"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
