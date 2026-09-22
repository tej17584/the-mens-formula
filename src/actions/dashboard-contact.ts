"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { sentryErrorReport } from "@/lib/sentry";
import { createAdminClient } from "@/lib/supabase/admin";

export async function markContactReadAction(id: string) {
  await requireAdmin();
  const { error } = await createAdminClient()
    .from("contact_messages")
    .update({ status: "read" })
    .eq("id", id);
  if (error) {
    sentryErrorReport(error, "CONTACT_ACTION - MARK_READ");
    return;
  }
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contact");
  return;
}
