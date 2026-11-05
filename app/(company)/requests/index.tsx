import { useRouter } from 'expo-router';
import React from 'react';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { QueryList } from '../../../src/components/common/QueryList';
import { RequestCard } from '../../../src/components/common/RequestCard';
import { Screen } from '../../../src/components/common/Screen';
import { useRequests } from '../../../src/hooks/useRequests';
import { asHref } from '../../../src/utils/navigation';

export default function CompanyRequestsScreen() {
  const router = useRouter();
  const requests = useRequests();

  return (
    <Screen scroll={false} padded={false}>
      <QueryList
        query={requests}
        keyExtractor={(request) => request.id}
        empty={
          <EmptyState
            icon="paper-plane-outline"
            title="No requests sent"
            message="Open a candidate's profile and ask to see their documents. They appear here."
            actionLabel="Browse candidates"
            onAction={() => router.push('/(company)/candidates')}
          />
        }
        renderItem={({ item }) => (
          <RequestCard
            request={item}
            viewerRole="company"
            onPress={() => router.push(asHref(`/(company)/requests/${item.id}`))}
          />
        )}
      />
    </Screen>
  );
}
