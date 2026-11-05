import { Profile } from '../types/models';

/** Percentage of the profile fields a job seeker has filled in, shown on their home screen. */
export function profileCompleteness(profile: Profile): number {
  const checks = [
    profile.full_name.trim().length > 0,
    profile.headline.trim().length > 0,
    profile.location.trim().length > 0,
    profile.bio.trim().length > 0,
    profile.skills.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
