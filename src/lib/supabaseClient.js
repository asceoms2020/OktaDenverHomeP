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

// 인증된 요청을 위한 헬퍼 함수
// localStorage에서 access token을 가져와 Authorization 헤더에 설정
export const getAuthenticatedClient = () => {
  const STORAGE_KEY = 'okta_auth_session';
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const session = JSON.parse(stored);
      if (session.accessToken) {
        // 인증 헤더가 포함된 새 클라이언트 생성
        return createClient(supabaseUrl, supabaseKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
          global: {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          },
        });
      }
    }
  } catch (e) {
    console.error('Failed to get authenticated client:', e);
  }
  
  // 토큰이 없으면 기본 클라이언트 반환
  return supabase;
};
