"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { guardAdminAction } from "@/lib/admin-auth";
import { sentryErrorReport } from "@/lib/sentry";
import { createAdminClient } from "@/lib/supabase/admin";

export type ContactMessageActionState = {
  success?: true;
  error?: string;
};

const contactMessageId = z.string().uuid();

function refreshContactViews() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contact");
}

export async function markContactReadAction(
  id: string,
): Promise<ContactMessageActionState> {
  try {
    const parsedId = contactMessageId.safeParse(id);
    if (!parsedId.success) {
      return { error: "No se pudo marcar el mensaje como leído." };
    }
    const authError = await guardAdminAction();
    if (authError) return { error: authError };
    const { error } = await createAdminClient()
      .from("contact_messages")
      .update({ status: "read" })
      .eq("id", parsedId.data);
    if (error) {
      sentryErrorReport(error, "CONTACT_ACTION - MARK_READ");
      return { error: "No se pudo marcar el mensaje como leído." };
    }
    refreshContactViews();
    return { success: true };
  } catch (error) {
    sentryErrorReport(error, "CONTACT_ACTION - MARK_READ");
    return { error: "No se pudo marcar el mensaje como leído." };
  }
}

export async function deleteContactMessageAction(
  id: string,
): Promise<ContactMessageActionState> {
  try {
    const parsedId = contactMessageId.safeParse(id);
    if (!parsedId.success) {
      return { error: "No se pudo eliminar el mensaje." };
    }
    const authError = await guardAdminAction();
    if (authError) return { error: authError };
    const { error } = await createAdminClient()
      .from("contact_messages")
      .delete()
      .eq("id", parsedId.data);
    if (error) {
      sentryErrorReport(error, "CONTACT_ACTION - DELETE");
      return { error: "No se pudo eliminar el mensaje." };
    }
    refreshContactViews();
    return { success: true };
  } catch (error) {
    sentryErrorReport(error, "CONTACT_ACTION - DELETE");
    return { error: "No se pudo eliminar el mensaje." };
  }
}

