import { useState } from "react";
import { useProducts } from "./commons/useProducts";
import type { Product } from "./commons/types";
import ProductCard from "./components/ProductCard";
import Header from "./components/Header";
import ProductFormDrawer from "./components/ProductFormDrawer";
import BuyModal from "./components/BuyModal";

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
  const [buyingProduct, setBuyingProduct] = useState<Product | null>(null);

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
    console.log(`Units sold: ${quantity}`);
    await buyProduct(product, quantity);
    setBuyingProduct(null);
  };

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

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={deleteProduct}
                onEdit={handleOpenEdit}
                onBuy={setBuyingProduct}
              />
            ))}
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
