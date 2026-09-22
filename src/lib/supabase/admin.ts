import "server-only";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getSupabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

const serviceRoleSchema = z.string().min(1);

export function createAdminClient() {
  const { url } = getSupabaseConfig();
  const serviceRoleKey = serviceRoleSchema.parse(
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  return createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
