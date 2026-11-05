import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useDevicePlace } from '../../hooks/useDevicePlace';
import { usePlaceSearch } from '../../hooks/usePlaceSearch';
import { colors, radius, spacing, typography } from '../../theme/theme';
import { PlaceValue } from '../../types/geo';
import { toUserMessage } from '../../utils/errors';
import { Button } from './Button';

interface PickerProps {
  value: PlaceValue | null;
  onChange: (place: PlaceValue | null) => void;
}

/** Lets someone pick where they are: search a place name, or use the phone's position. */
function PlacePicker({ value, onChange }: PickerProps) {
  const [term, setTerm] = useState('');
  const search = usePlaceSearch(term);
  const device = useDevicePlace();

  const choose = (place: PlaceValue) => {
    onChange(place);
    setTerm('');
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Location</Text>

      {value ? (
        <View style={styles.selected}>
          <Ionicons name="location" size={18} color={colors.primary} />
          <Text style={styles.selectedText} numberOfLines={2}>
            {value.label}
          </Text>
          <Pressable onPress={() => onChange(null)} hitSlop={8}>
            <Text style={styles.remove}>Remove</Text>
          </Pressable>
        </View>
      ) : null}

      <TextInput
        accessibilityLabel="Search for a town or city"
        style={styles.input}
        placeholder="Search for a town or city"
        placeholderTextColor={colors.textMuted}
        value={term}
        onChangeText={setTerm}
        autoCorrect={false}
      />

      {search.enabled && (search.isFetching || search.isFetched) ? (
        <View style={styles.results}>
          {search.isFetching ? <ActivityIndicator color={colors.primary} /> : null}
          {!search.isFetching && search.isError ? (
            <Pressable onPress={() => search.refetch()}>
              <Text style={styles.error}>{toUserMessage(search.error)} Tap to retry.</Text>
            </Pressable>
          ) : null}
          {!search.isFetching && !search.isError && search.data?.length === 0 ? (
            <Text style={styles.muted}>No places found for "{search.term}".</Text>
          ) : null}
          {!search.isFetching &&
            search.data?.map((place) => (
              <Pressable
                key={`${place.label}-${place.latitude}`}
                style={styles.result}
                onPress={() => choose(place)}
              >
                <Text style={styles.resultText}>{place.label}</Text>
              </Pressable>
            ))}
        </View>
      ) : null}

      <Button
        title="Use my current location"
        variant="secondary"
        loading={device.isPending}
        onPress={() => device.mutate(undefined, { onSuccess: choose })}
        style={styles.deviceButton}
      />
      {device.isError ? <Text style={styles.error}>{toUserMessage(device.error)}</Text> : null}
    </View>
  );
}

type FieldProps<T extends FieldValues> = { control: Control<T>; name: Path<T> };

/** react-hook-form wrapper so the picked place is part of the form's values. */
export function PlaceField<T extends FieldValues>({ control, name }: FieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <PlacePicker value={(field.value as PlaceValue | null) ?? null} onChange={field.onChange} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.xs },
  selected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  selectedText: { ...typography.body, color: colors.primaryDark, flex: 1 },
  remove: { ...typography.label, color: colors.danger },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  results: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginTop: spacing.xs,
    padding: spacing.sm,
  },
  result: { paddingVertical: spacing.md, paddingHorizontal: spacing.sm },
  resultText: { ...typography.body, color: colors.text },
  muted: { ...typography.small, color: colors.textMuted, padding: spacing.sm },
  error: { ...typography.small, color: colors.danger, marginTop: spacing.xs },
  deviceButton: { marginTop: spacing.md },
});
