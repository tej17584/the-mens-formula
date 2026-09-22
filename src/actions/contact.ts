"use server";

import { z } from "zod";
import { translate } from "@/i18n";
import { sentryErrorReport } from "@/lib/sentry";
import { createAdminClient } from "@/lib/supabase/admin";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  contact: z.string().trim().min(3).max(180),
  message: z.string().trim().min(3).max(3000),
});

export type ContactActionState = { success?: true; error?: string };

export async function createContactMessage(
  _previousState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    contact: formData.get("contact"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { error: translate("contact.error") };

  try {
    const { error } = await createAdminClient()
      .from("contact_messages")
      .insert(parsed.data);
    if (error) {
      sentryErrorReport(error, "CONTACT_ACTION - CREATE");
      return { error: translate("contact.error") };
    }
    return { success: true };
  } catch (error) {
    sentryErrorReport(error, "CONTACT_ACTION - CREATE");
    return { error: translate("contact.error") };
  }
}
