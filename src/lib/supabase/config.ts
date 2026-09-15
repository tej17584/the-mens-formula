import { z } from "zod";

const supabaseConfigSchema = z.object({
  url: z.string().url(),
  publishableKey: z.string().min(1),
});

function getRawSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}

export function isSupabaseConfigured() {
  return supabaseConfigSchema.safeParse(getRawSupabaseConfig()).success;
}

export function getSupabaseConfig() {
  return supabaseConfigSchema.parse(getRawSupabaseConfig());
}
