import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './env';
import { fetchWithTimeout } from './http';

const UPLOAD_TIMEOUT_MS = 60000;

/**
 * Only the anon (publishable) key is used here. It is readable by anyone who unpacks the app,
 * so every access rule lives in the database (see supabase/schema.sql), not in this client.
 * Placeholder values keep the import from throwing when configuration is missing; the root
 * layout checks `isConfigured` and shows a clear message instead of crashing.
 */
export const supabase = createClient(
  SUPABASE_URL || 'http://localhost',
  SUPABASE_ANON_KEY || 'missing-anon-key',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    global: { fetch: fetchWithTimeout(UPLOAD_TIMEOUT_MS) },
  },
);
