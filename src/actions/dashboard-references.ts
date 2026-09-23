"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { translate } from "@/i18n";
import { requireAdmin } from "@/lib/admin-auth";
import { sentryErrorReport } from "@/lib/sentry";
import { createAdminClient } from "@/lib/supabase/admin";

const referenceSchema = z.object({
  name: z.string().trim().min(2).max(100),
});

export type ReferenceActionState = {
  success?: "created" | "deleted";
  error?: string;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

async function referenceAction(
  kind: "brand" | "category",
  _previous: ReferenceActionState,
  formData: FormData,
): Promise<ReferenceActionState> {
  await requireAdmin();
  const intent = formData.get("intent");
  if (intent === "delete") return deleteReference(kind, formData);

  const parsed = referenceSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success)
    return { error: translate("dashboard.referenceInvalid") };

  const name = parsed.data.name;
  const slug = slugify(name);
  if (!slug) return { error: translate("dashboard.referenceInvalid") };

  const supabase = createAdminClient();
  const result =
    kind === "brand"
      ? await supabase.from("brands").insert({ name, slug })
      : await supabase.from("categories").insert({ name, slug });

  if (result.error) {
    sentryErrorReport(
      result.error,
      kind === "brand" ? "BRAND_ACTION - CREATE" : "CATEGORY_ACTION - CREATE",
    );
    return { error: translate("dashboard.referenceCreateFailed") };
  }

  revalidatePath("/dashboard/catalog");
  revalidatePath("/dashboard/products/new");
  revalidatePath("/dashboard/products");
  return { success: "created" };
}

async function deleteReference(kind: "brand" | "category", formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return { error: translate("dashboard.referenceInvalid") };

  const supabase = createAdminClient();
  const foreignKey = kind === "brand" ? "brand_id" : "category_id";
  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq(foreignKey, id.data);

  if (countError) {
    sentryErrorReport(
      countError,
      kind === "brand"
        ? "BRAND_QUERY - PRODUCT_USAGE"
        : "CATEGORY_QUERY - PRODUCT_USAGE",
    );
    return { error: translate("dashboard.referenceDeleteFailed") };
  }
  if ((count ?? 0) > 0) return { error: translate("dashboard.referenceInUse") };

  const table = kind === "brand" ? "brands" : "categories";
  const { error } = await supabase.from(table).delete().eq("id", id.data);
  if (error) {
    sentryErrorReport(
      error,
      kind === "brand" ? "BRAND_ACTION - DELETE" : "CATEGORY_ACTION - DELETE",
    );
    return {
      error:
        error.code === "23503"
          ? translate("dashboard.referenceInUse")
          : translate("dashboard.referenceDeleteFailed"),
    };
  }

  revalidatePath("/dashboard/catalog");
  revalidatePath("/dashboard/products/new");
  revalidatePath("/dashboard/products");
  return { success: "deleted" as const };
}

/**
 * Keep the actions as named exports instead of bound functions. Besides making
 * their server-action manifest entries explicit, this leaves a clearer trace in
 * production diagnostics and avoids relying on a runtime-bound reference.
 */
export async function manageBrandAction(
  previousState: ReferenceActionState,
  formData: FormData,
): Promise<ReferenceActionState> {
  return referenceAction("brand", previousState, formData);
}

export async function manageCategoryAction(
  previousState: ReferenceActionState,
  formData: FormData,
): Promise<ReferenceActionState> {
  return referenceAction("category", previousState, formData);
}
