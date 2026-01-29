import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';

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

    // 안전장치: 0.1초 후 강제 로딩 종료 (무조건 실행)
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.log('Force loading false by timeout');
        setLoading(false);
      }
    }, 100);

    const initializeAuth = async () => {
      try {
        console.log('Checking session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (mounted) {
          const currentUser = session?.user ?? null;
          console.log('Current user:', currentUser?.email);
          setUser(currentUser);
          
          if (currentUser) {
            await fetchUserRole(currentUser.id);
          } else {
            setUserRole(null);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        // 이미 타임아웃에 의해 false가 되었을 수 있지만, 확실히 하기 위해
        if (mounted) {
          console.log('Auth initialization complete');
          setLoading(false);
        }
      }
    };
    
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event);
      if (mounted) {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          await fetchUserRole(currentUser.id);
        } else {
          setUserRole(null);
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    // 1. UI 즉시 업데이트 (사용자 경험 우선)
    setUser(null);
    setUserRole(null);

    try {
      console.log('Signing out...');
      // 2. Supabase 로그아웃 시도 (5초 타임아웃)
      await Promise.race([
        supabase.auth.signOut(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Sign out timeout')), 5000))
      ]);
      console.log('Sign out successful');
    } catch (error) {
      // 타임아웃이어도 로컬 세션은 이미 정리되었으므로 warn으로 처리
      console.warn('Sign out notice:', error.message, '(local session already cleared)');
      // 로컬 스토리지 강제 정리 (혹시 모를 잔여 데이터)
      // 'sb-' 접두사로 시작하는 모든 Supabase 관련 항목 삭제
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-')) {
            localStorage.removeItem(key);
          }
        });
      } catch (storageError) {
        console.warn('Failed to clear localStorage:', storageError);
      }
    }
  };

  const value = {
    user,
    userRole,
    isAdmin: userRole === 'admin',
    signOut,
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
