import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme/theme';
import { RequestWithParties, Role } from '../../types/models';
import { timeAgo } from '../../utils/formatters';
import { Card } from './Card';
import { StatusBadge } from './StatusBadge';

interface Props {
  request: RequestWithParties;
  /** Who is looking: a company sees the candidate's name, a candidate sees the company's. */
  viewerRole: Role;
  onPress: () => void;
}

export function RequestCard({ request, viewerRole, onPress }: Props) {
  const title =
    viewerRole === 'individual'
      ? (request.company?.company_name ?? 'Unknown company')
      : (request.individual?.full_name ?? 'Unknown candidate');
  return (
    <Card onPress={onPress}>
      <View style={styles.top}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <StatusBadge status={request.status} />
      </View>
      {request.message ? (
        <Text style={styles.message} numberOfLines={2}>
          {request.message}
        </Text>
      ) : null}
      <Text style={styles.time}>{timeAgo(request.created_at)}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: { ...typography.subheading, color: colors.text, flex: 1 },
  message: { ...typography.body, color: colors.text, marginTop: spacing.sm },
  time: { ...typography.small, color: colors.textMuted, marginTop: spacing.xs },
});
