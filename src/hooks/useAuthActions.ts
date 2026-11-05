import { useMutation } from '@tanstack/react-query';
import { clearCachedData } from '../lib/queryClient';
import * as authService from '../services/authService';

export function useSignIn() {
  return useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      authService.signIn(input.email, input.password),
  });
}

export function useSignUpIndividual() {
  return useMutation({ mutationFn: authService.signUpIndividual });
}

export function useSignUpCompany() {
  return useMutation({ mutationFn: authService.signUpCompany });
}

export function useSignOut() {
  return useMutation({
    mutationFn: authService.signOut,
    onSuccess: clearCachedData,
  });
}

export function useRequestPasswordReset() {
  return useMutation({ mutationFn: authService.requestPasswordReset });
}

export function useConfirmPasswordReset() {
  return useMutation({ mutationFn: authService.confirmPasswordReset });
}
