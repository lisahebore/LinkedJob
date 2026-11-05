import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme/theme';

/** A small label above a value, used on every detail screen. */
export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginTop: spacing.md },
  label: { ...typography.label, color: colors.textMuted },
  value: { ...typography.body, color: colors.text, marginTop: 2 },
});
