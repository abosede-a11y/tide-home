import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, permissionsApi } from '../services/api';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'superadmin' | 'admin' | 'staff' | 'guardian';
  photoUrl?: string;
  linkedResidentId?: string;
  username?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  permissions: Record<string, boolean>;
  loading: boolean;
   permissionsLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  canAccess: (feature: string) => boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tidehome_token');
    const stored = localStorage.getItem('tidehome_user');
    if (token && stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
        loadPermissions(u.role);
      } catch { 
        setLoading(false); 
        setPermissionsLoading(false);
      }
    } else {
      setLoading(false);
      setPermissionsLoading(false);
    }
  }, []);

  async function loadPermissions(role: string) {
    try {
      const perms = await permissionsApi.getMyAccess();
      setPermissions(perms);
    } catch { 
      // permissions failed, use empty
    } finally { 
      setLoading(false);
      setPermissionsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const { accessToken, user: u } = await authApi.login(email, password);
    localStorage.setItem('tidehome_token', accessToken);
    localStorage.setItem('tidehome_user', JSON.stringify(u));
    setUser(u);
    await loadPermissions(u.role);
  }

  function logout() {
    localStorage.removeItem('tidehome_token');
    localStorage.removeItem('tidehome_user');
    setUser(null);
    setPermissions({});
    window.location.href = '/login';
  }

  function canAccess(feature: string): boolean {
    if (!user) return false;
    if (user.role === 'superadmin') return true;
    return permissions[feature] === true;
  }

  return (
    <AuthContext.Provider value={{ user, permissions, loading, permissionsLoading, login, logout, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
