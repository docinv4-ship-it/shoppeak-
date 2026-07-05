// lib/db.ts
import { createClient } from "@supabase/supabase-js";

// Types override validation to enforce zero-leak compile on Next.js edge/server contexts
type SupabaseClientInstance = ReturnType<typeof createClient>;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // Graceful fallback during static build phases if Vercel builds before injects envs
  console.warn("[Supabase Init Warning]: Environment keys are missing during compilation.");
}

export const supabase: SupabaseClientInstance = createClient(
  SUPABASE_URL || "https://placeholder-project.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY || "placeholder-key",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
