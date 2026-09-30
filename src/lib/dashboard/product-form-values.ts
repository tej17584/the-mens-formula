import { z } from "zod";

const textField = z.string().trim();

export const productFormSchema = z.object({
  name: textField.min(2).max(160),
  brandId: z.string().uuid(),
  categoryId: z.string().uuid(),
  description: textField.max(5000),
  shortDescription: textField.max(280),
  details: textField.max(5000),
  stock: textField.max(32),
  consumerPrice: textField.max(64),
  distributorPrice: textField.max(64),
  price3Plus: textField.max(64),
  price6Plus: textField.max(64),
  boxPrice: textField.max(64),
  isAvailable: z.boolean(),
  isActive: z.boolean(),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;

export function numberOrNull(value: string) {
  if (!value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function parseCheckbox(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

export function parseProductFormData(formData: FormData) {
  return productFormSchema.safeParse({
    name: formData.get("name"),
    brandId: formData.get("brandId"),
    categoryId: formData.get("categoryId"),
    description: formData.get("description") ?? "",
    shortDescription: formData.get("shortDescription") ?? "",
    details: formData.get("details") ?? "",
    stock: formData.get("stock") ?? "",
    consumerPrice: formData.get("consumerPrice") ?? "",
    distributorPrice: formData.get("distributorPrice") ?? "",
    price3Plus: formData.get("price3Plus") ?? "",
    price6Plus: formData.get("price6Plus") ?? "",
    boxPrice: formData.get("boxPrice") ?? "",
    isAvailable: parseCheckbox(formData, "isAvailable"),
    isActive: parseCheckbox(formData, "isActive"),
  });
}

export const MAX_DETAIL_POINTS = 5;

export function capDetailLines(value: string) {
  const lines = value.split("\n");
  if (lines.length <= MAX_DETAIL_POINTS) return value;
  return lines.slice(0, MAX_DETAIL_POINTS).join("\n");
}

export function productRowValues(input: ProductFormInput) {
  return {
    name: input.name,
    brand_id: input.brandId,
    category_id: input.categoryId,
    description: input.description || null,
    short_description: input.shortDescription || null,
    detail_points: input.details
      .split("\n")
      .map((point) => point.trim())
      .filter(Boolean)
      .slice(0, MAX_DETAIL_POINTS),
    stock: numberOrNull(input.stock),
    consumer_price: numberOrNull(input.consumerPrice),
    price: numberOrNull(input.consumerPrice),
    price_3_plus: numberOrNull(input.price3Plus),
    price_6_plus: numberOrNull(input.price6Plus),
    box_price: numberOrNull(input.boxPrice),
    is_available: input.isAvailable,
    is_active: input.isActive,
  };
}
