import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BuyModal from "./BuyModal";
import type { Product } from "@/commons/types";

const mockProduct: Product = {
  id: 1,
  name: "Laptop Pro",
  sku: "LAP-001",
  description: "High performance laptop",
  category: "Electronics",
  price: 1000,
  stock: 2,
  weightKg: 2,
};

describe("BuyModal Component", () => {
  it("should not allow increasing quantity beyond available stock", () => {
    const mockOnConfirm = vi.fn();
    const mockOnClose = vi.fn();

    // Render component, isolated
    render(<BuyModal product={mockProduct} onClose={mockOnClose} onConfirm={mockOnConfirm} />);

    // Search input and (+) on screen
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    const buttonPlus = screen.getByText("+");

    // Simulate clicks
    fireEvent.click(buttonPlus); // Change to 2
    expect(input.value).toBe("2");

    // Try a second click, should not work
    fireEvent.click(buttonPlus);
    expect(input.value).toBe("2"); // Stays at 2
    expect(buttonPlus).toBeDisabled();
  });

  it("should calculate the total price dynamically", () => {
    render(<BuyModal product={mockProduct} onClose={() => {}} onConfirm={() => {}} />);

    const buttonPlus = screen.getByText("+");
    fireEvent.click(buttonPlus);

    const totalText = screen.getByText("$2000.00");
    expect(totalText).toBeInTheDocument();
  });

  it("should not allow decreasing quantity below 1", () => {
    render(<BuyModal product={mockProduct} onClose={() => {}} onConfirm={vi.fn()} />);

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    const buttonMinus = screen.getByText("-");

    // 1 is the default
    expect(input.value).toBe("1");

    // Minus button should be disabled
    expect(buttonMinus).toBeDisabled();

    // Clicking on minus button, must stay as 1
    fireEvent.click(buttonMinus);
    expect(input.value).toBe("1");
  });

  it("should fix invalid numbers typed by the user on blur", () => {
    render(<BuyModal product={mockProduct} onClose={() => {}} onConfirm={vi.fn()} />);

    const input = screen.getByRole("spinbutton") as HTMLInputElement;

    // Simulate incorrect input
    fireEvent.change(input, { target: { value: "" } });

    // Should be reset to 1
    fireEvent.blur(input);
    expect(input.value).toBe("1");
  });

  it("should trigger onClose when clicking cancel or the close button", () => {
    const mockOnClose = vi.fn();
    render(<BuyModal product={mockProduct} onClose={mockOnClose} onConfirm={vi.fn()} />);

    const buttonCancel = screen.getByText("Cancel");
    const buttonX = screen.getByText("✕");

    // Test cancel button
    fireEvent.click(buttonCancel);
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    // Test 'x' button
    fireEvent.click(buttonX);
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });

  it("should trigger onConfirm with the selected product and quantity", () => {
    const mockOnConfirm = vi.fn();
    render(<BuyModal product={mockProduct} onClose={() => {}} onConfirm={mockOnConfirm} />);

    const buttonPlus = screen.getByText("+");
    const buttonConfirm = screen.getByText("Confirm Buy");

    // Select 2 units
    fireEvent.click(buttonPlus);

    // Confirm purchase
    fireEvent.click(buttonConfirm);

    // Verify object was sent with 2 units
    expect(mockOnConfirm).toHaveBeenCalledWith(mockProduct, 2);
  });
});
