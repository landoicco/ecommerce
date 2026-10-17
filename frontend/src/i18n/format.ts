// Prices are always in the marketplace's currency, whatever language the UI is in
const CURRENCY = "MXN";

// narrowSymbol prints "$" instead of "MX$" in English, which is how prices read in Mexico
export function formatCurrency(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: CURRENCY,
    currencyDisplay: "narrowSymbol",
  }).format(amount);
}

export function formatWeightKg(kg: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "unit", unit: "kilogram" }).format(kg);
}
