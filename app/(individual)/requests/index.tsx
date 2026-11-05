import { useRouter } from 'expo-router';
import React from 'react';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { QueryList } from '../../../src/components/common/QueryList';
import { RequestCard } from '../../../src/components/common/RequestCard';
import { Screen } from '../../../src/components/common/Screen';
import { useRequests } from '../../../src/hooks/useRequests';
import { asHref } from '../../../src/utils/navigation';

export default function IndividualRequestsScreen() {
  const router = useRouter();
  const requests = useRequests();

  return (
    <Screen scroll={false} padded={false}>
      <QueryList
        query={requests}
        keyExtractor={(request) => request.id}
        empty={
          <EmptyState
            icon="mail-outline"
            title="No requests yet"
            message="When a verified company wants to see your documents, the request appears here."
          />
        }
        renderItem={({ item }) => (
          <RequestCard
            request={item}
            viewerRole="individual"
            onPress={() => router.push(asHref(`/(individual)/requests/${item.id}`))}
          />
        )}
      />
    </Screen>
  );
}
