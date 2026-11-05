import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text } from 'react-native';
import { Button } from '../../src/components/common/Button';
import { FormError } from '../../src/components/common/FormError';
import { FormField } from '../../src/components/common/FormField';
import { Screen } from '../../src/components/common/Screen';
import { useConfirmPasswordReset, useRequestPasswordReset } from '../../src/hooks/useAuthActions';
import { colors, spacing, typography } from '../../src/theme/theme';
import { toUserMessage } from '../../src/utils/errors';
import {
  ResetConfirmValues,
  ResetRequestValues,
  resetConfirmSchema,
  resetRequestSchema,
} from '../../src/utils/schemas';

/** Two steps: ask for a one-time code by email, then enter the code with a new password. */
export default function ForgotPasswordScreen() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const requestReset = useRequestPasswordReset();
  const confirmReset = useConfirmPasswordReset();

  const requestForm = useForm<ResetRequestValues>({
    resolver: zodResolver(resetRequestSchema),
    defaultValues: { email: '' },
  });
  const confirmForm = useForm<ResetConfirmValues>({
    resolver: zodResolver(resetConfirmSchema),
    defaultValues: { code: '', newPassword: '' },
  });

  const sendCode = requestForm.handleSubmit(({ email }) =>
    requestReset.mutate(email, { onSuccess: () => setSentTo(email) }),
  );
  const resetPassword = confirmForm.handleSubmit(({ code, newPassword }) => {
    if (sentTo) confirmReset.mutate({ email: sentTo, code, newPassword });
  });

  return (
    <Screen>
      <Text style={{ ...typography.title, color: colors.text, marginBottom: spacing.sm }}>
        Reset password
      </Text>
      {sentTo === null ? (
        <>
          <Text style={{ ...typography.body, color: colors.textMuted, marginBottom: spacing.xl }}>
            Enter your email and we will send you a code.
          </Text>
          <FormField
            control={requestForm.control}
            name="email"
            label="Email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          <FormError
            message={requestReset.isError ? toUserMessage(requestReset.error) : undefined}
          />
          <Button title="Send code" loading={requestReset.isPending} onPress={sendCode} />
        </>
      ) : (
        <>
          <Text style={{ ...typography.body, color: colors.textMuted, marginBottom: spacing.xl }}>
            We sent a code to {sentTo}. Enter it below with your new password.
          </Text>
          <FormField
            control={confirmForm.control}
            name="code"
            label="Code from email"
            keyboardType="number-pad"
            maxLength={8}
          />
          <FormField
            control={confirmForm.control}
            name="newPassword"
            label="New password"
            secureTextEntry
            textContentType="newPassword"
            hint="At least 8 characters"
          />
          <FormError
            message={confirmReset.isError ? toUserMessage(confirmReset.error) : undefined}
          />
          <Button
            title="Set new password"
            loading={confirmReset.isPending}
            onPress={resetPassword}
          />
          <Button
            title="Use a different email"
            variant="ghost"
            style={{ marginTop: spacing.md }}
            onPress={() => setSentTo(null)}
          />
        </>
      )}
    </Screen>
  );
}
