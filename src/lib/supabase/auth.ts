import "server-only";

import { createClient } from "@/lib/supabase/server";

/** Returns verified JWT claims, or null when the request is unauthenticated. */
export async function getVerifiedClaims() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  return data.claims;
}
