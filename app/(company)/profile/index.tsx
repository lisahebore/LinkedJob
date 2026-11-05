import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../src/components/common/Button';
import { Card } from '../../../src/components/common/Card';
import { DetailRow } from '../../../src/components/common/DetailRow';
import { Screen } from '../../../src/components/common/Screen';
import { SignOutButton } from '../../../src/components/common/SignOutButton';
import { StatusBadge } from '../../../src/components/common/StatusBadge';
import { useAuth, useCompany } from '../../../src/hooks/useAuth';
import { colors, spacing, typography } from '../../../src/theme/theme';

const VERIFICATION_HINT = {
  pending:
    'An administrator is checking your IPA number. You can browse candidates once it is verified.',
  verified: 'Your IPA number has been verified. You can browse candidates and send requests.',
  rejected: 'We could not verify your IPA number. Please contact support.',
} as const;

export default function CompanyProfileScreen() {
  const router = useRouter();
  const company = useCompany();
  const { email } = useAuth();

  return (
    <Screen>
      <Card>
        <View style={styles.top}>
          <Text style={styles.name} numberOfLines={2}>
            {company.company_name}
          </Text>
          <StatusBadge status={company.verification} />
        </View>
        <Text style={styles.hint}>{VERIFICATION_HINT[company.verification]}</Text>
      </Card>
      <Card>
        <DetailRow label="IPA number" value={company.ipa_number} />
        <DetailRow label="Industry" value={company.industry || 'Not set'} />
        <DetailRow label="Location" value={company.location || 'Not set'} />
        <DetailRow label="Website" value={company.website || 'Not set'} />
        <DetailRow label="About" value={company.about || 'Tell candidates about your company.'} />
        <DetailRow label="Account email" value={email} />
      </Card>
      <Button title="Edit company profile" onPress={() => router.push('/(company)/profile/edit')} />
      <SignOutButton style={styles.signOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  name: { ...typography.heading, color: colors.text, flex: 1 },
  hint: { ...typography.small, color: colors.textMuted, marginTop: spacing.md },
  signOut: { marginTop: spacing.md },
});
