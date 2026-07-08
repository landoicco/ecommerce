import { useState, useEffect } from "react";
import type { Product } from "./types";

const API_URL = "http://localhost:8080/api/products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data: Product[]) => setProducts(data))
      .catch((err) => setError(err instanceof Error ? err.message : "API Error"));
  }, []);

  const deleteProduct = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.status}`);
      }

      // Remove element from local state
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not delete product from database");
    }
  };

  return { products, error, deleteProduct };
}
