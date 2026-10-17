import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Product } from "@/commons/types";
import { formatCurrency } from "@/i18n/format";

// Same-origin path, so one build runs everywhere: each environment routes /api to the backend
// (Vite proxy in dev, nginx in docker compose, CloudFront in AWS)
const API_URL = "/api/products";

interface PurchaseResponse {
  status: "PENDING" | "PAID" | "FAILED";
  totalAmount: number;
  message: string;
}

export function useProducts(searchQuery: string) {
  const { t, i18n } = useTranslation();
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
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    fetchProducts();
  }, [page, searchQuery, refreshKey]);

  // If new search is made, go back to page 1. Done during render instead of in
  // an effect, so React re-renders once instead of rendering the stale page first
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setPage(1);
  }

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
      alert(t("errors.saveProduct"));
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
      alert(t("errors.updateProduct"));
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
      alert(t("errors.deleteProduct"));
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
      try {
        // Try to parse as JSON
        const data: PurchaseResponse = JSON.parse(rawText);
        // The backend message is still an English sentence; it becomes an error code
        // with the new orders API
        const msg =
          `${t("purchase.title")}:\n\n` +
          `• ${t("purchase.status")}: ${t(`purchase.orderStatus.${data.status}`)}\n` +
          `• ${t("purchase.total")}: ${formatCurrency(data.totalAmount, i18n.language)}\n` +
          `• ${t("purchase.message")}: ${data.message}\n`;
        alert(msg);
      } catch {
        // If parse fail, then is plain text
        const msg =
          `${t("purchase.backendSays")}:\n\n` + `• ${t("purchase.message")}: ${rawText}\n`;
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
