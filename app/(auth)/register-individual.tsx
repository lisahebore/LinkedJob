import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Text } from 'react-native';
import { Button } from '../../src/components/common/Button';
import { Card } from '../../src/components/common/Card';
import { FormError } from '../../src/components/common/FormError';
import { FormField } from '../../src/components/common/FormField';
import { Screen } from '../../src/components/common/Screen';
import { useSignUpIndividual } from '../../src/hooks/useAuthActions';
import { colors, spacing, typography } from '../../src/theme/theme';
import { toUserMessage } from '../../src/utils/errors';
import { RegisterIndividualValues, registerIndividualSchema } from '../../src/utils/schemas';

export default function RegisterIndividualScreen() {
  const router = useRouter();
  const signUp = useSignUpIndividual();
  const { control, handleSubmit } = useForm<RegisterIndividualValues>({
    resolver: zodResolver(registerIndividualSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  });

  return (
    <Screen>
      <Text style={{ ...typography.title, color: colors.text, marginBottom: spacing.xl }}>
        Create your profile
      </Text>
      {signUp.data?.needsEmailConfirmation ? (
        <Card>
          <Text style={{ ...typography.body, color: colors.text }}>
            Account created. Check your email to confirm your address, then sign in.
          </Text>
          <Button
            title="Go to sign in"
            style={{ marginTop: spacing.md }}
            onPress={() => router.replace('/(auth)/login')}
          />
        </Card>
      ) : (
        <>
          <FormField
            control={control}
            name="fullName"
            label="Full name"
            autoCapitalize="words"
            maxLength={100}
          />
          <FormField
            control={control}
            name="email"
            label="Email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <FormField
            control={control}
            name="password"
            label="Password"
            secureTextEntry
            textContentType="newPassword"
            hint="At least 8 characters"
          />
          <FormError message={signUp.isError ? toUserMessage(signUp.error) : undefined} />
          <Button
            title="Create account"
            loading={signUp.isPending}
            onPress={handleSubmit((values) => signUp.mutate(values))}
          />
          <Button
            title="Already have an account? Sign in"
            variant="ghost"
            style={{ marginTop: spacing.md }}
            onPress={() => router.replace('/(auth)/login')}
          />
        </>
      )}
    </Screen>
  );
}
