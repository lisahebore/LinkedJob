import { Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSignOut } from '../../hooks/useAuthActions';
import { Account, Role } from '../../types/models';
import { ErrorState } from './ErrorState';
import { Loader } from './Loader';

interface Props {
  /** Omit to allow either role (used by the entry route, which then picks the right home). */
  role?: Role;
  children: (account: Account) => React.ReactNode;
}

/**
 * The route guard. Every protected layout renders through this, so an unauthenticated user,
 * or one with the wrong role, is redirected no matter how they reached the screen.
 */
export function RequireRole({ role, children }: Props) {
  const { status, account, retryAccount } = useAuth();
  const signOut = useSignOut();

  if (status === 'loading') return <Loader />;
  if (status === 'signedOut') return <Redirect href="/(auth)/welcome" />;
  if (status === 'error' || !account) {
    return (
      <ErrorState
        message="We could not load your account. Check your connection and try again."
        onRetry={retryAccount}
        secondaryLabel="Sign out"
        onSecondary={() => signOut.mutate()}
      />
    );
  }
  if (role && account.role !== role) return <Redirect href="/" />;
  return <>{children(account)}</>;
}
