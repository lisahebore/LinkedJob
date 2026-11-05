import { UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import { FlatList, ListRenderItem, RefreshControl, StyleSheet } from 'react-native';
import { spacing } from '../../theme/theme';
import { QueryBoundary } from './QueryBoundary';

interface Props<T> {
  query: UseQueryResult<T[]>;
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T) => string;
  /** Shown when the list is empty, so a new user never sees a blank screen. */
  empty: React.ReactElement;
  header?: React.ReactElement;
}

export function QueryList<T>({ query, renderItem, keyExtractor, empty, header }: Props<T>) {
  return (
    <QueryBoundary query={query}>
      {(items) => (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={header}
          ListEmptyComponent={empty}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
  refreshing={query.isRefetching}
  onRefresh={() => {
    void query.refetch();
  }}
/>
          }
        />
      )}
    </QueryBoundary>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
});
