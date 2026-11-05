import { Tabs } from 'expo-router';
import React from 'react';
import { RequireRole } from '../../src/components/common/RequireRole';
import { tabIcon } from '../../src/components/common/tabIcon';
import { colors } from '../../src/theme/theme';

export default function CompanyLayout() {
  return (
    <RequireRole role="company">
      {() => (
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            headerStyle: { backgroundColor: colors.surface },
            headerTitleStyle: { fontWeight: '700' },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{ title: 'Home', tabBarIcon: tabIcon('home-outline') }}
          />
          <Tabs.Screen
            name="candidates"
            options={{
              title: 'Candidates',
              headerShown: false,
              tabBarIcon: tabIcon('people-outline'),
            }}
          />
          <Tabs.Screen
            name="requests"
            options={{
              title: 'Requests',
              headerShown: false,
              tabBarIcon: tabIcon('paper-plane-outline'),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Company',
              headerShown: false,
              tabBarIcon: tabIcon('business-outline'),
            }}
          />
        </Tabs>
      )}
    </RequireRole>
  );
}
