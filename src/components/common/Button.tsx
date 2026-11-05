import React, { useRef } from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../../theme/theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Presses closer together than this are treated as an accidental double-tap. */
const DOUBLE_TAP_GUARD_MS = 600;

const TEXT_COLORS: Record<Variant, string> = {
  primary: colors.white,
  danger: colors.white,
  secondary: colors.primary,
  ghost: colors.textMuted,
};

export function Button({ title, onPress, variant = 'primary', loading, disabled, style }: Props) {
  const lastPressAt = useRef(0);
  const isDisabled = disabled || loading;

  const handlePress = () => {
    const now = Date.now();
    if (now - lastPressAt.current < DOUBLE_TAP_GUARD_MS) return;
    lastPressAt.current = now;
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={TEXT_COLORS[variant]} />
      ) : (
        <Text style={[styles.text, { color: TEXT_COLORS[variant] }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primaryLight },
  danger: { backgroundColor: colors.danger },
  ghost: { backgroundColor: 'transparent' },
});
