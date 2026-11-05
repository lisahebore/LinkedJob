import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme/theme';
import { Profile } from '../../types/models';
import { formatDistanceKm } from '../../utils/formatters';
import { Card } from '../common/Card';
import { ChipRow } from '../common/Chip';
import { ProfileHeader } from '../individual/ProfileHeader';

interface Props {
  profile: Profile;
  /** Distance from the company's saved location, when both locations are known. */
  distanceKm: number | null;
  onPress: () => void;
}

export function CandidateCard({ profile, distanceKm, onPress }: Props) {
  return (
    <Card onPress={onPress}>
      <ProfileHeader
        name={profile.full_name}
        headline={profile.headline}
        location={profile.location}
        compact
      />
      {distanceKm !== null ? (
        <Text style={styles.distance}>{formatDistanceKm(distanceKm)} from you</Text>
      ) : null}
      <View style={styles.skills}>
        {profile.skills.length > 0 ? (
          <ChipRow items={profile.skills.slice(0, 4)} />
        ) : (
          <Text style={styles.empty}>No skills listed yet</Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  distance: { ...typography.small, color: colors.primary, marginTop: spacing.sm },
  skills: { marginTop: spacing.md },
  empty: { ...typography.small, color: colors.textMuted },
});
