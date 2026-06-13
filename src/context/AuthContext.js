import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabaseAuth as supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [redirectPath, setRedirectPath] = useState(null);
  
  // userRole is derived from userProfile for backward compatibility
  const userRole = userProfile?.role || 'user';

  const fetchUserProfile = async (userId) => {
    if (!userId) {
      setUserProfile(null);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .limit(1);
        
      if (data && data.length > 0) {
        setUserProfile(data[0]);
      } else {
        console.warn('No profile found for user');
        // If no profile exists, create a basic one or just handle as empty
        setUserProfile({ id: userId, role: 'user' });
      }
      
      if (error) {
        console.error('Profile fetch error:', error.message);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setUserProfile({ id: userId, role: 'user' });
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
        type: params.get('type'),
        error: params.get('error'),
        errorDescription: params.get('error_description'),
      };
    };

    const parseQueryParams = () => {
      const params = new URLSearchParams(window.location.search);
      return {
        code: params.get('code'),
        type: params.get('type'),
        error: params.get('error'),
        errorDescription: params.get('error_description'),
      };
    };

    // localStorage에서 저장된 세션 로드 (만료돼도 일단 반환 → 리프레시 토큰으로 갱신 시도)
    const loadStoredSession = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
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

    const { accessToken, refreshToken, expiresAt, type: hashType, error: hashError, errorDescription: hashErrorDescription } = parseHashParams();
    const { code, type: queryType, error: queryError, errorDescription: queryErrorDescription } = parseQueryParams();
    const callbackType = queryType || hashType;
    const callbackError = queryError || hashError;
    const callbackErrorDescription = queryErrorDescription || hashErrorDescription;
    const hasAuthCallback = !!accessToken || !!code;
    
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.log('Force loading false by timeout');
        setLoading(false);
      }
    }, hasAuthCallback ? 3000 : 500);

    const initializeAuth = async () => {
      try {
        console.log('Checking session...');

        if (callbackError) {
          console.error('Auth callback error:', callbackError, callbackErrorDescription);
          window.history.replaceState(null, '', window.location.pathname);
          if (mounted) {
            setUser(null);
            setUserProfile(null);
          }
          return;
        }
        
        // OAuth 콜백인 경우
        if (code) {
          console.log('Auth code callback detected, exchanging code for session...');

          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;

          const session = data?.session;
          const sessionUser = session?.user;
          const sessionAccessToken = session?.access_token;
          const sessionRefreshToken = session?.refresh_token;
          const sessionExpiresAt = session?.expires_at;

          if (!sessionAccessToken || !sessionRefreshToken || !sessionExpiresAt || !sessionUser) {
            throw new Error('Invalid session returned from code exchange');
          }

          saveSession(sessionAccessToken, sessionRefreshToken, sessionExpiresAt, sessionUser);

          if (mounted) {
            setUser(sessionUser);
            fetchUserProfile(sessionUser.id).catch(console.error);
            if (callbackType === 'recovery') {
              setRedirectPath('/reset-password');
            } else {
              setRedirectPath('/');
            }
            setLoading(false);
          }

          window.history.replaceState(null, '', window.location.pathname);
        } else if (hasAuthCallback && refreshToken) {
          console.log('OAuth callback detected, processing tokens...');
          
          try {
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              console.error('Failed to set session from callback tokens:', sessionError);
            }

            const sessionUser = sessionData?.session?.user;
            const user = sessionUser || (() => {
              const payload = JSON.parse(atob(accessToken.split('.')[1]));
              return {
                id: payload.sub,
                email: payload.email,
                user_metadata: payload.user_metadata,
              };
            })();
            
            // 세션 저장
            const parsedExpiresAt = expiresAt ? parseInt(expiresAt, 10) : null;
            saveSession(accessToken, refreshToken, parsedExpiresAt, user);
            
            console.log('Session saved for:', user.email);
            
            if (mounted) {
              setUser(user);
              // fetchUserProfile은 별도로 실행하되 실패해도 무시
              fetchUserProfile(user.id).catch(console.error);
              if (callbackType === 'recovery') {
                setRedirectPath('/reset-password');
              } else {
                setRedirectPath('/');
              }
              setLoading(false);
            }
            
            // URL 토큰 정리 (hash/query 제거)
            window.history.replaceState(null, '', window.location.pathname);
          } catch (parseError) {
            console.error('Failed to parse OAuth tokens:', parseError);
            if (mounted) {
              setLoading(false);
            }
            window.history.replaceState(null, '', window.location.pathname);
          }
        } else {
          // 저장된 세션 로드
          const storedSession = loadStoredSession();
          if (storedSession && storedSession.user && storedSession.refreshToken) {
            const now = Date.now() / 1000;
            const expired = !storedSession.expiresAt || storedSession.expiresAt <= now + 60; // 만료 60초 전이면 갱신

            if (expired) {
              // 액세스 토큰 만료 → 리프레시 토큰으로 갱신 (재로그인 불필요)
              console.log('Access token expired, refreshing with refresh token...');
              const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession({
                refresh_token: storedSession.refreshToken,
              });
              const s = refreshed?.session;
              if (refreshError || !s) {
                console.warn('Session refresh failed:', refreshError?.message);
                localStorage.removeItem(STORAGE_KEY);
                if (mounted) { setUser(null); setUserProfile(null); }
              } else {
                saveSession(s.access_token, s.refresh_token, s.expires_at, s.user);
                if (mounted) {
                  setUser(s.user);
                  await fetchUserProfile(s.user.id);
                }
              }
            } else {
              console.log('Restored session for:', storedSession.user.email);
              if (mounted) {
                supabase.auth
                  .setSession({
                    access_token: storedSession.accessToken,
                    refresh_token: storedSession.refreshToken,
                  })
                  .catch((e) => console.warn('Failed to restore Supabase in-memory session:', e));
                setUser(storedSession.user);
                await fetchUserProfile(storedSession.user.id);
              }
            }
          } else {
            console.log('No valid session found');
            if (mounted) {
              setUser(null);
              setUserProfile(null);
            }
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) {
          setUser(null);
          setUserProfile(null);
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

  // 로그인 중에는 45분마다 토큰을 자동 갱신 (탭을 오래 열어둬도 세션 유지)
  useEffect(() => {
    if (!user) return undefined;
    const KEY = 'okta_auth_session';
    const refresh = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (!stored?.refreshToken) return;
        const { data, error } = await supabase.auth.refreshSession({ refresh_token: stored.refreshToken });
        const s = data?.session;
        if (!error && s) {
          localStorage.setItem(KEY, JSON.stringify({
            accessToken: s.access_token, refreshToken: s.refresh_token, expiresAt: s.expires_at, user: s.user,
          }));
        }
      } catch (e) { /* 무시: 다음 진입 시 재시도 */ }
    };
    const id = setInterval(refresh, 45 * 60 * 1000);
    return () => clearInterval(id);
  }, [user]);

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
      await fetchUserProfile(data.user.id);
      
      console.log('Email login successful:', data.user.email);
    }
    
    return data;
  };

  const signOut = async () => {
    // 1. UI 즉시 업데이트 (사용자 경험 우선)
    setUser(null);
    setUserProfile(null);
    setRedirectPath(null);

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
    userProfile,
    userRole,
    isAdmin: userRole === 'admin',
    signOut,
    signInWithEmail,
    loading,
    fetchUserProfile,
    redirectPath,
    clearRedirectPath: () => setRedirectPath(null),
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
