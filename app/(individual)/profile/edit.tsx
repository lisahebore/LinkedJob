import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../src/components/common/Button';
import { FormError } from '../../../src/components/common/FormError';
import { FormField } from '../../../src/components/common/FormField';
import { PlaceField } from '../../../src/components/common/PlaceField';
import { Screen } from '../../../src/components/common/Screen';
import { useIndividual } from '../../../src/hooks/useAuth';
import { useUpdateProfile } from '../../../src/hooks/useProfile';
import { toUserMessage } from '../../../src/utils/errors';
import { toPlace } from '../../../src/utils/geo';
import { ProfileValues, profileSchema } from '../../../src/utils/schemas';

export default function EditProfileScreen() {
  const router = useRouter();
  const profile = useIndividual();
  const updateProfile = useUpdateProfile();
  const { control, handleSubmit } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.full_name,
      headline: profile.headline,
      bio: profile.bio,
      skills: profile.skills.join(', '),
      place: toPlace(profile.location, profile.latitude, profile.longitude),
    },
  });

  return (
    <Screen>
      <FormField
        control={control}
        name="fullName"
        label="Full name"
        autoCapitalize="words"
        maxLength={100}
      />
      <FormField
        control={control}
        name="headline"
        label="Headline"
        placeholder="e.g. Civil Engineer"
        maxLength={120}
      />
      <FormField control={control} name="bio" label="About you" multiline maxLength={1000} />
      <FormField
        control={control}
        name="skills"
        label="Skills"
        hint="Separate skills with commas"
        autoCapitalize="none"
        maxLength={400}
      />
      <PlaceField control={control} name="place" />
      <FormError message={updateProfile.isError ? toUserMessage(updateProfile.error) : undefined} />
      <Button
        title="Save"
        loading={updateProfile.isPending}
        onPress={handleSubmit((values) =>
          updateProfile.mutate(values, { onSuccess: () => router.back() }),
        )}
      />
    </Screen>
  );
}
