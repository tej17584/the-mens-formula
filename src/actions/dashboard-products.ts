"use server";

import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { sentryErrorReport } from "@/lib/sentry";
import { createAdminClient } from "@/lib/supabase/admin";

export type DashboardActionState = {
  success?: boolean;
  error?: string;
};

const textField = z.string().trim();
const maxUploadBytes = 5 * 1024 * 1024;
const productSchema = z.object({
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

function message(): DashboardActionState {
  return {
    error: "No se pudo guardar. Revisa los campos e inténtalo otra vez.",
  };
}

function numberOrNull(value: string) {
  if (!value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getProductInput(formData: FormData) {
  return productSchema.safeParse({
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
    isAvailable: formData.get("isAvailable") === "on",
    isActive: formData.get("isActive") === "on",
  });
}

function getFiles(formData: FormData) {
  return formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function hasInvalidImage(files: File[]) {
  return files.some(
    (file) =>
      file.size > maxUploadBytes ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type),
  );
}

function storagePath(productId: string, imageUrl: string) {
  try {
    const marker = "/products/";
    const path = new URL(imageUrl).pathname;
    const start = path.indexOf(marker);
    const candidate = start >= 0 ? path.slice(start + marker.length) : "";
    return candidate.startsWith(`${productId}/`) ? candidate : null;
  } catch {
    return null;
  }
}

async function uploadImages(productId: string, files: File[], offset: number) {
  const supabase = createAdminClient();
  const images: {
    product_id: string;
    image_url: string;
    alt_text: string;
    sort_order: number;
  }[] = [];

  for (const [index, file] of files.entries()) {
    try {
      const bytes = Buffer.from(await file.arrayBuffer());
      const optimized = await sharp(bytes)
        .rotate()
        .resize({
          width: 1800,
          height: 1800,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 86 })
        .toBuffer();
      const filename = `${offset + index + 1}.webp`;
      const path = `${productId}/${filename}`;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(path, optimized, {
          contentType: "image/webp",
          cacheControl: "31536000",
          upsert: false,
        });
      if (uploadError) {
        sentryErrorReport(uploadError, "PRODUCT_IMAGES - UPLOAD");
        throw new Error("UPLOAD_FAILED");
      }
      const { data } = supabase.storage.from("products").getPublicUrl(path);
      images.push({
        product_id: productId,
        image_url: data.publicUrl,
        alt_text: file.name.slice(0, 220),
        sort_order: offset + index,
      });
    } catch (error) {
      if (!(error instanceof Error && error.message === "UPLOAD_FAILED")) {
        sentryErrorReport(error, "PRODUCT_IMAGES - PROCESS");
      }
      throw error;
    }
  }

  if (!images.length) return [];
  const { error } = await supabase.from("product_images").insert(images);
  if (error) {
    sentryErrorReport(error, "PRODUCT_IMAGES - CREATE_RECORDS");
    throw new Error("IMAGE_RECORDS_FAILED");
  }
  return images;
}

async function updateMainImage(productId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("product_id", productId)
    .order("sort_order")
    .limit(1)
    .maybeSingle();
  if (error) {
    sentryErrorReport(error, "PRODUCT_IMAGES - MAIN_QUERY");
    throw error;
  }
  const { error: updateError } = await supabase
    .from("products")
    .update({ main_image_url: data?.image_url ?? null })
    .eq("id", productId);
  if (updateError) {
    sentryErrorReport(updateError, "PRODUCT_IMAGES - MAIN_UPDATE");
    throw updateError;
  }
}

function productValues(input: z.infer<typeof productSchema>) {
  return {
    name: input.name,
    brand_id: input.brandId,
    category_id: input.categoryId,
    description: input.description || null,
    short_description: input.shortDescription || null,
    detail_points: input.details
      .split("\n")
      .map((point) => point.trim())
      .filter(Boolean),
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

function refreshProductPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
  if (slug) revalidatePath(`/catalogo/${slug}`);
}

export async function createProductAction(
  _previous: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  await requireAdmin();
  const parsed = getProductInput(formData);
  const files = getFiles(formData);
  if (
    !parsed.success ||
    !files.length ||
    files.length > 3 ||
    hasInvalidImage(files)
  )
    return message();

  const supabase = createAdminClient();
  const values = {
    ...productValues(parsed.data),
    // The database trigger replaces both temporary values with the next
    // immutable, short SKU and its matching public slug.
    sku: "TMF-PENDING",
    slug: "pending",
  };
  const { data: product, error } = await supabase
    .from("products")
    .insert(values)
    .select("id,slug")
    .single();
  if (error || !product) {
    if (error) sentryErrorReport(error, "PRODUCT_ACTION - CREATE");
    return message();
  }

  const distributorPrice = numberOrNull(parsed.data.distributorPrice);
  if (distributorPrice !== null) {
    const { error: internalError } = await supabase
      .from("product_internal")
      .insert({
        product_id: product.id,
        distributor_unit_price: distributorPrice,
      });
    if (internalError) {
      sentryErrorReport(internalError, "PRODUCT_ACTION - CREATE_INTERNAL");
      await supabase.from("products").delete().eq("id", product.id);
      return message();
    }
  }

  try {
    await uploadImages(product.id, files, 0);
    await updateMainImage(product.id);
  } catch {
    await supabase.from("products").delete().eq("id", product.id);
    return message();
  }

  refreshProductPaths(product.slug);
  return { success: true };
}

export async function updateProductAction(
  productId: string,
  _previous: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  await requireAdmin();
  const parsed = getProductInput(formData);
  const files = getFiles(formData);
  const removedIds = formData
    .getAll("removeImageId")
    .filter((value): value is string => typeof value === "string");
  if (!parsed.success || files.length > 3 || hasInvalidImage(files))
    return message();

  const supabase = createAdminClient();
  const { data: existing, error: existingError } = await supabase
    .from("product_images")
    .select("id,image_url,sort_order")
    .eq("product_id", productId)
    .order("sort_order");
  if (existingError) {
    sentryErrorReport(existingError, "PRODUCT_IMAGES - QUERY");
    return message();
  }
  const retained = (existing ?? []).filter(
    (image) => !removedIds.includes(image.id),
  );
  if (!retained.length && !files.length) return message();
  if (retained.length + files.length > 3) return message();

  const values = productValues(parsed.data);
  const { data: product, error } = await supabase
    .from("products")
    .update(values)
    .eq("id", productId)
    .select("slug")
    .single();
  if (error || !product) {
    if (error) sentryErrorReport(error, "PRODUCT_ACTION - UPDATE");
    return message();
  }

  const distributorPrice = numberOrNull(parsed.data.distributorPrice);
  const { error: internalError } = await supabase
    .from("product_internal")
    .upsert({
      product_id: productId,
      distributor_unit_price: distributorPrice,
    });
  if (internalError) {
    sentryErrorReport(internalError, "PRODUCT_ACTION - UPDATE_INTERNAL");
    return message();
  }

  const removed = (existing ?? []).filter((image) =>
    removedIds.includes(image.id),
  );
  if (removed.length) {
    const paths = removed
      .map((image) => storagePath(productId, image.image_url))
      .filter((path): path is string => Boolean(path));
    if (paths.length) {
      const { error: storageError } = await supabase.storage
        .from("products")
        .remove(paths);
      if (storageError) {
        sentryErrorReport(storageError, "PRODUCT_IMAGES - DELETE");
        return message();
      }
    }
    const { error: deleteError } = await supabase
      .from("product_images")
      .delete()
      .in("id", removedIds)
      .eq("product_id", productId);
    if (deleteError) {
      sentryErrorReport(deleteError, "PRODUCT_IMAGES - DELETE_RECORDS");
      return message();
    }
  }

  try {
    if (files.length) await uploadImages(productId, files, retained.length);
    await updateMainImage(productId);
  } catch {
    return message();
  }
  refreshProductPaths(product.slug);
  return { success: true };
}

export async function setProductVisibility(
  productId: string,
  isActive: boolean,
) {
  await requireAdmin();
  const { data, error } = await createAdminClient()
    .from("products")
    .update({ is_active: isActive })
    .eq("id", productId)
    .select("slug")
    .single();
  if (error) {
    sentryErrorReport(error, "PRODUCT_ACTION - VISIBILITY");
    return { error: "No se pudo actualizar la visibilidad." };
  }
  refreshProductPaths(data.slug);
  return { success: true };
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("slug,images:product_images(image_url)")
    .eq("id", productId)
    .maybeSingle();
  if (productError) {
    sentryErrorReport(productError, "PRODUCT_ACTION - DELETE_QUERY");
    return { error: "No se pudo eliminar el producto." };
  }
  if (!product) return { error: "No se encontró el producto." };
  const paths = (product.images ?? [])
    .map((image) => storagePath(productId, image.image_url))
    .filter((path): path is string => Boolean(path));
  if (paths.length) {
    const { error: storageError } = await supabase.storage
      .from("products")
      .remove(paths);
    if (storageError) {
      sentryErrorReport(storageError, "PRODUCT_IMAGES - DELETE");
      return { error: "No se pudieron eliminar las imágenes del producto." };
    }
  }
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);
  if (error) {
    sentryErrorReport(error, "PRODUCT_ACTION - DELETE");
    return { error: "No se pudo eliminar el producto." };
  }
  refreshProductPaths(product.slug);
  return { success: true };
}
