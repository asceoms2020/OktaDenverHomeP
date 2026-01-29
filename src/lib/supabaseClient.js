import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// 단일 클라이언트 - 세션 관리 비활성화 (hanging 방지)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

// Auth용으로도 같은 클라이언트 export (호환성 유지)
export const supabaseAuth = supabase;

