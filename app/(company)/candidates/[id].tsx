import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { Card } from '../../../src/components/common/Card';
import { ChipRow } from '../../../src/components/common/Chip';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { QueryBoundary } from '../../../src/components/common/QueryBoundary';
import { Screen } from '../../../src/components/common/Screen';
import { SectionTitle } from '../../../src/components/common/SectionTitle';
import { CandidateRequestPanel } from '../../../src/components/company/CandidateRequestPanel';
import { ProfileHeader } from '../../../src/components/individual/ProfileHeader';
import { useCompany } from '../../../src/hooks/useAuth';
import { useCandidate } from '../../../src/hooks/useProfile';
import { colors, typography } from '../../../src/theme/theme';

export default function CandidateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const company = useCompany();
  const candidate = useCandidate(id);

  if (company.verification !== 'verified') {
    return (
      <Screen>
        <EmptyState
          icon="shield-checkmark-outline"
          title="Verification required"
          message="An administrator must verify your IPA number before you can view candidates."
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <QueryBoundary query={candidate}>
        {(data) =>
          data === null ? (
            <EmptyState
              icon="person-outline"
              title="Candidate not found"
              message="They may have removed their account."
            />
          ) : (
            <>
              <Card>
                <ProfileHeader
                  name={data.full_name}
                  headline={data.headline}
                  location={data.location}
                />
              </Card>
              {data.bio ? (
                <Card>
                  <SectionTitle>About</SectionTitle>
                  <Text style={{ ...typography.body, color: colors.text }}>{data.bio}</Text>
                </Card>
              ) : null}
              {data.skills.length > 0 ? (
                <Card>
                  <SectionTitle>Skills</SectionTitle>
                  <ChipRow items={data.skills} />
                </Card>
              ) : null}
              <CandidateRequestPanel candidate={data} />
            </>
          )
        }
      </QueryBoundary>
    </Screen>
  );
}
