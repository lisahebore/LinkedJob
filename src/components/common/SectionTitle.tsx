import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../../theme/theme';

export function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: { ...typography.subheading, color: colors.text, marginBottom: spacing.sm },
});
