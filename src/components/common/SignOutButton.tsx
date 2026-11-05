import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useSignOut } from '../../hooks/useAuthActions';
import { confirmDestructive } from '../../utils/dialogs';
import { Button } from './Button';

export function SignOutButton({ style }: { style?: StyleProp<ViewStyle> }) {
  const signOut = useSignOut();
  return (
    <Button
      title="Sign out"
      variant="danger"
      style={style}
      loading={signOut.isPending}
      onPress={() =>
        confirmDestructive({
          title: 'Sign out',
          message: 'Are you sure you want to sign out?',
          confirmLabel: 'Sign out',
          onConfirm: () => signOut.mutate(),
        })
      }
    />
  );
}
