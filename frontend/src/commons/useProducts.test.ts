import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useProducts } from "./useProducts";

describe("useProducts Hook", () => {
  // Save reference to restore it later
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    // Restore native fetch
    global.fetch = originalFetch;
  });

  it("should fetch products from page 0 and format URL correctly on initialization", async () => {
    const mockBackendResponse = {
      content: [{ id: 1, name: "Product A", sku: "SKU-A", price: 10, stock: 5, weightKg: 1 }],
      totalPages: 3,
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBackendResponse,
    });

    // Render hook isolated, with empty search query
    const { result } = renderHook(() => useProducts(""));

    await waitFor(() => {
      expect(result.current.products).toHaveLength(1);
    });

    // Verify the URL is as expected by the backend, for backend, page 0 is page 1
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/catalog?size=12&page=0&sortBy=price&sortDir=desc")
    );

    // Verify pagination initial state
    expect(result.current.page).toBe(1);
    expect(result.current.hasMore).toBe(false); // Mock DB return only 1 product
    expect(result.current.error).toBeNull();
  });

  it("should encode search parameters using encodeURIComponent in the URL", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ content: [] }),
    });

    const searchTerm = "tech & tools";
    renderHook(() => useProducts(searchTerm));

    const expectedEncodedQuery = "tech%20%26%20tools";

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`&search=${expectedEncodedQuery}`)
      );
    });
  });
});
