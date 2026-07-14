import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProductCard from "./ProductCard";
import type { Product } from "@/commons/types";

const mockProduct: Product = {
  id: 42,
  name: "Premium Mechanical Keyboard",
  sku: "KEY-MX80",
  description: "RGB Mechanical keyboard with blue switches.",
  category: "Peripherals",
  price: 89.99,
  stock: 5,
  weightKg: 1.2,
};

describe("ProductCard Component", () => {
  it("should render all product details correctly", () => {
    render(
      <ProductCard product={mockProduct} onDelete={vi.fn()} onEdit={vi.fn()} onBuy={vi.fn()} />
    );

    // Verify data is showed
    expect(screen.getByText("Premium Mechanical Keyboard")).toBeInTheDocument();
    expect(screen.getByText("KEY-MX80")).toBeInTheDocument();
    expect(screen.getByText("Peripherals")).toBeInTheDocument();
    expect(screen.getByText("5 u")).toBeInTheDocument();
    expect(screen.getByText("1.2 kg")).toBeInTheDocument();

    // Verify price format is correct
    expect(screen.getByText("$89.99")).toBeInTheDocument();
  });

  it("should handle out of stock status gracefully", () => {
    const outOfStockProduct: Product = {
      ...mockProduct,
      stock: 0, // No stock
    };

    render(
      <ProductCard
        product={outOfStockProduct}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
        onBuy={vi.fn()}
      />
    );

    // Should change to 'out of stock'
    expect(screen.getByText("Out of stock")).toBeInTheDocument();

    // Button should change text and be disabled
    const buyButton = screen.getByRole("button", { name: "Sold Out" });
    expect(buyButton).toBeInTheDocument();
    expect(buyButton).toBeDisabled();
  });

  it("should trigger onBuy when clicking the buy button", () => {
    const mockOnBuy = vi.fn();
    render(
      <ProductCard product={mockProduct} onDelete={vi.fn()} onEdit={vi.fn()} onBuy={mockOnBuy} />
    );

    const buyButton = screen.getByRole("button", { name: "Buy" });
    fireEvent.click(buyButton);

    // Verify complete object is sent
    expect(mockOnBuy).toHaveBeenCalledTimes(1);
    expect(mockOnBuy).toHaveBeenCalledWith(mockProduct);
  });

  it("should trigger onEdit and onDelete admin actions correctly", () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <ProductCard
        product={mockProduct}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onBuy={vi.fn()}
      />
    );

    const editButton = screen.getByText("Edit");
    const deleteButton = screen.getByText("Delete");

    // Test edit button
    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledWith(mockProduct);

    // Test delete button, where only product.id is used
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(mockProduct.id);
  });
});
