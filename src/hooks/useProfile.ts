import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import * as profileService from '../services/profileService';
import { Coordinates } from '../types/geo';
import { toCandidateRows } from '../utils/candidates';
import { CompanyValues, ProfileValues } from '../utils/schemas';
import { useAuth } from './useAuth';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  return useMutation({
    mutationFn: (values: ProfileValues) => profileService.updateProfile(userId ?? '', values),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.account(profile.id), { role: 'individual', profile });
      queryClient.invalidateQueries({ queryKey: queryKeys.candidates });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  return useMutation({
    mutationFn: (values: CompanyValues) => profileService.updateCompany(userId ?? '', values),
    onSuccess: (company) => {
      queryClient.setQueryData(queryKeys.account(company.id), { role: 'company', company });
    },
  });
}

/** The cached list holds raw profiles; searching and distance-sorting happen in `select`. */
export function useCandidates(search: string, origin: Coordinates | null) {
  return useQuery({
    queryKey: queryKeys.candidates,
    queryFn: profileService.listCandidates,
    select: (profiles) => toCandidateRows(profiles, search, origin),
  });
}

export function useCandidate(id: string) {
  return useQuery({
    queryKey: queryKeys.candidate(id),
    queryFn: () => profileService.getCandidate(id),
  });
}
