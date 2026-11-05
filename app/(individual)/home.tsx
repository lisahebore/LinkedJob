import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../src/components/common/Button';
import { Card } from '../../src/components/common/Card';
import { Screen } from '../../src/components/common/Screen';
import { useIndividual } from '../../src/hooks/useAuth';
import { useDocuments } from '../../src/hooks/useDocuments';
import { useRequests } from '../../src/hooks/useRequests';
import { colors, radius, spacing, typography } from '../../src/theme/theme';
import { profileCompleteness } from '../../src/utils/profile';

export default function IndividualHomeScreen() {
  const router = useRouter();
  const profile = useIndividual();
  const documents = useDocuments(profile.id);
  const requests = useRequests();

  const completeness = profileCompleteness(profile);
  const pendingCount = requests.data?.filter((request) => request.status === 'pending').length;

  return (
    <Screen>
      <Text style={styles.hello}>Hello,</Text>
      <Text style={styles.name} numberOfLines={1}>
        {profile.full_name}
      </Text>

      <Card>
        <Text style={styles.cardTitle}>Profile {completeness}% complete</Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${completeness}%` }]} />
        </View>
        {completeness < 100 ? (
          <Button
            title="Complete your profile"
            variant="secondary"
            style={styles.cardAction}
            onPress={() => router.push('/(individual)/profile/edit')}
          />
        ) : null}
      </Card>

      <View style={styles.stats}>
        <Card style={styles.stat} onPress={() => router.push('/(individual)/documents')}>
          <Text style={styles.statNumber}>{documents.data?.length ?? '-'}</Text>
          <Text style={styles.statLabel}>Documents</Text>
        </Card>
        <Card style={styles.stat} onPress={() => router.push('/(individual)/requests')}>
          <Text style={styles.statNumber}>{pendingCount ?? '-'}</Text>
          <Text style={styles.statLabel}>Pending requests</Text>
        </Card>
      </View>

      {documents.data?.length === 0 ? (
        <Button title="Upload your CV" onPress={() => router.push('/(individual)/documents/new')} />
      ) : null}

    </Screen>
  );
}

const styles = StyleSheet.create({
  hello: { ...typography.body, color: colors.textMuted },
  name: { ...typography.title, color: colors.text, marginBottom: spacing.xl },
  cardTitle: { ...typography.subheading, color: colors.text },
  cardAction: { marginTop: spacing.md },
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  fill: { height: 8, backgroundColor: colors.primary },
  stats: { flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 30, fontWeight: '700', color: colors.primary },
  statLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
