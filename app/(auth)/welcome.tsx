import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../src/components/common/Button';
import { Screen } from '../../src/components/common/Screen';
import { colors, spacing, typography } from '../../src/theme/theme';

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <Screen safeTop>
      <View style={styles.hero}>
        <Ionicons name="briefcase" size={64} color={colors.primary} />
        <Text style={styles.brand}>LinkedJob</Text>
        <Text style={styles.tagline}>
          Build your profile, upload your CV, and stay in control of who sees it.
        </Text>
      </View>
      <Button
        title="I'm looking for a job"
        onPress={() => router.push('/(auth)/register-individual')}
      />
      <Button
        title="I'm a company hiring"
        variant="secondary"
        style={styles.gap}
        onPress={() => router.push('/(auth)/register-company')}
      />
      <Button
        title="I already have an account"
        variant="ghost"
        style={styles.gap}
        onPress={() => router.push('/(auth)/login')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', marginVertical: spacing.xxl },
  brand: { ...typography.title, color: colors.primaryDark, marginTop: spacing.md },
  tagline: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  gap: { marginTop: spacing.md },
});
