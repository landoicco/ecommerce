import { useState } from "react";
import type { Product } from "../commons/types";

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
  onEdit: (product: Product) => void;
  onBuy: (product: Product) => void;
}

export default function ProductCard({ product, onDelete, onEdit, onBuy }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const initials = product.name.slice(0, 2).toUpperCase();
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group border border-gray-100 rounded-lg p-4 bg-white transition-all duration-200 hover:border-gray-200 flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-50 flex items-center justify-center relative">
          {imageError ? (
            <span className="text-xs font-mono font-medium tracking-wider text-gray-300 select-none">
              [{initials}]
            </span>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImageError(true)}
              className="object-cover object-center max-h-full max-w-full grayscale group-hover:grayscale-0 transition-all duration-300"
            />
          )}
        </div>

        {/* Content Section */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium tracking-widest text-gray-400 uppercase">
              {product.category}
            </span>
            <span className="text-[10px] font-mono text-gray-400">{product.sku}</span>
          </div>
          <h3 className="mt-1 text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      <div className="mt-4">
        {/* Technical Specs */}
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
            <span className="text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</span>
            {/* Hidden edit/delete buttons */}
            <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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

          {/* Buy button */}
          <button
            onClick={() => onBuy(product)}
            disabled={isOutOfStock}
            className={`text-xs font-medium px-3 py-1.5 rounded transition-all duration-200 cursor-pointer ${
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
