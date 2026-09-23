"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { translate } from "@/i18n";
import {
  createDashboardSession,
  deleteDashboardSession,
  getSessionId,
} from "@/lib/dashboard-session";
import { sentryErrorReport } from "@/lib/sentry";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export type AuthActionState = { error?: string; success?: true };

export async function signIn(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: translate("dashboard.formError") };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) return { error: translate("dashboard.formError") };

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims(data.session?.access_token);
  const userId = claimsData?.claims?.sub;
  const sessionId = getSessionId(claimsData?.claims);

  if (claimsError || !userId || !sessionId) {
    if (claimsError) sentryErrorReport(claimsError, "AUTH - SESSION_CLAIMS");
    await supabase.auth.signOut({ scope: "local" });
    return { error: translate("dashboard.formError") };
  }

  const admin = createAdminClient();
  const { data: adminUser, error: adminError } = await admin
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminError) {
    sentryErrorReport(adminError, "AUTH - ADMIN_VERIFICATION");
    await supabase.auth.signOut({ scope: "local" });
    return { error: translate("dashboard.formError") };
  }
  if (!adminUser) {
    await supabase.auth.signOut({ scope: "local" });
    return { error: translate("dashboard.accessDenied") };
  }

  const { error: sessionError } = await createDashboardSession(
    userId,
    sessionId,
  );
  if (sessionError) {
    sentryErrorReport(sessionError, "AUTH - DASHBOARD_SESSION_CREATE");
    await supabase.auth.signOut({ scope: "local" });
    return { error: translate("dashboard.formError") };
  }

  return { success: true };
}

export async function signOutDashboard() {
  const supabase = await createClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();
  const sessionId = getSessionId(data?.claims);

  if (claimsError) sentryErrorReport(claimsError, "AUTH - SESSION_CLAIMS");
  if (sessionId) {
    const { error } = await deleteDashboardSession(sessionId);
    if (error) sentryErrorReport(error, "AUTH - DASHBOARD_SESSION_DELETE");
  }

  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) sentryErrorReport(error, "AUTH - SIGN_OUT");
  redirect("/dashboard/login");
}
