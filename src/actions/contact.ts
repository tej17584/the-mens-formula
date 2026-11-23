"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { translate } from "@/i18n";
import {
  isContactSpam,
  isHoneypotTriggered,
  isImplausibleFormTiming,
} from "@/lib/contact-spam";
import { sentryErrorReport } from "@/lib/sentry";
import { createAdminClient } from "@/lib/supabase/admin";
import { isTurnstileEnabled, verifyTurnstileToken } from "@/lib/turnstile";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  contact: z.string().trim().min(3).max(180),
  message: z.string().trim().min(3).max(3000),
});

export type ContactActionState = { success?: true; error?: string };

const rateLimitMaxPerHour = 3;
const rateLimitMinIntervalMs = 2 * 60 * 1000;

function silentSuccess(): ContactActionState {
  return { success: true };
}

async function readClientIp() {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headerList.get("x-real-ip") ?? "unknown";
}

async function isRateLimited(sourceIp: string) {
  const supabase = createAdminClient();
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("source_ip", sourceIp)
    .gte("created_at", hourAgo);
  if (error) {
    sentryErrorReport(error, "CONTACT_ACTION - RATE_LIMIT");
    return false;
  }
  if ((count ?? 0) >= rateLimitMaxPerHour) return true;

  const { data: latest, error: latestError } = await supabase
    .from("contact_messages")
    .select("created_at")
    .eq("source_ip", sourceIp)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (latestError) {
    sentryErrorReport(latestError, "CONTACT_ACTION - RATE_LIMIT_INTERVAL");
    return false;
  }
  if (!latest?.created_at) return false;
  return Date.now() - new Date(latest.created_at).getTime() < rateLimitMinIntervalMs;
}

export async function createContactMessage(
  _previousState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  if (isHoneypotTriggered(formData)) return silentSuccess();
  if (isImplausibleFormTiming(formData.get("formStartedAt"))) {
    return silentSuccess();
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    contact: formData.get("contact"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { error: translate("contact.error") };
  if (isContactSpam(parsed.data)) return silentSuccess();

  const sourceIp = await readClientIp();
  if (isTurnstileEnabled()) {
    const token =
      (formData.get("cf-turnstile-response") as string | null) ??
      (formData.get("turnstileToken") as string | null) ??
      "";
    const valid = await verifyTurnstileToken(token, sourceIp);
    if (!valid) return { error: translate("contact.captchaFailed") };
  }

  if (await isRateLimited(sourceIp)) {
    return { error: translate("contact.rateLimited") };
  }

  try {
    const { error } = await createAdminClient()
      .from("contact_messages")
      .insert({ ...parsed.data, source_ip: sourceIp });
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