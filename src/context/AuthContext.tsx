'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';

export type AuthResult = { ok: true } | { ok: false; error: string };

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (input: RegisterInput) => Promise<AuthResult>;
  logout: () => void;
  ready: boolean;
}

// Customer accounts only. Admins sign in separately at /admin/login (server-checked).
const STORAGE_KEY = 'nova_user';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const persist = useCallback((next: User) => {
    setUser(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable (private mode) – session-only login */
    }
  }, []);

  // Demo auth: no backend. Replace with a real API call when one exists.
  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const cleanEmail = email.trim();
      if (!cleanEmail || !password) {
        return { ok: false, error: 'Please enter your email and password.' };
      }
      persist({
        email: cleanEmail,
        name: cleanEmail.split('@')[0] || 'User',
        role: 'user',
      });
      return { ok: true };
    },
    [persist],
  );

  const register = useCallback(
    async ({ name, email, password }: RegisterInput): Promise<AuthResult> => {
      const cleanEmail = email.trim();
      if (!cleanEmail || !password) {
        return { ok: false, error: 'Please fill in all required fields.' };
      }
      persist({
        email: cleanEmail,
        name: name.trim() || cleanEmail.split('@')[0] || 'User',
        role: 'user',
        createdAt: new Date().toISOString(),
      });
      return { ok: true };
    },
    [persist],
  );

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Older demo logins could carry role "admin"; customers are always "user" now.
      if (saved) setUser({ ...(JSON.parse(saved) as User), role: 'user' });
    } catch (e) {
      console.error(e);
    }
    setReady(true);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
