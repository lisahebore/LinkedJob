import { supabase } from '../lib/supabase';
import { Account, Company, Profile } from '../types/models';
import { CANDIDATE_LIMIT } from '../utils/constants';
import { CompanyValues, ProfileValues } from '../utils/schemas';
import { parseSkills } from '../utils/formatters';

/** Finds out whether this user is a job seeker or a company by checking which row exists. */
export async function fetchAccount(userId: string): Promise<Account | null> {
  const [profileResult, companyResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('companies').select('*').eq('id', userId).maybeSingle(),
  ]);
  if (profileResult.error) throw profileResult.error;
  if (companyResult.error) throw companyResult.error;

  if (profileResult.data) return { role: 'individual', profile: profileResult.data as Profile };
  if (companyResult.data) return { role: 'company', company: companyResult.data as Company };
  return null;
}

export async function updateProfile(userId: string, values: ProfileValues): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: values.fullName.trim(),
      headline: values.headline.trim(),
      bio: values.bio.trim(),
      skills: parseSkills(values.skills),
      location: values.place?.label ?? '',
      latitude: values.place?.latitude ?? null,
      longitude: values.place?.longitude ?? null,
    })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function updateCompany(userId: string, values: CompanyValues): Promise<Company> {
  const { data, error } = await supabase
    .from('companies')
    .update({
      company_name: values.companyName.trim(),
      industry: values.industry.trim(),
      website: values.website.trim(),
      about: values.about.trim(),
      location: values.place?.label ?? '',
      latitude: values.place?.latitude ?? null,
      longitude: values.place?.longitude ?? null,
    })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data as Company;
}

/** The database only returns rows to verified companies, so this is empty for anyone else. */
export async function listCandidates(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(CANDIDATE_LIMIT);
  if (error) throw error;
  return data as Profile[];
}

export async function getCandidate(id: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}
