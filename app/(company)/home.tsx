import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../src/components/common/Button';
import { Card } from '../../src/components/common/Card';
import { Screen } from '../../src/components/common/Screen';
import { useCompany } from '../../src/hooks/useAuth';
import { useRequests } from '../../src/hooks/useRequests';
import { colors, spacing, typography } from '../../src/theme/theme';
import { RequestStatus } from '../../src/types/models';


export default function CompanyHomeScreen() {
  const router = useRouter();
  const company = useCompany();
  const requests = useRequests();

  const countByStatus = (status: RequestStatus) =>
    requests.data ? requests.data.filter((request) => request.status === status).length : '-';

  return (
    <Screen>
      <Text style={styles.hello}>Welcome,</Text>
      <Text style={styles.name} numberOfLines={1}>
        {company.company_name}
      </Text>

      {company.verification !== 'verified' ? (
        <Card
          style={company.verification === 'rejected' ? styles.bannerRejected : styles.bannerPending}
          onPress={() => router.push('/(company)/profile')}
        >
          <Text style={styles.bannerTitle}>
            {company.verification === 'rejected'
              ? 'IPA verification declined'
              : 'IPA verification pending'}
          </Text>
          <Text style={styles.bannerBody}>
            {company.verification === 'rejected'
              ? 'We could not verify your IPA number. Please contact support.'
              : 'You can browse candidates once an administrator verifies your IPA number.'}
          </Text>
        </Card>
      ) : null}

      <View style={styles.stats}>
        <Card style={styles.stat}>
          <Text style={styles.statNumber}>{countByStatus('pending')}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={styles.statNumber}>{countByStatus('accepted')}</Text>
          <Text style={styles.statLabel}>Accepted</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={styles.statNumber}>{countByStatus('rejected')}</Text>
          <Text style={styles.statLabel}>Declined</Text>
        </Card>
      </View>

      <Button title="Browse candidates" onPress={() => router.push('/(company)/candidates')} />

    </Screen>
  );
}

const styles = StyleSheet.create({
  hello: { ...typography.body, color: colors.textMuted },
  name: { ...typography.title, color: colors.text, marginBottom: spacing.xl },
  bannerPending: { backgroundColor: colors.warningBg, borderColor: colors.warning },
  bannerRejected: { backgroundColor: colors.dangerBg, borderColor: colors.danger },
  bannerTitle: { ...typography.subheading, color: colors.text },
  bannerBody: { ...typography.small, color: colors.text, marginTop: spacing.xs },
  stats: { flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: '700', color: colors.primary },
  statLabel: { ...typography.small, color: colors.textMuted, marginTop: spacing.xs },
});
