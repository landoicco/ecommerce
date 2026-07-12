import { useState, useEffect } from "react";
import type { Product } from "../commons/types";

interface BuyModalProps {
  product: Product | null;
  onClose: () => void;
  onConfirm: (product: Product, quantity: number) => void;
}

export default function BuyModal({ product, onClose, onConfirm }: BuyModalProps) {
  const [buyQuantity, setBuyQuantity] = useState<number>(1);

  // Restart to 1 each time when selecting a new product
  useEffect(() => {
    setBuyQuantity(1);
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xl max-w-xs w-full text-xs">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
            <p className="text-gray-400 font-mono mt-0.5 text-[10px]">SKU: {product.sku}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-medium text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Quantity selector */}
        <div className="my-4 bg-gray-50 rounded-lg p-3 border border-gray-100/80 flex items-center justify-between">
          <span className="text-gray-500 font-medium">Quantity:</span>
          <div className="flex items-center gap-2 font-mono">
            {/* Remove button */}
            <button
              type="button"
              disabled={buyQuantity <= 1}
              onClick={() => setBuyQuantity(buyQuantity - 1)}
              className="w-6 h-6 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 font-bold transition-colors cursor-pointer flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
            >
              -
            </button>

            {/* Keyboard input */}
            <input
              type="number"
              min={1}
              max={product.stock}
              value={buyQuantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);

                // Change state to empty if data is deleted
                if (isNaN(val)) {
                  setBuyQuantity("" as any);
                  return;
                }

                /* This three lines of code help to force the user to only buy
                /* the available products on stock.
                /* However, we will comment this for now to prove that the backend is
                /* also able to handle this scenario, but please note, keeping
                /* this lines are way better for user experience.
                /*
                /* if (val < 1) setBuyQuantity(1);
                /* else if (val > product.stock) setBuyQuantity(product.stock);
                /* else setBuyQuantity(val); */
                setBuyQuantity(val); // Trick to test backend exceptions
              }}
              onBlur={() => {
                // If user quit focus, change to back to 1
                if (!buyQuantity || isNaN(buyQuantity)) setBuyQuantity(1);
              }}
              className="w-12 h-6 bg-white border border-gray-200 text-gray-800 text-center rounded font-semibold focus:outline-none focus:border-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />

            {/* Add button */}
            <button
              type="button"
              disabled={buyQuantity >= product.stock}
              onClick={() => setBuyQuantity(buyQuantity + 1)}
              className="w-6 h-6 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 font-bold transition-colors cursor-pointer flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>

        {/* Summary and costs */}
        <div className="flex justify-between items-center text-gray-500 font-medium mb-4 px-1">
          <span>Total:</span>
          <span className="text-base font-bold text-gray-900 font-sans">
            ${(product.price * buyQuantity).toFixed(2)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-2 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 font-medium cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(product, buyQuantity)}
            className="w-1/2 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded font-medium cursor-pointer transition-colors"
          >
            Confirm Buy
          </button>
        </div>
      </div>
    </div>
  );
}
