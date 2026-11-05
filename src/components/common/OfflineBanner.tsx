import { useNetInfo } from '@react-native-community/netinfo';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../theme/theme';

export function OfflineBanner() {
  const { isConnected } = useNetInfo();
  const insets = useSafeAreaInsets();
  if (isConnected !== false) return null;
  return (
    <Text style={[styles.banner, { paddingTop: insets.top + spacing.xs }]}>
      You are offline. Showing saved data where available.
    </Text>
  );
}

const styles = StyleSheet.create({
  banner: {
    ...typography.small,
    backgroundColor: colors.warning,
    color: colors.white,
    textAlign: 'center',
    paddingBottom: spacing.xs,
  },
});
