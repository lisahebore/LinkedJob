import { Stack } from 'expo-router';
import React from 'react';
import { colors } from '../../../src/theme/theme';

export default function CompanyRequestsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Sent Requests' }} />
      <Stack.Screen name="[id]" options={{ title: 'Request' }} />
    </Stack>
  );
}
