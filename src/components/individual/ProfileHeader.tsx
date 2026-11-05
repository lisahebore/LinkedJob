import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme/theme';
import { getInitials } from '../../utils/formatters';

interface Props {
  name: string;
  headline?: string;
  location?: string;
  compact?: boolean;
}

export function ProfileHeader({ name, headline, location, compact }: Props) {
  const size = compact ? 48 : 72;
  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={[styles.initials, { fontSize: compact ? 18 : 26 }]}>{getInitials(name)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={compact ? styles.nameCompact : styles.name} numberOfLines={2}>
          {name}
        </Text>
        {headline ? (
          <Text style={styles.headline} numberOfLines={2}>
            {headline}
          </Text>
        ) : null}
        {location ? (
          <Text style={styles.location} numberOfLines={1}>
            {location}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  initials: { color: colors.white, fontWeight: '700' },
  info: { flex: 1 },
  name: { ...typography.heading, color: colors.text },
  nameCompact: { ...typography.subheading, color: colors.text },
  headline: { ...typography.body, color: colors.text, marginTop: 2 },
  location: { ...typography.small, color: colors.textMuted, marginTop: 2 },
});
