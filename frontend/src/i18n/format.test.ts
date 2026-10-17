import { describe, it, expect } from "vitest";
import { formatCurrency, formatWeightKg } from "./format";

describe("formatCurrency", () => {
  it.each(["en", "es-MX"])("shows pesos with a plain $ sign in %s", (locale) => {
    expect(formatCurrency(1250, locale)).toBe("$1,250.00");
  });
});

describe("formatWeightKg", () => {
  it.each(["en", "es-MX"])("uses the locale's unit format in %s", (locale) => {
    expect(formatWeightKg(1.2, locale)).toBe("1.2 kg");
  });
});
