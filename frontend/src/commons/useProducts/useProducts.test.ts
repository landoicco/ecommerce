import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useProducts } from "./useProducts";

describe("useProducts Hook", () => {
  beforeEach(() => {
    // Register mock function for fetch
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should fetch products from page 0 and format URL correctly on initialization", async () => {
    const mockBackendResponse = {
      content: [{ id: 1, name: "Product A", sku: "SKU-A", price: 10, stock: 5, weightKg: 1 }],
      totalPages: 3,
    };

    // Mock correct response type
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockBackendResponse,
    } as Response);

    const { result } = renderHook(() => useProducts(""));

    await waitFor(() => {
      expect(result.current.products).toHaveLength(1);
    });

    // Validate fetch
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/catalog?size=12&page=0&sortBy=price&sortDir=desc")
    );

    expect(result.current.page).toBe(1);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should encode search parameters using encodeURIComponent in the URL", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ content: [] }),
    } as Response);

    const searchTerm = "tech & tools";
    renderHook(() => useProducts(searchTerm));

    const expectedEncodedQuery = "tech%20%26%20tools";

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`&search=${expectedEncodedQuery}`)
      );
    });
  });

  it("should handle server errors gracefully and populate the error state", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    } as Response);

    const { result } = renderHook(() => useProducts(""));

    await waitFor(() => {
      expect(result.current.error).toBe("Failed to fetch products");
    });

    expect(result.current.products).toHaveLength(0);
  });
});
