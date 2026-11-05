import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme/theme';

export function ChipRow({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item} style={styles.chip}>
          <Text style={styles.text} numberOfLines={1}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    maxWidth: '100%',
  },
  text: { color: colors.primaryDark, fontSize: 13, fontWeight: '600' },
});
