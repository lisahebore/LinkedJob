
import * as Linking from 'expo-linking';
import { supabase } from '../lib/supabase';

export interface SignUpResult {
  /** True when email confirmation is required before signing in. */
  needsEmailConfirmation: boolean;
}

export async function signIn(
  email: string,
  password: string
): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) throw error;
}

export async function signUpIndividual(input: {
  email: string;
  password: string;
  fullName: string;
}): Promise<SignUpResult> {
  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      emailRedirectTo: Linking.createURL('callback'),
      data: {
        account_type: 'individual',
        full_name: input.fullName.trim(),
      },
    },
  });

  if (error) throw error;

  return { needsEmailConfirmation: data.session === null };
}

export async function signUpCompany(input: {
  email: string;
  password: string;
  companyName: string;
  ipaNumber: string;
}): Promise<SignUpResult> {
  const { data: available, error: lookupError } = await supabase.rpc(
    'ipa_number_available',
    { candidate: input.ipaNumber.trim() }
  );

  if (lookupError) throw lookupError;

  if (!available) {
    throw new Error('A company with this IPA number is already registered.');
  }

  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      emailRedirectTo: Linking.createURL('callback'),
      data: {
        account_type: 'company',
        company_name: input.companyName.trim(),
        ipa_number: input.ipaNumber.trim(),
      },
    },
  });

  if (error) throw error;

  return { needsEmailConfirmation: data.session === null };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function requestPasswordReset(
  email: string
): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim()
  );

  if (error) throw error;
}

export async function confirmPasswordReset(input: {
  email: string;
  code: string;
  newPassword: string;
}): Promise<void> {
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email: input.email.trim(),
    token: input.code.trim(),
    type: 'recovery',
  });

  if (verifyError) throw verifyError;

  const { error: updateError } = await supabase.auth.updateUser({
    password: input.newPassword,
  });

  if (updateError) throw updateError;
}
