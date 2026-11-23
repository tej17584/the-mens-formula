import "server-only";

import { redirect } from "next/navigation";
import { getSessionId } from "@/lib/dashboard-session";
import { sentryErrorReport } from "@/lib/sentry";
import { getVerifiedClaims } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const adminSessionErrors = {
  login: "Tu sesión expiró. Vuelve a iniciar sesión.",
  denied: "No tienes permiso para realizar esta acción.",
  expired: "Tu sesión del panel expiró. Vuelve a iniciar sesión.",
  error: "No se pudo verificar tu sesión. Inténtalo otra vez.",
} as const;

export type AdminAuthResult =
  | { ok: true; userId: string }
  | {
      ok: false;
      error: string;
      reason: "login" | "denied" | "expired" | "error";
    };

export async function verifyAdmin(): Promise<AdminAuthResult> {
  try {
    const claims = await getVerifiedClaims();
    const userId = claims?.sub;
    const sessionId = getSessionId(claims);
    if (!userId || !sessionId) {
      return { ok: false, error: adminSessionErrors.login, reason: "login" };
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      sentryErrorReport(error, "AUTH - ADMIN_VERIFICATION");
      return { ok: false, error: adminSessionErrors.error, reason: "error" };
    }
    if (!data) {
      return { ok: false, error: adminSessionErrors.denied, reason: "denied" };
    }

    const { data: dashboardSession, error: sessionError } = await supabase
      .from("dashboard_sessions")
      .select("session_id")
      .eq("session_id", sessionId)
      .eq("user_id", userId)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (sessionError) {
      sentryErrorReport(sessionError, "AUTH - DASHBOARD_SESSION_VERIFICATION");
      return { ok: false, error: adminSessionErrors.error, reason: "error" };
    }
    if (!dashboardSession) {
      return { ok: false, error: adminSessionErrors.expired, reason: "expired" };
    }
    return { ok: true, userId };
  } catch (error) {
    sentryErrorReport(error, "AUTH - VERIFY");
    return { ok: false, error: adminSessionErrors.error, reason: "error" };
  }
}

/** Use in Server Actions and Route Handlers (returns an error string instead of redirect). */
export async function guardAdminAction() {
  const result = await verifyAdmin();
  return result.ok ? null : result.error;
}

export async function requireAdmin() {
  const result = await verifyAdmin();
  if (result.ok) return { userId: result.userId };

  const query =
    result.reason === "denied"
      ? "denied"
      : result.reason === "expired"
        ? "expired"
        : result.reason === "error"
          ? "error"
          : undefined;
  redirect(query ? `/dashboard/login?reason=${query}` : "/dashboard/login");
}