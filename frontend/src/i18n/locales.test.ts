import { describe, it, expect } from "vitest";
import { resources } from "@/i18n";

type Catalog = { [key: string]: string | Catalog };

function flattenKeys(catalog: Catalog, prefix = ""): string[] {
  return Object.entries(catalog).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? [path] : flattenKeys(value, path);
  });
}

function placeholders(text: string): string[] {
  return [...text.matchAll(/{{\s*(\w+)/g)].map((m) => m[1]).sort();
}

function valueAt(catalog: Catalog, path: string): string {
  return path
    .split(".")
    .reduce<Catalog | string>((node, key) => (node as Catalog)[key], catalog) as string;
}

// English is the reference: a missing or extra key in any locale fails CI instead of
// showing a raw key or an English fallback to users
describe("Locale catalogs", () => {
  const reference = resources.en.translation as Catalog;
  const referenceKeys = flattenKeys(reference).sort();

  describe.each(Object.entries(resources))("%s", (_, { translation }) => {
    const catalog = translation as Catalog;

    it("has exactly the same keys as the English catalog", () => {
      expect(flattenKeys(catalog).sort()).toEqual(referenceKeys);
    });

    it("has no empty translations", () => {
      const empty = referenceKeys.filter((key) => valueAt(catalog, key).trim() === "");
      expect(empty).toEqual([]);
    });

    it("keeps the same interpolation placeholders", () => {
      for (const key of referenceKeys) {
        expect(placeholders(valueAt(catalog, key)), key).toEqual(
          placeholders(valueAt(reference, key))
        );
      }
    });
  });
});
