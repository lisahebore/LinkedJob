import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { Loader } from '../../src/components/common/Loader';
import { useAuth } from '../../src/hooks/useAuth';
import { colors } from '../../src/theme/theme';

export default function AuthLayout() {
  const { status } = useAuth();

  if (status === 'loading') return <Loader />;
  // Signed-in people (or those whose account failed to load) are handled by the entry route.
  if (status === 'signedIn' || status === 'error') return <Redirect href="/" />;

  return (
    <Stack
      screenOptions={{
        headerTitle: '',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
    </Stack>
  );
}
