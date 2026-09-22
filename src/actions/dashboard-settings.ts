"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { sentryErrorReport } from "@/lib/sentry";
import { createAdminClient } from "@/lib/supabase/admin";

const settingsSchema = z.object({
  whatsappNumber: z.string().trim().min(8).max(20),
  whatsappProductMessage: z.string().trim().min(10).max(1000),
});

export type SettingsActionState = { success?: true; error?: string };

export async function updateSiteSettings(
  _previous: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse({
    whatsappNumber: formData.get("whatsappNumber"),
    whatsappProductMessage: formData.get("whatsappProductMessage"),
  });
  if (!parsed.success) return { error: "Revisa el número y el mensaje." };

  const digits = parsed.data.whatsappNumber.replace(/\D/g, "");
  const whatsappNumber = digits.length === 8 ? `502${digits}` : digits;
  if (whatsappNumber.length < 10 || whatsappNumber.length > 15)
    return { error: "Revisa el número y el mensaje." };

  const { error } = await createAdminClient().from("site_settings").upsert({
    id: 1,
    whatsapp_number: whatsappNumber,
    whatsapp_product_message: parsed.data.whatsappProductMessage,
  });
  if (error) {
    sentryErrorReport(error, "SITE_SETTINGS_ACTION - UPDATE");
    return { error: "No se pudo guardar la configuración." };
  }
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/dashboard/settings");
  return { success: true };
}
