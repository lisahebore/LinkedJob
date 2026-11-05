import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useDocuments, useOpenDocument } from '../../hooks/useDocuments';
import { colors, spacing, typography } from '../../theme/theme';
import { toUserMessage } from '../../utils/errors';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { DocumentCard } from '../individual/DocumentCard';

/** The candidate's documents, shown to a company only once the candidate has accepted. */
export function AccessDocuments({ ownerId }: { ownerId: string }) {
  const documents = useDocuments(ownerId);
  const openDocument = useOpenDocument();

  if (documents.isPending)
    return <ActivityIndicator color={colors.primary} style={styles.spinner} />;
  if (documents.isError) {
    return (
      <Card>
        <Text style={styles.error}>{toUserMessage(documents.error)}</Text>
        <Button
          title="Try again"
          variant="secondary"
          onPress={() => documents.refetch()}
          style={styles.retry}
        />
      </Card>
    );
  }
  if (documents.data.length === 0) {
    return (
      <Card>
        <Text style={styles.muted}>The candidate has no documents to share right now.</Text>
      </Card>
    );
  }

  return (
    <View>
      {documents.data.map((document) => (
        <View key={document.id}>
          <DocumentCard document={document} />
          <Button
            title="View / download"
            variant="secondary"
            loading={openDocument.isPending && openDocument.variables?.id === document.id}
            onPress={() => openDocument.mutate(document)}
            style={styles.action}
          />
        </View>
      ))}
      {openDocument.isError ? (
        <Text style={styles.error}>{toUserMessage(openDocument.error)}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  muted: { ...typography.body, color: colors.textMuted },
  action: { marginTop: -spacing.xs, marginBottom: spacing.lg },
  error: { ...typography.small, color: colors.danger },
  spinner: { marginVertical: spacing.xl },
  retry: { marginTop: spacing.md },
});
