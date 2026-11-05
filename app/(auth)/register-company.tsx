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
import { useSignUpCompany } from '../../src/hooks/useAuthActions';
import { colors, spacing, typography } from '../../src/theme/theme';
import { toUserMessage } from '../../src/utils/errors';
import { RegisterCompanyValues, registerCompanySchema } from '../../src/utils/schemas';

export default function RegisterCompanyScreen() {
  const router = useRouter();
  const signUp = useSignUpCompany();
  const { control, handleSubmit } = useForm<RegisterCompanyValues>({
    resolver: zodResolver(registerCompanySchema),
    defaultValues: { companyName: '', ipaNumber: '', email: '', password: '' },
  });

  return (
    <Screen>
      <Text style={{ ...typography.title, color: colors.text, marginBottom: spacing.sm }}>
        Register your company
      </Text>
      <Text style={{ ...typography.body, color: colors.textMuted, marginBottom: spacing.xl }}>
        Your IPA number is checked by an administrator before you can browse candidates.
      </Text>
      {signUp.data?.needsEmailConfirmation ? (
        <Card>
          <Text style={{ ...typography.body, color: colors.text }}>
            Company registered. Check your email to confirm your address, then sign in.
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
            name="companyName"
            label="Company name"
            autoCapitalize="words"
            maxLength={120}
          />
          <FormField
            control={control}
            name="ipaNumber"
            label="IPA registration number"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={25}
          />
          <FormField
            control={control}
            name="email"
            label="Work email"
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
            title="Register company"
            loading={signUp.isPending}
            onPress={handleSubmit((values) => signUp.mutate(values))}
          />
          <Button
            title="Already registered? Sign in"
            variant="ghost"
            style={{ marginTop: spacing.md }}
            onPress={() => router.replace('/(auth)/login')}
          />
        </>
      )}
    </Screen>
  );
}
