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

export type ReferenceActionState = { success?: true; error?: string };

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

async function createReference(
  kind: "brand" | "category",
  _previous: ReferenceActionState,
  formData: FormData,
): Promise<ReferenceActionState> {
  await requireAdmin();
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
  return { success: true };
}

export const createBrandAction = createReference.bind(null, "brand");
export const createCategoryAction = createReference.bind(null, "category");
