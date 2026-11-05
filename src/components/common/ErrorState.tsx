import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme/theme';
import { Button } from './Button';

interface Props {
  message: string;
  onRetry?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

/** Shown when a request fails. Always offers a way to try again. */
export function ErrorState({ message, onRetry, secondaryLabel, onSecondary }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={48} color={colors.danger} />
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <Button title="Try again" onPress={onRetry} style={styles.action} /> : null}
      {secondaryLabel && onSecondary ? (
        <Button
          title={secondaryLabel}
          onPress={onSecondary}
          variant="ghost"
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.background,
  },
  title: { ...typography.subheading, color: colors.text, marginTop: spacing.md },
  message: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  action: { marginTop: spacing.lg, alignSelf: 'stretch' },
});
