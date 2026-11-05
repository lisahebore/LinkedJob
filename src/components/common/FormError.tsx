import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme/theme';

/** A form-level error (for example a failed save), shown above the submit button. */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text accessibilityRole="alert" style={styles.error}>
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  error: {
    ...typography.body,
    color: colors.danger,
    backgroundColor: colors.dangerBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
});
