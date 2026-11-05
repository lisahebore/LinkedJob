import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../src/components/common/Button';
import { FormError } from '../../../src/components/common/FormError';
import { FormField } from '../../../src/components/common/FormField';
import { PlaceField } from '../../../src/components/common/PlaceField';
import { Screen } from '../../../src/components/common/Screen';
import { useCompany } from '../../../src/hooks/useAuth';
import { useUpdateCompany } from '../../../src/hooks/useProfile';
import { toUserMessage } from '../../../src/utils/errors';
import { toPlace } from '../../../src/utils/geo';
import { CompanyValues, companySchema } from '../../../src/utils/schemas';

export default function EditCompanyScreen() {
  const router = useRouter();
  const company = useCompany();
  const updateCompany = useUpdateCompany();
  const { control, handleSubmit } = useForm<CompanyValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: company.company_name,
      industry: company.industry,
      website: company.website,
      about: company.about,
      place: toPlace(company.location, company.latitude, company.longitude),
    },
  });

  return (
    <Screen>
      <FormField
        control={control}
        name="companyName"
        label="Company name"
        autoCapitalize="words"
        maxLength={120}
      />
      <FormField
        control={control}
        name="industry"
        label="Industry"
        placeholder="e.g. Construction"
        maxLength={80}
      />
      <FormField
        control={control}
        name="website"
        label="Website"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        placeholder="https://"
        maxLength={200}
      />
      <FormField control={control} name="about" label="About" multiline maxLength={1000} />
      <PlaceField control={control} name="place" />
      <FormError message={updateCompany.isError ? toUserMessage(updateCompany.error) : undefined} />
      <Button
        title="Save"
        loading={updateCompany.isPending}
        onPress={handleSubmit((values) =>
          updateCompany.mutate(values, { onSuccess: () => router.back() }),
        )}
      />
    </Screen>
  );
}
