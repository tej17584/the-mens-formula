import "server-only";

import { redirect } from "next/navigation";
import { sentryErrorReport } from "@/lib/sentry";
import { getVerifiedClaims } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function requireAdmin() {
  const claims = await getVerifiedClaims();
  const userId = claims?.sub;
  if (!userId) redirect("/dashboard/login");

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
  return { userId };
}
