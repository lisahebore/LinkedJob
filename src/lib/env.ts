/**
 * EXPO_PUBLIC_ variables are inlined by Metro at build time, so each one must be referenced by
 * its full literal name. For compiled builds define them as EAS secrets (see README).
 */
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isConfigured = SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
