import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme/theme';

interface Props {
  children: React.ReactNode;
  /** Wrap content in a ScrollView. Turn off for screens whose body is a FlatList. */
  scroll?: boolean;
  padded?: boolean;
  /**
   * Needed only on screens without a header, such as the welcome screen. Android draws apps edge to
   * edge, so this also keeps the bottom buttons clear of the system navigation bar.
   */
  safeTop?: boolean;
}

export function Screen({ children, scroll = true, padded = true, safeTop = false }: Props) {
  const contentStyle = padded ? styles.padded : undefined;
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.grow, contentStyle]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView
      style={styles.flex}
      edges={safeTop ? ['top', 'bottom', 'left', 'right'] : ['left', 'right']}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {body}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  grow: { flexGrow: 1 },
  padded: { padding: spacing.lg, paddingBottom: spacing.xxl },
});
