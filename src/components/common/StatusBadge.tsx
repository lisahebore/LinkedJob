import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme/theme';
import { RequestStatus, VerificationStatus } from '../../types/models';

type Status = RequestStatus | VerificationStatus;

const CONFIG: Record<Status, { label: string; background: string; foreground: string }> = {
  pending: { label: 'Pending', background: colors.warningBg, foreground: colors.warning },
  accepted: { label: 'Accepted', background: colors.successBg, foreground: colors.success },
  verified: { label: 'Verified', background: colors.successBg, foreground: colors.success },
  rejected: { label: 'Declined', background: colors.dangerBg, foreground: colors.danger },
};

export function StatusBadge({ status }: { status: Status }) {
  const { label, background, foreground } = CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <Text style={[styles.text, { color: foreground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12, fontWeight: '700' },
});
