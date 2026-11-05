import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { QueryList } from '../../../src/components/common/QueryList';
import { Screen } from '../../../src/components/common/Screen';
import { SearchBar } from '../../../src/components/common/SearchBar';
import { CandidateCard } from '../../../src/components/company/CandidateCard';
import { useCompany } from '../../../src/hooks/useAuth';
import { useCandidates } from '../../../src/hooks/useProfile';
import { toCoordinates } from '../../../src/utils/geo';
import { asHref } from '../../../src/utils/navigation';

export default function CandidatesScreen() {
  const router = useRouter();
  const company = useCompany();
  const [search, setSearch] = useState('');
  const candidates = useCandidates(search, toCoordinates(company.latitude, company.longitude));

  if (company.verification !== 'verified') {
    return (
      <Screen>
        <EmptyState
          icon="shield-checkmark-outline"
          title="Verification required"
          message="An administrator must verify your IPA number before you can browse candidates. They will appear here once that is done."
        />
      </Screen>
    );
  }

  return (
    <Screen scroll={false} padded={false}>
      <QueryList
        query={candidates}
        keyExtractor={(row) => row.profile.id}
        header={
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search name, title, skill or place"
          />
        }
        empty={
          <EmptyState
            icon="people-outline"
            title="No candidates found"
            message={search ? 'Try a different search.' : 'No job seekers have registered yet.'}
          />
        }
        renderItem={({ item }) => (
          <CandidateCard
            profile={item.profile}
            distanceKm={item.distanceKm}
            onPress={() => router.push(asHref(`/(company)/candidates/${item.profile.id}`))}
          />
        )}
      />
    </Screen>
  );
}
