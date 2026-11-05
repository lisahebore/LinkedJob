import { Coordinates } from '../types/geo';
import { Profile } from '../types/models';
import { distanceKm, toCoordinates } from './geo';

export interface CandidateRow {
  profile: Profile;
  /** Null when either the company or the candidate has not set a location. */
  distanceKm: number | null;
}

function matchesSearch(profile: Profile, term: string): boolean {
  if (term === '') return true;
  const haystack = [profile.full_name, profile.headline, profile.location, ...profile.skills]
    .join(' ')
    .toLowerCase();
  return haystack.includes(term);
}

/** Filters by the search text, then lists the closest candidates first when we know where we are. */
export function toCandidateRows(
  profiles: Profile[],
  search: string,
  origin: Coordinates | null,
): CandidateRow[] {
  const term = search.trim().toLowerCase();
  return profiles
    .filter((profile) => matchesSearch(profile, term))
    .map((profile) => {
      const point = toCoordinates(profile.latitude, profile.longitude);
      return { profile, distanceKm: origin && point ? distanceKm(origin, point) : null };
    })
    .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
}
