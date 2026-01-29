import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabaseAuth as supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const fetchUserRole = async (userId) => {
    if (!userId) {
      setUserRole(null);
      return;
    }
    
    try {
      // maybeSingle() 대신 select().limit(1) 사용 (호환성 및 안전성 강화)
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .limit(1);
        
      if (data && data.length > 0) {
        setUserRole(data[0].role);
      } else {
        // 프로필이 없으면 기본 'user'로 설정
        console.warn('No profile found for user, defaulting to user role.');
        setUserRole('user');
      }
      
      if (error) {
        console.error('Profile fetch error:', error.message);
      }
    } catch (err) {
      console.error('Error fetching user role:', err);
      setUserRole('user');
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log('AuthProvider mounted');

    const STORAGE_KEY = 'okta_auth_session';

    // URL 해시에서 OAuth 토큰 파싱
    const parseHashParams = () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      return {
        accessToken: params.get('access_token'),
        refreshToken: params.get('refresh_token'),
        expiresAt: params.get('expires_at'),
      };
    };

    // localStorage에서 저장된 세션 로드
    const loadStoredSession = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const session = JSON.parse(stored);
          // 만료 여부 확인
          if (session.expiresAt && Date.now() / 1000 < session.expiresAt) {
            return session;
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (e) {
        console.error('Failed to load stored session:', e);
      }
      return null;
    };

    // 세션 저장
    const saveSession = (accessToken, refreshToken, expiresAt, user) => {
      const session = { accessToken, refreshToken, expiresAt, user };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    };

    const { accessToken, refreshToken, expiresAt } = parseHashParams();
    const hasAuthCallback = !!accessToken;
    
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.log('Force loading false by timeout');
        setLoading(false);
      }
    }, hasAuthCallback ? 3000 : 500);

    const initializeAuth = async () => {
      try {
        console.log('Checking session...');
        
        // OAuth 콜백인 경우
        if (hasAuthCallback && refreshToken) {
          console.log('OAuth callback detected, processing tokens...');
          
          // JWT에서 사용자 정보 디코드
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const user = {
            id: payload.sub,
            email: payload.email,
            user_metadata: payload.user_metadata,
          };
          
          // 세션 저장
          saveSession(accessToken, refreshToken, parseInt(expiresAt), user);
          
          // URL 해시 정리
          window.history.replaceState(null, '', window.location.pathname);
          
          console.log('Session saved for:', user.email);
          
          if (mounted) {
            setUser(user);
            await fetchUserRole(user.id);
          }
        } else {
          // 저장된 세션 로드
          const storedSession = loadStoredSession();
          if (storedSession && storedSession.user) {
            console.log('Restored session for:', storedSession.user.email);
            if (mounted) {
              setUser(storedSession.user);
              await fetchUserRole(storedSession.user.id);
            }
          } else {
            console.log('No valid session found');
            if (mounted) {
              setUser(null);
              setUserRole(null);
            }
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) {
          setUser(null);
          setUserRole(null);
        }
      } finally {
        if (mounted) {
          console.log('Auth initialization complete');
          setLoading(false);
        }
      }
    };
    
    initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // 이메일 로그인 함수
  const signInWithEmail = async (email, password) => {
    const STORAGE_KEY = 'okta_auth_session';
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
    
    if (data?.session) {
      // 수동으로 세션 저장
      const session = {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
        user: data.user,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      
      // 상태 업데이트
      setUser(data.user);
      await fetchUserRole(data.user.id);
      
      console.log('Email login successful:', data.user.email);
    }
    
    return data;
  };

  const signOut = async () => {
    // 1. UI 즉시 업데이트 (사용자 경험 우선)
    setUser(null);
    setUserRole(null);

    try {
      console.log('Signing out...');
      
      // 수동 세션 스토리지 삭제
      localStorage.removeItem('okta_auth_session');
      
      // Supabase 관련 localStorage 항목도 정리
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      console.log('Sign out successful');
    } catch (error) {
      console.warn('Sign out error:', error.message);
    }
  };

  const value = {
    user,
    userRole,
    isAdmin: userRole === 'admin',
    signOut,
    signInWithEmail,
    loading
  };

  // 로딩 상태 시각화 제거 (사용자가 기다리지 않게 함)
  // 대신 로딩 중이라도 화면을 보여주되, 깜빡임은 감수함 (0.1초라 거의 안 보임)
  if (loading) {
    // 아주 짧은 순간이므로 빈 화면을 보여주는 게 나을 수도 있지만,
    // 사용자가 '안 뜬다'고 했으므로 그냥 children을 렌더링 시도하거나
    // 로딩 메시지를 없앱니다.
    return (
      <div style={{ display: 'none' }}></div> // 깜빡임 방지용 빈 화면
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
