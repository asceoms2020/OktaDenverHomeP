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
      console.log('Fetching user role for:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .limit(1);
        
      if (data && data.length > 0) {
        console.log('User role found:', data[0].role);
        setUserRole(data[0].role);
      } else {
        console.warn('No profile found, defaulting to user.');
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

    // 안전장치: 0.1초 후에도 로딩이 안 끝나면 강제로 종료
    const timeoutId = setTimeout(() => {
      if (loading && mounted) {
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
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
  };

  const value = {
    user,
    userRole,
    isAdmin: userRole === 'admin',
    signOut,
    loading
  };

  // 로딩 상태 시각화 (디버깅용)
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading Application... (Check Console if stuck)
      </div>
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
