import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export const DASHBOARD_SESSION_DURATION_MS = 2 * 60 * 60 * 1000;

export function getSessionId(claims: unknown) {
  if (
    claims &&
    typeof claims === "object" &&
    "session_id" in claims &&
    typeof claims.session_id === "string"
  ) {
    return claims.session_id;
  }

  return null;
}

export async function createDashboardSession(
  userId: string,
  sessionId: string,
) {
  const expiresAt = new Date(Date.now() + DASHBOARD_SESSION_DURATION_MS);
  return createAdminClient().from("dashboard_sessions").upsert(
    {
      session_id: sessionId,
      user_id: userId,
      expires_at: expiresAt.toISOString(),
    },
    { onConflict: "session_id" },
  );
}

export async function deleteDashboardSession(sessionId: string) {
  return createAdminClient()
    .from("dashboard_sessions")
    .delete()
    .eq("session_id", sessionId);
}
