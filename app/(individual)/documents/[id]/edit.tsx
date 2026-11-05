import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../../src/components/common/Button';
import { EmptyState } from '../../../../src/components/common/EmptyState';
import { FormError } from '../../../../src/components/common/FormError';
import { FormField } from '../../../../src/components/common/FormField';
import { QueryBoundary } from '../../../../src/components/common/QueryBoundary';
import { Screen } from '../../../../src/components/common/Screen';
import { useDocument, useUpdateDocument } from '../../../../src/hooks/useDocuments';
import { DocumentRow } from '../../../../src/types/models';
import { toUserMessage } from '../../../../src/utils/errors';
import { DocumentValues, documentSchema } from '../../../../src/utils/schemas';

/** Mounted only after the document has loaded, so the form starts with its current name. */
function RenameForm({ document }: { document: DocumentRow }) {
  const router = useRouter();
  const updateDocument = useUpdateDocument(document.id);
  const { control, handleSubmit } = useForm<DocumentValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: { label: document.label },
  });

  return (
    <>
      <FormField control={control} name="label" label="Name" maxLength={80} />
      <FormError
        message={updateDocument.isError ? toUserMessage(updateDocument.error) : undefined}
      />
      <Button
        title="Save"
        loading={updateDocument.isPending}
        onPress={handleSubmit(({ label }) =>
          updateDocument.mutate(label, { onSuccess: () => router.back() }),
        )}
      />
    </>
  );
}

export default function EditDocumentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const document = useDocument(id);

  return (
    <Screen>
      <QueryBoundary query={document}>
        {(data) =>
          data === null ? (
            <EmptyState icon="alert-circle-outline" title="Document not found" />
          ) : (
            <RenameForm document={data} />
          )
        }
      </QueryBoundary>
    </Screen>
  );
}
