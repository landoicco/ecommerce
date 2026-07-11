import type { Product } from "../commons/types";

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
  onEdit: (product: Product) => void;
  onBuy: (product: Product) => void;
}

export default function ProductCard({ product, onDelete, onEdit, onBuy }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group border border-gray-100 rounded-lg p-5 bg-white transition-all duration-200 hover:border-gray-200 hover:shadow-2xs flex flex-col justify-between min-h-[180px]">
      <div>
        {/* Top Metadata Row */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium tracking-widest text-gray-400 uppercase">
            {product.category || "General"}
          </span>
          <span className="text-[10px] font-mono bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-100/50">
            {product.sku}
          </span>
        </div>

        {/* Content Section */}
        <div className="mt-3">
          <h3 className="text-sm font-semibold text-gray-900 tracking-tight">{product.name}</h3>
          <p className="mt-1.5 text-xs text-gray-400 line-clamp-3 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Technical Specs & Actions */}
      <div className="mt-5">
        {/* Specs Row */}
        <div className="grid grid-cols-2 gap-2 pb-3 text-[11px] text-gray-400 border-b border-gray-50 font-mono">
          <div>
            Stock:{" "}
            <span className={!isOutOfStock ? "text-gray-600" : "text-red-400 font-medium"}>
              {isOutOfStock ? "Out of stock" : `${product.stock} u`}
            </span>
          </div>
          <div className="text-right">
            Weight: <span className="text-gray-600">{product.weightKg} kg</span>
          </div>
        </div>

        {/* Price & Actions Row */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base font-bold text-gray-900">${product.price.toFixed(2)}</span>

            {/* Quick admin controls on hover */}
            <div className="flex items-center gap-2 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onEdit(product)}
                className="text-[10px] text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                Edit
              </button>
              <span className="text-[9px] text-gray-200">|</span>
              <button
                onClick={() => onDelete(product.id)}
                className="text-[10px] text-gray-400 hover:text-red-500 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
          <button
            onClick={() => onBuy(product)}
            disabled={isOutOfStock}
            className={`text-xs font-medium px-4 py-2 rounded transition-all duration-200 cursor-pointer ${
              isOutOfStock
                ? "bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {isOutOfStock ? "Sold Out" : "Buy"}
          </button>
        </div>
      </div>
    </div>
  );
}
