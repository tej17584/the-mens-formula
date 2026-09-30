import { describe, expect, it } from "vitest";
import {
  numberOrNull,
  parseProductFormData,
  productRowValues,
} from "@/lib/dashboard/product-form-values";

const brandId = "4046de1d-4e13-4efa-8fe5-e8e7ea2821f6";
const categoryId = "fdf1781c-a659-4ef2-ae6c-9693cc478e9c";

function form(entries: Record<string, string | undefined>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    if (value !== undefined) formData.set(key, value);
  }
  return formData;
}

describe("parseProductFormData", () => {
  it("reads checkbox flags as false when absent", () => {
    const parsed = parseProductFormData(
      form({
        name: "Test product",
        brandId,
        categoryId,
        consumerPrice: "120",
      }),
    );
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.isActive).toBe(false);
    expect(parsed.data.isAvailable).toBe(false);
  });

  it("reads checkbox flags as true when value is on", () => {
    const parsed = parseProductFormData(
      form({
        name: "Test product",
        brandId,
        categoryId,
        isActive: "on",
        isAvailable: "on",
      }),
    );
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.isActive).toBe(true);
    expect(parsed.data.isAvailable).toBe(true);
  });

  it("maps prices and detail lines for persistence", () => {
    const parsed = parseProductFormData(
      form({
        name: "Pomade",
        brandId,
        categoryId,
        consumerPrice: "98",
        distributorPrice: "49",
        details: "Line one\n\nLine two",
        isActive: "on",
      }),
    );
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const row = productRowValues(parsed.data);
    expect(row.consumer_price).toBe(98);
    expect(row.price).toBe(98);
    expect(row.is_active).toBe(true);
    expect(row.is_available).toBe(false);
    expect(row.detail_points).toEqual(["Line one", "Line two"]);
  });
});

describe("numberOrNull", () => {
  it("returns null for empty or invalid numbers", () => {
    expect(numberOrNull("")).toBeNull();
    expect(numberOrNull("   ")).toBeNull();
    expect(numberOrNull("abc")).toBeNull();
  });
});
