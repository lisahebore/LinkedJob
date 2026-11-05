import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';
import { Button } from '../../../src/components/common/Button';
import { Card } from '../../../src/components/common/Card';
import { FormError } from '../../../src/components/common/FormError';
import { FormField } from '../../../src/components/common/FormField';
import { Screen } from '../../../src/components/common/Screen';
import { useIndividual } from '../../../src/hooks/useAuth';
import { useCreateDocument } from '../../../src/hooks/useDocuments';
import { useDocumentPicker } from '../../../src/hooks/useDocumentPicker';
import { colors, spacing, typography } from '../../../src/theme/theme';
import { PickedFile } from '../../../src/types/files';
import { toUserMessage } from '../../../src/utils/errors';
import { formatFileSize } from '../../../src/utils/formatters';
import { DocumentValues, documentSchema } from '../../../src/utils/schemas';

export default function NewDocumentScreen() {
  const router = useRouter();
  const profile = useIndividual();
  const createDocument = useCreateDocument();
  const { pick, isPicking } = useDocumentPicker();
  const [file, setFile] = useState<PickedFile | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const { control, handleSubmit, setValue } = useForm<DocumentValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: { label: '' },
  });

  const choose = async () => {
    setFileError(null);
    try {
      const picked = await pick();
      if (!picked) return;
      setFile(picked);
      setValue('label', picked.name.replace(/\.[^.]+$/, '').slice(0, 80), { shouldValidate: true });
    } catch (error) {
      setFileError(toUserMessage(error));
    }
  };

  const save = handleSubmit(({ label }) => {
    if (!file) {
      setFileError('Choose a PDF or Word file first.');
      return;
    }
    createDocument.mutate({ ownerId: profile.id, label, file }, { onSuccess: () => router.back() });
  });

  return (
    <Screen>
      <Button
        title={file ? 'Choose a different file' : 'Choose a PDF or Word file'}
        variant="secondary"
        loading={isPicking}
        disabled={createDocument.isPending}
        onPress={choose}
      />
      {fileError ? <Text style={styles.fileError}>{fileError}</Text> : null}
      {file ? (
        <Card style={styles.fileCard}>
          <Text style={styles.fileName} numberOfLines={2}>
            {file.name}
          </Text>
          <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
        </Card>
      ) : null}

      <FormField
        control={control}
        name="label"
        label="Name"
        maxLength={80}
        placeholder="e.g. My CV 2026"
        hint="This is what companies see when they ask for access."
        style={styles.labelInput}
      />
      <FormError
        message={createDocument.isError ? toUserMessage(createDocument.error) : undefined}
      />
      <Button title="Upload" loading={createDocument.isPending} onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  fileError: { ...typography.small, color: colors.danger, marginTop: spacing.sm },
  fileCard: { marginTop: spacing.lg },
  fileName: { ...typography.subheading, color: colors.text },
  fileSize: { ...typography.small, color: colors.textMuted, marginTop: 2 },
  labelInput: { marginTop: spacing.xs },
});
