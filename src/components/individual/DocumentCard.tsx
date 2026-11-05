import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme/theme';
import { DocumentRow } from '../../types/models';
import { formatDate, formatFileSize } from '../../utils/formatters';
import { Card } from '../common/Card';

interface Props {
  document: DocumentRow;
  onPress?: () => void;
}

export function DocumentCard({ document, onPress }: Props) {
  return (
    <Card onPress={onPress}>
      <View style={styles.row}>
        <Ionicons name="document-text-outline" size={32} color={colors.primary} />
        <View style={styles.info}>
          <Text style={styles.label} numberOfLines={1}>
            {document.label}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {document.file_name}
          </Text>
          <Text style={styles.meta}>
            {formatFileSize(document.size_bytes)} · {formatDate(document.created_at)}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1 },
  label: { ...typography.subheading, color: colors.text },
  meta: { ...typography.small, color: colors.textMuted, marginTop: 2 },
});
