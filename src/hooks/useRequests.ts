import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import * as requestService from '../services/requestService';
import { useAuth } from './useAuth';

export function useRequests() {
  const { userId } = useAuth();
  return useQuery({
    queryKey: queryKeys.requests(userId ?? ''),
    queryFn: requestService.listRequests,
  });
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: queryKeys.request(id),
    queryFn: () => requestService.getRequest(id),
  });
}

/** Every request mutation refreshes both the list and the open detail view. */
function useRefreshRequests() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  return (id?: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.requests(userId ?? '') });
    if (id) queryClient.invalidateQueries({ queryKey: queryKeys.request(id) });
  };
}

export function useCreateRequest() {
  const refresh = useRefreshRequests();
  return useMutation({
    mutationFn: requestService.createRequest,
    onSuccess: () => refresh(),
  });
}

export function useUpdateRequestMessage(id: string) {
  const refresh = useRefreshRequests();
  return useMutation({
    mutationFn: (message: string) => requestService.updateRequestMessage(id, message),
    onSuccess: () => refresh(id),
  });
}

export function useCancelRequest() {
  const queryClient = useQueryClient();
  const refresh = useRefreshRequests();
  return useMutation({
    mutationFn: (id: string) => requestService.cancelRequest(id),
    onSuccess: (_result, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.request(id) });
      refresh();
    },
  });
}

export function useRespondToRequest(id: string) {
  const refresh = useRefreshRequests();
  return useMutation({
    mutationFn: (decision: 'accepted' | 'rejected') =>
      requestService.respondToRequest(id, decision),
    onSuccess: () => refresh(id),
  });
}
