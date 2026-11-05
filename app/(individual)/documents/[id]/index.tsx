import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { Button } from '../../../../src/components/common/Button';
import { Card } from '../../../../src/components/common/Card';
import { DetailRow } from '../../../../src/components/common/DetailRow';
import { EmptyState } from '../../../../src/components/common/EmptyState';
import { FormError } from '../../../../src/components/common/FormError';
import { QueryBoundary } from '../../../../src/components/common/QueryBoundary';
import { Screen } from '../../../../src/components/common/Screen';
import {
  useDeleteDocument,
  useDocument,
  useOpenDocument,
} from '../../../../src/hooks/useDocuments';
import { colors, spacing, typography } from '../../../../src/theme/theme';
import { confirmDestructive } from '../../../../src/utils/dialogs';
import { toUserMessage } from '../../../../src/utils/errors';
import { formatDate, formatFileSize } from '../../../../src/utils/formatters';
import { asHref } from '../../../../src/utils/navigation';

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const document = useDocument(id);
  const openDocument = useOpenDocument();
  const deleteDocument = useDeleteDocument();

  return (
    <Screen>
      <QueryBoundary query={document}>
        {(data) =>
          data === null ? (
            <EmptyState
              icon="alert-circle-outline"
              title="Document not found"
              message="It may have been deleted."
            />
          ) : (
            <>
              <Card>
                <Text style={{ ...typography.heading, color: colors.text }}>{data.label}</Text>
                <DetailRow label="File name" value={data.file_name} />
                <DetailRow label="Size" value={formatFileSize(data.size_bytes)} />
                <DetailRow label="Uploaded" value={formatDate(data.created_at)} />
              </Card>

              <FormError
                message={
                  openDocument.isError
                    ? toUserMessage(openDocument.error)
                    : deleteDocument.isError
                      ? toUserMessage(deleteDocument.error)
                      : undefined
                }
              />
              <Button
                title="View / download"
                loading={openDocument.isPending}
                onPress={() => openDocument.mutate(data)}
              />
              <Button
                title="Rename"
                variant="secondary"
                style={{ marginTop: spacing.md }}
                onPress={() => router.push(asHref(`/(individual)/documents/${data.id}/edit`))}
              />
              <Button
                title="Delete"
                variant="danger"
                style={{ marginTop: spacing.md }}
                loading={deleteDocument.isPending}
                onPress={() =>
                  confirmDestructive({
                    title: 'Delete document',
                    message: `"${data.label}" will be permanently removed. Companies will no longer be able to see it.`,
                    confirmLabel: 'Delete',
                    onConfirm: () =>
                      deleteDocument.mutate(data, { onSuccess: () => router.back() }),
                  })
                }
              />
            </>
          )
        }
      </QueryBoundary>
    </Screen>
  );
}
