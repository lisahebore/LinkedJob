import { useRouter } from 'expo-router';
import React from 'react';
import { EmptyState } from '../src/components/common/EmptyState';
import { Screen } from '../src/components/common/Screen';

export default function NotFound() {
  const router = useRouter();
  return (
    <Screen safeTop>
      <EmptyState
        icon="alert-circle-outline"
        title="Page not found"
        message="That screen does not exist."
        actionLabel="Go to home"
        onAction={() => router.replace('/')}
      />
    </Screen>
  );
}
