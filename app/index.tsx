import { Redirect } from 'expo-router';
import React from 'react';
import { RequireRole } from '../src/components/common/RequireRole';

/** Entry route: sends each person to the right area for their account type. */
export default function Index() {
  return (
    <RequireRole>
      {(account) => (
        <Redirect href={account.role === 'individual' ? '/(individual)/home' : '/(company)/home'} />
      )}
    </RequireRole>
  );
}
