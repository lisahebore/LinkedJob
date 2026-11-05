import { Session } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import { queryKeys } from '../lib/queryKeys';
import { supabase } from '../lib/supabase';
import { fetchAccount } from '../services/profileService';
import { Account } from '../types/models';

export type AuthStatus = 'loading' | 'signedOut' | 'signedIn' | 'error';

export interface AuthState {
  status: AuthStatus;
  userId: string | null;
  email: string;
  account: Account | null;
  /** Re-runs the account lookup, used by the "Try again" button when it failed. */
  retryAccount: () => void;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .finally(() => setSessionChecked(true));

    // Only store the session here; calling Supabase from inside this callback can deadlock.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    // Refresh tokens only while the app is in the foreground, as Supabase recommends.
    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    });

    return () => {
      listener.subscription.unsubscribe();
      appStateSubscription.remove();
    };
  }, []);

  const userId = session?.user.id ?? null;
  const accountQuery = useQuery({
    queryKey: queryKeys.account(userId ?? ''),
    queryFn: () => fetchAccount(userId ?? ''),
    enabled: userId !== null,
  });

  const value = useMemo<AuthState>(() => {
    const account = accountQuery.data ?? null;
    const waitingOffline = accountQuery.isPending && accountQuery.fetchStatus === 'paused';

    let status: AuthStatus;
    if (!sessionChecked) status = 'loading';
    else if (userId === null) status = 'signedOut';
    else if (account) status = 'signedIn';
    else if (accountQuery.isError || waitingOffline || accountQuery.data === null) status = 'error';
    else status = 'loading';

    return {
      status,
      userId,
      email: session?.user.email ?? '',
      account,
      retryAccount: () => {
        accountQuery.refetch();
      },
    };
  }, [accountQuery, session, sessionChecked, userId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
