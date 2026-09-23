import "server-only";

import { redirect } from "next/navigation";
import { getSessionId } from "@/lib/dashboard-session";
import { sentryErrorReport } from "@/lib/sentry";
import { getVerifiedClaims } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function requireAdmin() {
  const claims = await getVerifiedClaims();
  const userId = claims?.sub;
  const sessionId = getSessionId(claims);
  if (!userId || !sessionId) redirect("/dashboard/login");

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    sentryErrorReport(error, "AUTH - ADMIN_VERIFICATION");
    redirect("/dashboard/login?reason=error");
  }
  if (!data) redirect("/dashboard/login?reason=denied");

  const { data: dashboardSession, error: sessionError } = await supabase
    .from("dashboard_sessions")
    .select("session_id")
    .eq("session_id", sessionId)
    .eq("user_id", userId)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (sessionError) {
    sentryErrorReport(sessionError, "AUTH - DASHBOARD_SESSION_VERIFICATION");
    redirect("/dashboard/login?reason=error");
  }
  if (!dashboardSession) redirect("/dashboard/login?reason=expired");
  return { userId };
}
