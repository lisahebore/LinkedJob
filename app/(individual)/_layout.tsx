import { Tabs } from 'expo-router';
import React from 'react';
import { RequireRole } from '../../src/components/common/RequireRole';
import { tabIcon } from '../../src/components/common/tabIcon';
import { useRequests } from '../../src/hooks/useRequests';
import { colors } from '../../src/theme/theme';

function IndividualTabs() {
  const requests = useRequests();
  const pendingCount = requests.data?.filter((request) => request.status === 'pending').length ?? 0;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: tabIcon('home-outline') }} />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          headerShown: false,
          tabBarIcon: tabIcon('document-text-outline'),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          headerShown: false,
          tabBarIcon: tabIcon('mail-unread-outline'),
          tabBarBadge: pendingCount > 0 ? pendingCount : undefined,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', headerShown: false, tabBarIcon: tabIcon('person-outline') }}
      />
    </Tabs>
  );
}

export default function IndividualLayout() {
  return <RequireRole role="individual">{() => <IndividualTabs />}</RequireRole>;
}
