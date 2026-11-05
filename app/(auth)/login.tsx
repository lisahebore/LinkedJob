import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Text } from 'react-native';
import { Button } from '../../src/components/common/Button';
import { FormError } from '../../src/components/common/FormError';
import { FormField } from '../../src/components/common/FormField';
import { Screen } from '../../src/components/common/Screen';
import { useSignIn } from '../../src/hooks/useAuthActions';
import { colors, spacing, typography } from '../../src/theme/theme';
import { toUserMessage } from '../../src/utils/errors';
import { LoginValues, loginSchema } from '../../src/utils/schemas';

export default function LoginScreen() {
  const router = useRouter();
  const signIn = useSignIn();
  const { control, handleSubmit } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <Screen>
      <Text style={{ ...typography.title, color: colors.text, marginBottom: spacing.xl }}>
        Welcome back
      </Text>
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
        textContentType="password"
      />
      <FormError message={signIn.isError ? toUserMessage(signIn.error) : undefined} />
      <Button
        title="Sign in"
        loading={signIn.isPending}
        onPress={handleSubmit((values) => signIn.mutate(values))}
      />
      <Button
        title="Forgot password?"
        variant="ghost"
        style={{ marginTop: spacing.md }}
        onPress={() => router.push('/(auth)/forgot-password')}
      />
    </Screen>
  );
}
