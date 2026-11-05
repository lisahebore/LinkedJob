import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Text } from 'react-native';
import { useCreateRequest, useRequests } from '../../hooks/useRequests';
import { colors, spacing, typography } from '../../theme/theme';
import { Profile } from '../../types/models';
import { toUserMessage } from '../../utils/errors';
import { formatDate } from '../../utils/formatters';
import { asHref } from '../../utils/navigation';
import { RequestValues, requestSchema } from '../../utils/schemas';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { FormError } from '../common/FormError';
import { FormField } from '../common/FormField';
import { QueryBoundary } from '../common/QueryBoundary';
import { SectionTitle } from '../common/SectionTitle';
import { StatusBadge } from '../common/StatusBadge';
import { AccessDocuments } from './AccessDocuments';

function RequestForm({ candidate, wasDeclined }: { candidate: Profile; wasDeclined: boolean }) {
  const createRequest = useCreateRequest();
  const { control, handleSubmit, reset } = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { message: '' },
  });

  return (
    <Card>
      <SectionTitle>Request access to documents</SectionTitle>
      <Text style={{ ...typography.small, color: colors.textMuted, marginBottom: spacing.md }}>
        {wasDeclined
          ? 'Your earlier request was declined. You can send a new one.'
          : `${candidate.full_name} decides whether to share their documents with you.`}
      </Text>
      <FormField
        control={control}
        name="message"
        label="Message (optional)"
        multiline
        maxLength={500}
        placeholder="Tell the candidate about the role"
      />
      <FormError message={createRequest.isError ? toUserMessage(createRequest.error) : undefined} />
      <Button
        title="Send request"
        loading={createRequest.isPending}
        onPress={handleSubmit((values) =>
          createRequest.mutate(
            { individualId: candidate.id, message: values.message },
            { onSuccess: () => reset() },
          ),
        )}
      />
    </Card>
  );
}

/** Shows whichever step the company is at: ask, wait, or read the documents. */
export function CandidateRequestPanel({ candidate }: { candidate: Profile }) {
  const router = useRouter();
  const requests = useRequests();

  return (
    <QueryBoundary query={requests}>
      {(all) => {
        // The list is newest first, so the first match is the latest request for this person.
        const latest = all.find((request) => request.individual_id === candidate.id);

        if (latest?.status === 'accepted') {
          return (
            <>
              <SectionTitle>Documents</SectionTitle>
              <AccessDocuments ownerId={candidate.id} />
            </>
          );
        }
        if (latest?.status === 'pending') {
          return (
            <Card>
              <StatusBadge status="pending" />
              <Text style={{ ...typography.body, color: colors.text, marginVertical: spacing.md }}>
                Sent {formatDate(latest.created_at)}. Waiting for {candidate.full_name} to respond.
              </Text>
              <Button
                title="View request"
                variant="secondary"
                onPress={() => router.push(asHref(`/(company)/requests/${latest.id}`))}
              />
            </Card>
          );
        }
        return <RequestForm candidate={candidate} wasDeclined={latest?.status === 'rejected'} />;
      }}
    </QueryBoundary>
  );
}
