import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../src/components/common/Button';
import { Card } from '../../../src/components/common/Card';
import { DetailRow } from '../../../src/components/common/DetailRow';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { FormError } from '../../../src/components/common/FormError';
import { QueryBoundary } from '../../../src/components/common/QueryBoundary';
import { Screen } from '../../../src/components/common/Screen';
import { SectionTitle } from '../../../src/components/common/SectionTitle';
import { StatusBadge } from '../../../src/components/common/StatusBadge';
import { AccessDocuments } from '../../../src/components/company/AccessDocuments';
import { EditMessageForm } from '../../../src/components/company/EditMessageForm';
import { useCancelRequest, useRequest } from '../../../src/hooks/useRequests';
import { colors, spacing, typography } from '../../../src/theme/theme';
import { confirmDestructive } from '../../../src/utils/dialogs';
import { toUserMessage } from '../../../src/utils/errors';
import { formatDate } from '../../../src/utils/formatters';

export default function CompanyRequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const request = useRequest(id);
  const cancelRequest = useCancelRequest();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Screen>
      <QueryBoundary query={request}>
        {(data) =>
          data === null ? (
            <EmptyState
              icon="alert-circle-outline"
              title="Request not found"
              message="It may have been cancelled."
            />
          ) : (
            <>
              <Card>
                <View style={styles.top}>
                  <Text style={styles.name} numberOfLines={2}>
                    {data.individual?.full_name ?? 'Unknown candidate'}
                  </Text>
                  <StatusBadge status={data.status} />
                </View>
                {data.individual?.headline ? (
                  <DetailRow label="Headline" value={data.individual.headline} />
                ) : null}
                {data.individual?.location ? (
                  <DetailRow label="Location" value={data.individual.location} />
                ) : null}
                <DetailRow label="Sent" value={formatDate(data.created_at)} />
                <DetailRow label="Your message" value={data.message || 'No message'} />
                {data.responded_at ? (
                  <DetailRow label="They responded" value={formatDate(data.responded_at)} />
                ) : null}
              </Card>

              {data.status === 'pending' ? (
                isEditing ? (
                  <EditMessageForm request={data} onDone={() => setIsEditing(false)} />
                ) : (
                  <>
                    <FormError
                      message={
                        cancelRequest.isError ? toUserMessage(cancelRequest.error) : undefined
                      }
                    />
                    <Button
                      title="Edit message"
                      variant="secondary"
                      onPress={() => setIsEditing(true)}
                    />
                    <Button
                      title="Cancel request"
                      variant="danger"
                      style={styles.gap}
                      loading={cancelRequest.isPending}
                      onPress={() =>
                        confirmDestructive({
                          title: 'Cancel request',
                          message: 'The candidate will no longer see this request.',
                          confirmLabel: 'Cancel request',
                          onConfirm: () =>
                            cancelRequest.mutate(data.id, { onSuccess: () => router.back() }),
                        })
                      }
                    />
                  </>
                )
              ) : null}

              {data.status === 'accepted' ? (
                <>
                  <SectionTitle>Documents</SectionTitle>
                  <AccessDocuments ownerId={data.individual_id} />
                </>
              ) : null}

              {data.status === 'rejected' ? (
                <Text style={styles.note}>The candidate declined to share their documents.</Text>
              ) : null}
            </>
          )
        }
      </QueryBoundary>
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
  gap: { marginTop: spacing.md },
  note: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
});
