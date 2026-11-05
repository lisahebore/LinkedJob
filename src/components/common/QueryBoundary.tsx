import { UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme/theme';
import { toUserMessage } from '../../utils/errors';
import { ErrorState } from './ErrorState';
import { Loader } from './Loader';

interface Props<T> {
  query: UseQueryResult<T>;
  children: (data: T) => React.ReactNode;
}

/**
 * Gives every data screen the same three non-success states: loading, error with retry, and a
 * "showing saved data" notice when a refresh fails but a cached copy is still on screen.
 */
export function QueryBoundary<T>({ query, children }: Props<T>) {
  if (query.data === undefined) {
    if (query.isPending && query.fetchStatus !== 'paused') return <Loader />;
    const message = query.isError
      ? toUserMessage(query.error)
      : 'You are offline and nothing has been saved on this device yet.';
    return <ErrorState message={message} onRetry={() => query.refetch()} />;
  }

  return (
    <View style={styles.flex}>
      {query.isRefetchError ? (
        <Pressable style={styles.notice} onPress={() => query.refetch()}>
          <Text style={styles.noticeText}>
            Could not refresh. Showing saved data. Tap to retry.
          </Text>
        </Pressable>
      ) : null}
      {children(query.data)}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  notice: {
    backgroundColor: colors.warningBg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  noticeText: { ...typography.small, color: colors.warning, textAlign: 'center' },
});
