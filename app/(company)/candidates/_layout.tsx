import { Stack } from 'expo-router';
import React from 'react';
import { colors } from '../../../src/theme/theme';

export default function CandidatesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Candidates' }} />
      <Stack.Screen name="[id]" options={{ title: 'Candidate' }} />
    </Stack>
  );
}
