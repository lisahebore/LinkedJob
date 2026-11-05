import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button } from '../../../src/components/common/Button';
import { Card } from '../../../src/components/common/Card';
import { ChipRow } from '../../../src/components/common/Chip';
import { Screen } from '../../../src/components/common/Screen';
import { SectionTitle } from '../../../src/components/common/SectionTitle';
import { SignOutButton } from '../../../src/components/common/SignOutButton';
import { ProfileHeader } from '../../../src/components/individual/ProfileHeader';
import { useAuth, useIndividual } from '../../../src/hooks/useAuth';
import { colors, spacing, typography } from '../../../src/theme/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const profile = useIndividual();
  const { email } = useAuth();

  return (
    <Screen>
      <Card>
        <ProfileHeader
          name={profile.full_name}
          headline={profile.headline}
          location={profile.location}
        />
      </Card>
      <Card>
        <SectionTitle>About</SectionTitle>
        <Text style={styles.body}>
          {profile.bio || 'Add a short bio so companies can get to know you.'}
        </Text>
      </Card>
      <Card>
        <SectionTitle>Skills</SectionTitle>
        {profile.skills.length > 0 ? (
          <ChipRow items={profile.skills} />
        ) : (
          <Text style={styles.body}>No skills added yet.</Text>
        )}
      </Card>
      <Card>
        <SectionTitle>Account</SectionTitle>
        <Text style={styles.body}>{email}</Text>
        <Text style={styles.hint}>
          Companies never see your email. Only your documents, once you accept.
        </Text>
      </Card>
      <Button title="Edit profile" onPress={() => router.push('/(individual)/profile/edit')} />
      <SignOutButton style={styles.signOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { ...typography.body, color: colors.text },
  hint: { ...typography.small, color: colors.textMuted, marginTop: spacing.sm },
  signOut: { marginTop: spacing.md },
});
