import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../src/components/common/Button';
import { Card } from '../../../src/components/common/Card';
import { DetailRow } from '../../../src/components/common/DetailRow';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { FormError } from '../../../src/components/common/FormError';
import { QueryBoundary } from '../../../src/components/common/QueryBoundary';
import { Screen } from '../../../src/components/common/Screen';
import { StatusBadge } from '../../../src/components/common/StatusBadge';
import { useRequest, useRespondToRequest } from '../../../src/hooks/useRequests';
import { colors, spacing, typography } from '../../../src/theme/theme';
import { confirmDestructive } from '../../../src/utils/dialogs';
import { toUserMessage } from '../../../src/utils/errors';
import { formatDate } from '../../../src/utils/formatters';

export default function IndividualRequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const request = useRequest(id);
  const respond = useRespondToRequest(id);

  return (
    <Screen>
      <QueryBoundary query={request}>
        {(data) =>
          data === null ? (
            <EmptyState icon="alert-circle-outline" title="Request not found" />
          ) : (
            <>
              <Card>
                <View style={styles.top}>
                  <Text style={styles.company} numberOfLines={2}>
                    {data.company?.company_name ?? 'Unknown company'}
                  </Text>
                  <StatusBadge status={data.status} />
                </View>
                {data.company?.industry ? (
                  <DetailRow label="Industry" value={data.company.industry} />
                ) : null}
                {data.company?.location ? (
                  <DetailRow label="Location" value={data.company.location} />
                ) : null}
                <DetailRow label="Asked for access to" value="All your uploaded documents" />
                <DetailRow label="Sent" value={formatDate(data.created_at)} />
                {data.message ? <DetailRow label="Their message" value={data.message} /> : null}
                {data.responded_at ? (
                  <DetailRow label="You responded" value={formatDate(data.responded_at)} />
                ) : null}
              </Card>

              {data.status === 'pending' ? (
                <>
                  <FormError message={respond.isError ? toUserMessage(respond.error) : undefined} />
                  <View style={styles.actions}>
                    <Button
                      title="Accept"
                      style={styles.action}
                      loading={respond.isPending && respond.variables === 'accepted'}
                      disabled={respond.isPending}
                      onPress={() => respond.mutate('accepted')}
                    />
                    <Button
                      title="Decline"
                      variant="danger"
                      style={styles.action}
                      loading={respond.isPending && respond.variables === 'rejected'}
                      disabled={respond.isPending}
                      onPress={() =>
                        confirmDestructive({
                          title: 'Decline request',
                          message: 'This company will not be able to see your documents.',
                          confirmLabel: 'Decline',
                          onConfirm: () => respond.mutate('rejected'),
                        })
                      }
                    />
                  </View>
                </>
              ) : (
                <Text style={styles.note}>
                  {data.status === 'accepted'
                    ? 'This company can view and download your documents.'
                    : 'This company cannot see your documents.'}
                </Text>
              )}
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
  company: { ...typography.heading, color: colors.text, flex: 1 },
  actions: { flexDirection: 'row', gap: spacing.md },
  action: { flex: 1 },
  note: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
});
