import { Stack } from 'expo-router';
import React from 'react';
import { colors } from '../../../src/theme/theme';

export default function DocumentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'My Documents' }} />
      <Stack.Screen name="new" options={{ title: 'Upload Document' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Document' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Rename Document' }} />
    </Stack>
  );
}
