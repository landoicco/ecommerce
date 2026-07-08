import type { Product } from "../commons/types";

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  return (
    <div className="group border border-gray-100 rounded-lg p-4 bg-white transition-all duration-200 hover:border-gray-200 flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-50 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover object-center max-h-full max-w-full grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        </div>

        {/* Content Section */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium tracking-widest text-gray-400 uppercase">
              {product.category}
            </span>
            <span className="text-[10px] font-mono text-gray-400">
              {product.sku}
            </span>
          </div>

          <h3 className="mt-1 text-sm font-medium text-gray-900">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Technical Specs & Footer */}
      <div className="mt-4">
        {/* Specs Row */}
        <div className="grid grid-cols-2 gap-2 pb-3 text-[11px] text-gray-400 border-b border-gray-50 font-mono">
          <div>Stock: <span className={product.stock > 0 ? "text-gray-600" : "text-red-400"}>{product.stock} u</span></div>
          <div className="text-right">Weight: <span className="text-gray-600">{product.weightKg} kg</span></div>
        </div>

        {/* Price & Actions */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => onDelete(product.id)}
            className="text-[11px] font-medium text-gray-400 hover:text-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
