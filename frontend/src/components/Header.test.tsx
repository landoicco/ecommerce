import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import i18n from "@/i18n";
import Header from "./Header";

function renderHeader() {
  render(<Header searchQuery="" onSearchChange={vi.fn()} onOpenCreate={vi.fn()} />);
}

describe("Header language switcher", () => {
  afterEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("marks the active language as pressed", () => {
    renderHeader();

    expect(screen.getByRole("button", { name: "en" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "es" })).toHaveAttribute("aria-pressed", "false");
  });

  it("switches the UI to Spanish, remembers it and updates the page language", () => {
    renderHeader();

    fireEvent.click(screen.getByRole("button", { name: "es" }));

    expect(screen.getByText("Agregar artículo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "es" })).toHaveAttribute("aria-pressed", "true");
    expect(localStorage.getItem("locale")).toBe("es-MX");
    expect(document.documentElement.lang).toBe("es-MX");
  });
});
