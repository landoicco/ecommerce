import { useState, useEffect } from "react";
import type { Product } from "./types";

const API_URL = "http://localhost:8080/api/products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  // READ
  const fetchProducts = () => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data: Product[]) => setProducts(data))
      .catch((err) => setError(err instanceof Error ? err.message : "API Error"));
  };

  // Ensure we fetch items at first
  useEffect(() => {
    fetchProducts();
  }, []);

  // CREATE
  const addProduct = async (newProduct: Omit<Product, "id">) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) throw new Error("Failed to create product");
      fetchProducts(); // Refresh local state with new data
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    }
  };

  // UPDATE
  const updateProduct = async (id: number, updatedFields: Partial<Product>) => {
    try {
      const response = await fetch(`${API_URL}/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (!response.ok) throw new Error("Failed to update product");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error updating product");
    }
  };

  // DELETE
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

  // BUY A PRODUCT
  const buyProduct = async (product: Product) => {
    if (product.stock <= 0) return;

    const updatedProduct: Product = {
      ...product,
      stock: product.stock - 1,
    };

    await updateProduct(product.id, updatedProduct);
  };

  return { products, error, deleteProduct, updateProduct, addProduct, buyProduct };
}
