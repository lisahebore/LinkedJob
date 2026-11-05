import { Stack } from 'expo-router';
import React from 'react';
import { colors } from '../../../src/theme/theme';

export default function CompanyProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Company Profile' }} />
      <Stack.Screen name="edit" options={{ title: 'Edit Company' }} />
    </Stack>
  );
}
