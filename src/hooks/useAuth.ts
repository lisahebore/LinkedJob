import { useContext } from 'react';
import { AuthContext, AuthState } from '../context/AuthContext';
import { Company, Profile } from '../types/models';

export function useAuth(): AuthState {
  const state = useContext(AuthContext);
  if (!state) throw new Error('useAuth must be used inside <AuthProvider>');
  return state;
}

/** For screens inside the job-seeker area, where the route guard guarantees this role. */
export function useIndividual(): Profile {
  const { account } = useAuth();
  if (account?.role !== 'individual') throw new Error('Not signed in as a job seeker');
  return account.profile;
}

/** For screens inside the company area, where the route guard guarantees this role. */
export function useCompany(): Company {
  const { account } = useAuth();
  if (account?.role !== 'company') throw new Error('Not signed in as a company');
  return account.company;
}
