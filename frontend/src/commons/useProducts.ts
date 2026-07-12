import { useState, useEffect } from "react";
import type { Product } from "./types";

const API_URL = "http://localhost:8080/api/products";

export function useProducts(searchQuery: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Counter to force page refresh each time data in DB changes
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const backendPage = page - 1;
        const size = 12;
        const queryClean = encodeURIComponent(searchQuery);
        const url = `${API_URL}/catalog?size=${size}&page=${backendPage}&sortBy=price&sortDir=desc&search=${queryClean}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        const items = data.content || data.items || data;
        setProducts(items);
        setHasMore(items.length === size);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, [page, searchQuery, refreshKey]);

  // If new search is made, go back to page 1
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // CREATE
  const addProduct = async (newProduct: Omit<Product, "id">) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) throw new Error("Failed to create product");
      triggerRefresh();
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
      triggerRefresh();
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
      triggerRefresh();
    } catch (err) {
      console.error(err);
      alert("Could not delete product from database");
    }
  };

  // BUY A PRODUCT
  const buyProduct = async (product: Product, quantity: number) => {
    try {
      const response = await fetch(`${API_URL}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send object expected by backend
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
        }),
      });

      // Process response, if is a JSON or plain text
      const rawText = await response.text();
      let data: any;
      try {
        // Try to parse as JSON
        data = JSON.parse(rawText);
        const msg =
          `YOUR PURCHASE STATUS:\n\n` +
          `• Status: ${data.status}\n` +
          `• Total to pay: ${data.totalAmount}\n` +
          `• Message: ${data.message}\n`;
        alert(msg);
      } catch {
        // If parse fail, then is plain text
        data = rawText;
        const msg = `BACKEND SAYS:\n\n` + `• Message: ${data}\n`;
        alert(msg);
      }
      triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    products,
    error,
    page,
    setPage,
    hasMore,
    deleteProduct,
    updateProduct,
    addProduct,
    buyProduct,
  };
}
