export const queryKeys = {
  account: (userId: string) => ['account', userId] as const,
  candidates: ['candidates'] as const,
  candidate: (id: string) => ['candidates', id] as const,
  documents: (ownerId: string) => ['documents', ownerId] as const,
  document: (id: string) => ['document', id] as const,
  requests: (userId: string) => ['requests', userId] as const,
  request: (id: string) => ['request', id] as const,
  places: (term: string) => ['places', term] as const,
};
