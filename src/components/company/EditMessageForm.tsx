import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateRequestMessage } from '../../hooks/useRequests';
import { spacing } from '../../theme/theme';
import { RequestWithParties } from '../../types/models';
import { toUserMessage } from '../../utils/errors';
import { RequestValues, requestSchema } from '../../utils/schemas';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { FormError } from '../common/FormError';
import { FormField } from '../common/FormField';

interface Props {
  request: RequestWithParties;
  onDone: () => void;
}

/** Starts with the message the company already sent, and saves the change to the database. */
export function EditMessageForm({ request, onDone }: Props) {
  const updateMessage = useUpdateRequestMessage(request.id);
  const { control, handleSubmit } = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { message: request.message },
  });

  return (
    <Card>
      <FormField control={control} name="message" label="Message" multiline maxLength={500} />
      <FormError message={updateMessage.isError ? toUserMessage(updateMessage.error) : undefined} />
      <Button
        title="Save message"
        loading={updateMessage.isPending}
        onPress={handleSubmit(({ message }) =>
          updateMessage.mutate(message, { onSuccess: onDone }),
        )}
      />
      <Button
        title="Cancel"
        variant="ghost"
        disabled={updateMessage.isPending}
        style={{ marginTop: spacing.sm }}
        onPress={onDone}
      />
    </Card>
  );
}
