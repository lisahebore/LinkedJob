/** Row types mirror supabase/schema.sql. Column names stay snake_case to match the database. */

export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type RequestStatus = 'pending' | 'accepted' | 'rejected';

export interface Profile {
  id: string;
  full_name: string;
  headline: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  bio: string;
  skills: string[];
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  company_name: string;
  ipa_number: string;
  industry: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  about: string;
  website: string;
  verification: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface DocumentRow {
  id: string;
  owner_id: string;
  label: string;
  file_name: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
  updated_at: string;
}

export interface AccessRequest {
  id: string;
  company_id: string;
  individual_id: string;
  message: string;
  status: RequestStatus;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
}

/** A request joined with the names of both parties, as returned by requestService. */
export interface RequestWithParties extends AccessRequest {
  company: Pick<Company, 'id' | 'company_name' | 'industry' | 'location'> | null;
  individual: Pick<Profile, 'id' | 'full_name' | 'headline' | 'location'> | null;
}

export type Account =
  | { role: 'individual'; profile: Profile }
  | { role: 'company'; company: Company };

export type Role = Account['role'];
