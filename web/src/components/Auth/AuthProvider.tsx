import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { fetchProfile } from '@/api/auth';

interface User {
  id: number;
  username: string;
  nickname: string | null;
  avatar: string | null;
  role: 'admin' | 'user' | 'guest';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  loginSuccess: (token: string, user: User) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始化：从 localStorage 恢复 token 并拉取最新 profile
  useEffect(() => {
    const token = localStorage.getItem('zd_token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchProfile()
      .then((data) => {
        setUser({
          id: data.id,
          username: data.username,
          nickname: data.nickname,
          avatar: data.avatar,
          role: data.role as 'admin' | 'user',
        });
        localStorage.setItem('zd_user', JSON.stringify(data));
      })
      .catch(() => {
        // Token 过期或无效
        localStorage.removeItem('zd_token');
        localStorage.removeItem('zd_user');
      })
      .finally(() => setLoading(false));
  }, []);

  const loginSuccess = useCallback((token: string, userData: User) => {
    localStorage.setItem('zd_token', token);
    localStorage.setItem('zd_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('zd_token');
    localStorage.removeItem('zd_user');
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const data = await fetchProfile();
      setUser({
        id: data.id,
        username: data.username,
        nickname: data.nickname,
        avatar: data.avatar,
        role: data.role as 'admin' | 'user',
      });
    } catch {
      // ignore
    }
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin',
    loginSuccess,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
