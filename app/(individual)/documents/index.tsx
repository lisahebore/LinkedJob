import { useRouter } from 'expo-router';
import React from 'react';
import { Button } from '../../../src/components/common/Button';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { QueryList } from '../../../src/components/common/QueryList';
import { Screen } from '../../../src/components/common/Screen';
import { DocumentCard } from '../../../src/components/individual/DocumentCard';
import { useIndividual } from '../../../src/hooks/useAuth';
import { useDocuments } from '../../../src/hooks/useDocuments';
import { spacing } from '../../../src/theme/theme';
import { asHref } from '../../../src/utils/navigation';

export default function DocumentsListScreen() {
  const router = useRouter();
  const profile = useIndividual();
  const documents = useDocuments(profile.id);

  return (
    <Screen scroll={false} padded={false}>
      <QueryList
        query={documents}
        keyExtractor={(document) => document.id}
        header={
          <Button
            title="Upload a document"
            style={{ marginBottom: spacing.lg }}
            onPress={() => router.push('/(individual)/documents/new')}
          />
        }
        empty={
          <EmptyState
            icon="document-text-outline"
            title="No documents yet"
            message="Upload your CV (PDF or Word, up to 5 MB). Companies can only see it if you accept their request."
          />
        }
        renderItem={({ item }) => (
          <DocumentCard
            document={item}
            onPress={() => router.push(asHref(`/(individual)/documents/${item.id}`))}
          />
        )}
      />
    </Screen>
  );
}
