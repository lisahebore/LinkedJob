import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Linking } from 'react-native';
import { queryKeys } from '../lib/queryKeys';
import * as documentService from '../services/documentService';
import { DocumentRow } from '../types/models';
import { useAuth } from './useAuth';

export function useDocuments(ownerId: string) {
  return useQuery({
    queryKey: queryKeys.documents(ownerId),
    queryFn: () => documentService.listDocuments(ownerId),
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: queryKeys.document(id),
    queryFn: () => documentService.getDocument(id),
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  return useMutation({
    mutationFn: (input: Parameters<typeof documentService.createDocument>[0]) =>
      documentService.createDocument(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.documents(userId ?? '') }),
  });
}

export function useUpdateDocument(id: string) {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  return useMutation({
    mutationFn: (label: string) => documentService.updateDocumentLabel(id, label),
    onSuccess: (document) => {
      queryClient.setQueryData(queryKeys.document(id), document);
      queryClient.invalidateQueries({ queryKey: queryKeys.documents(userId ?? '') });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  return useMutation({
    mutationFn: (document: DocumentRow) => documentService.deleteDocument(document),
    onSuccess: (_result, document) => {
      queryClient.removeQueries({ queryKey: queryKeys.document(document.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.documents(userId ?? '') });
    },
  });
}

/** Creates a short-lived signed link and hands it to the phone's browser to view or save. */
export function useOpenDocument() {
  return useMutation({
    mutationFn: async (document: DocumentRow) => {
      const url = await documentService.getDocumentUrl(document.storage_path);
      await Linking.openURL(url);
    },
  });
}
