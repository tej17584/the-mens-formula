import "server-only";

import { sentryErrorReport } from "@/lib/sentry";

export function isTurnstileEnabled() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstileToken(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: token,
          remoteip: ip,
        }),
      },
    );
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    sentryErrorReport(error, "CONTACT_ACTION - TURNSTILE");
    return false;
  }
}