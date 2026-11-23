"use server";

import { revalidatePath } from "next/cache";
import { guardAdminAction } from "@/lib/admin-auth";
import { sentryErrorReport } from "@/lib/sentry";
import { createAdminClient } from "@/lib/supabase/admin";

export async function markContactReadAction(id: string) {
  const authError = await guardAdminAction();
  if (authError) return { error: authError };
  const { error } = await createAdminClient()
    .from("contact_messages")
    .update({ status: "read" })
    .eq("id", id);
  if (error) {
    sentryErrorReport(error, "CONTACT_ACTION - MARK_READ");
    return { error: "No se pudo marcar el mensaje como leído." };
  }
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contact");
  return { success: true };
}

export async function deleteContactMessageAction(id: string) {
  const authError = await guardAdminAction();
  if (authError) return { error: authError };
  const { error } = await createAdminClient()
    .from("contact_messages")
    .delete()
    .eq("id", id);
  if (error) {
    sentryErrorReport(error, "CONTACT_ACTION - DELETE");
    return { error: "No se pudo eliminar el mensaje." };
  }
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contact");
  return { success: true };
}
