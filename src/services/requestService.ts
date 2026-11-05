import { supabase } from '../lib/supabase';
import { RequestWithParties } from '../types/models';
import { hasErrorCode } from '../utils/errors';

const REQUEST_SELECT =
  '*, company:companies(id, company_name, industry, location), individual:profiles(id, full_name, headline, location)';

/** Row Level Security limits this to requests where the caller is the company or the candidate. */
export async function listRequests(): Promise<RequestWithParties[]> {
  const { data, error } = await supabase
    .from('access_requests')
    .select(REQUEST_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as RequestWithParties[];
}

export async function getRequest(id: string): Promise<RequestWithParties | null> {
  const { data, error } = await supabase
    .from('access_requests')
    .select(REQUEST_SELECT)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as RequestWithParties | null;
}

export async function createRequest(input: {
  individualId: string;
  message: string;
}): Promise<void> {
  const { error } = await supabase
    .from('access_requests')
    .insert({ individual_id: input.individualId, message: input.message.trim() });
  if (hasErrorCode(error, '23505')) {
    throw new Error('You already have a pending request for this candidate.');
  }
  if (error) throw error;
}

export async function updateRequestMessage(id: string, message: string): Promise<void> {
  const { error } = await supabase
    .from('access_requests')
    .update({ message: message.trim() })
    .eq('id', id);
  if (error) throw error;
}

/** Deletes a pending request. Rows that no longer qualify are silently skipped by the database. */
export async function cancelRequest(id: string): Promise<void> {
  const { data, error } = await supabase.from('access_requests').delete().eq('id', id).select('id');
  if (error) throw error;
  if (data.length === 0) throw new Error('This request can no longer be cancelled.');
}

export async function respondToRequest(
  id: string,
  decision: 'accepted' | 'rejected',
): Promise<void> {
  const { error } = await supabase
    .from('access_requests')
    .update({ status: decision })
    .eq('id', id);
  if (error) throw error;
}
