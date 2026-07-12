import { useState, useEffect } from "react";
import type { Product } from "./types";

const API_URL = "http://localhost:8080/api/products";

export function useProducts(searchQuery: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const backendPage = page - 1; // Backend use 0 as base, UI uses 1 as base
        const size = 10;
        const queryClean = encodeURIComponent(searchQuery);

        // Build URL
        const url = `${API_URL}/catalog?size=${size}&page=${backendPage}&sortBy=price&sortDir=desc&search=${queryClean}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();

        // Support paginated and plain objects
        const items = data.content || data.items || data;
        setProducts(items);

        // Control if there are more pages to show
        setHasMore(items.length === size);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, [page, searchQuery]); // Run when page or search query changes

  // Return to page 1 when user write on searchbar
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

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
  // useEffect(() => {
  //   fetchProducts();
  // }, []);

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
      // Fetch products to update UI
      fetchProducts();
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
