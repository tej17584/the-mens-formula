"use server";

import { revalidatePath } from "next/cache";
import { guardAdminAction } from "@/lib/admin-auth";
import { sentryErrorReport } from "@/lib/sentry";
import { parseSiteSettingsForm } from "@/lib/site-settings-form";
import { createAdminClient } from "@/lib/supabase/admin";

export type SettingsActionState = { success?: true; error?: string };

export async function updateSiteSettings(
  _previous: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const authError = await guardAdminAction();
  if (authError) return { error: authError };
  const parsed = parseSiteSettingsForm(formData);
  if (!parsed.success) return { error: parsed.error };

  const { error } = await createAdminClient().from("site_settings").upsert({
    id: 1,
    whatsapp_number: parsed.data.whatsappNumber,
    whatsapp_product_message: parsed.data.whatsappProductMessage,
    instagram_url: parsed.data.instagramUrl,
    facebook_url: parsed.data.facebookUrl,
    tiktok_url: parsed.data.tiktokUrl,
  });
  if (error) {
    sentryErrorReport(error, "SITE_SETTINGS_ACTION - UPDATE");
    return { error: "No se pudo guardar la configuración." };
  }
  revalidatePath("/", "layout");
  revalidatePath("/catalogo");
  revalidatePath("/contacto");
  revalidatePath("/dashboard/settings");
  return { success: true };
}
