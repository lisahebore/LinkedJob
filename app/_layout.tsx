import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { EmptyState } from '../src/components/common/EmptyState';
import { OfflineBanner } from '../src/components/common/OfflineBanner';
import { Screen } from '../src/components/common/Screen';
import { AuthProvider } from '../src/context/AuthContext';
import { isConfigured } from '../src/lib/env';
import { PERSIST_MAX_AGE_MS, queryClient, queryPersister } from '../src/lib/queryClient';

export default function RootLayout() {
  if (!isConfigured) {
    return (
      <SafeAreaProvider>
        <Screen safeTop>
          <EmptyState
            icon="construct-outline"
            title="App is not configured"
            message="EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are missing. See the README, section Environment variables."
          />
        </Screen>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: queryPersister, maxAge: PERSIST_MAX_AGE_MS }}
      >
        <AuthProvider>
          <StatusBar style="dark" />
          <View style={{ flex: 1 }}>
            <OfflineBanner />
            <Stack screenOptions={{ headerShown: false }} />
          </View>
        </AuthProvider>
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}
