import { useState, useEffect } from "react";
import { useProducts } from "./commons/useProducts/useProducts";
import type { Product } from "./commons/types";
import ProductCard from "./components/ProductCard/ProductCard";
import Header from "./components/Header";
import ProductFormDrawer from "./components/ProductFormDrawer";
import BuyModal from "./components/BuyModal/BuyModal";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "id">>(EMPTY_FORM);
  const [buyingProduct, setBuyingProduct] = useState<Product | null>(null);
  const {
    products,
    error,
    deleteProduct,
    addProduct,
    updateProduct,
    buyProduct,
    page,
    setPage,
    hasMore,
  } = useProducts(searchQuery);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setIsPanelOpen(true);
  };
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({ ...p });
    setIsPanelOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) await updateProduct(editingProduct.id, formData);
    else await addProduct(formData);
    setIsPanelOpen(false);
  };

  const handleConfirmPurchase = async (product: Product, quantity: number) => {
    await buyProduct(product, quantity);
    setBuyingProduct(null);
  };

  // Scroll up when page change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8 text-gray-900 font-sans antialiased relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenCreate={handleOpenCreate}
        />

        {error && (
          <div className="text-center py-4 max-w-md mx-auto">
            <p className="text-xs font-mono text-red-500">Database connection failed: {error}</p>
          </div>
        )}

        {/* Grid System */}
        {products.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={deleteProduct}
                  onEdit={handleOpenEdit}
                  onBuy={setBuyingProduct}
                />
              ))}
            </div>

            {/* Pagination Buttons */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-mono">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 border border-gray-200 rounded bg-white hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ← Previous
              </button>

              <span>Page {page}</span>

              <button
                disabled={!hasMore}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 border border-gray-200 rounded bg-white hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        ) : (
          !error && (
            <p className="text-xs text-gray-400 text-center py-10">No items match your criteria.</p>
          )
        )}
      </div>

      <ProductFormDrawer
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
      <BuyModal
        product={buyingProduct}
        onClose={() => setBuyingProduct(null)}
        onConfirm={handleConfirmPurchase}
      />
    </div>
  );
}
