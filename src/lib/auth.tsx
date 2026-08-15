import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isPaidMember: boolean;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshMembership: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isPaidMember, setIsPaidMember] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMembership = async (uid: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('is_paid_member')
        .eq('id', uid)
        .maybeSingle();
      setIsPaidMember(data?.is_paid_member ?? false);
    } catch {
      setIsPaidMember(false);
    }
  };

  useEffect(() => {
    // onAuthStateChange immediately fires with the initial session, 
    // eliminating the need for a separate blocking getSession() call.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        await fetchMembership(newSession.user.id);
      } else {
        setIsPaidMember(false);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsPaidMember(false);
  };

  const refreshMembership = async () => {
    if (user) await fetchMembership(user.id);
  };

  return (
    <AuthContext.Provider value={{ session, user, isPaidMember, loading, signUp, signIn, signInWithGoogle, signOut, refreshMembership }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}