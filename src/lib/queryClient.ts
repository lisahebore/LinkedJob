import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { focusManager, onlineManager, QueryClient } from '@tanstack/react-query';
import { AppState } from 'react-native';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const MAX_RETRIES = 2;

// React Native has no browser "window focus", so tell React Query when the app returns to the
// foreground. That is what makes a verification or a candidate's reply appear without a restart.
focusManager.setEventListener((handleFocus) => {
  const subscription = AppState.addEventListener('change', (state) =>
    handleFocus(state === 'active'),
  );
  return () => subscription.remove();
});

onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => setOnline(state.isConnected !== false)),
);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Kept long so the persisted copy of every list can be shown offline.
      gcTime: ONE_DAY_MS,
      staleTime: 30 * 1000,
      retry: MAX_RETRIES,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    },
  },
});

/** Mirrors the query cache to AsyncStorage so the last-fetched lists show without a network. */
export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'linkedjob.query-cache',
});

export const PERSIST_MAX_AGE_MS = ONE_DAY_MS;

/** Called on sign-out so the next person on this device never sees cached data. */
export async function clearCachedData(): Promise<void> {
  queryClient.clear();
  await queryPersister.removeClient();
}
