import { z } from 'zod';
import { MAX_SKILLS } from './constants';
import { parseSkills } from './formatters';

const email = z
  .string()
  .trim()
  .min(1, 'Enter your email address.')
  .email('Enter a valid email address.');

const password = z
  .string()
  .min(8, 'Use at least 8 characters.')
  .max(72, 'Use 72 characters or fewer.');

const placeSchema = z
  .object({ label: z.string(), latitude: z.number(), longitude: z.number() })
  .nullable();

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password.'),
});

export const registerIndividualSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Enter your full name.')
    .max(100, 'Keep it under 100 characters.'),
  email,
  password,
});

export const registerCompanySchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, 'Enter your company name.')
    .max(120, 'Keep it under 120 characters.'),
  ipaNumber: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9][A-Za-z0-9/-]{3,24}$/, 'Use 4-25 letters, numbers, hyphens or slashes.'),
  email,
  password,
});

export const resetRequestSchema = z.object({ email });

export const resetConfirmSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6,8}$/, 'Enter the code from your email.'),
  newPassword: password,
});

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Your name cannot be empty.')
    .max(100, 'Keep it under 100 characters.'),
  headline: z.string().trim().max(120, 'Keep it under 120 characters.'),
  bio: z.string().trim().max(1000, 'Keep it under 1000 characters.'),
  skills: z
    .string()
    .max(400, 'That is too long.')
    .refine(
      (value) => parseSkills(value).length <= MAX_SKILLS,
      `List at most ${MAX_SKILLS} skills.`,
    ),
  place: placeSchema,
});

export const companySchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, 'Company name cannot be empty.')
    .max(120, 'Keep it under 120 characters.'),
  industry: z.string().trim().max(80, 'Keep it under 80 characters.'),
  website: z
    .string()
    .trim()
    .max(200, 'Keep it under 200 characters.')
    .refine(
      (value) => value === '' || /^https?:\/\/.+\..+/i.test(value),
      'Start with http:// or https://',
    ),
  about: z.string().trim().max(1000, 'Keep it under 1000 characters.'),
  place: placeSchema,
});

export const documentSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, 'Give the document a name.')
    .max(80, 'Keep it under 80 characters.'),
});

export const requestSchema = z.object({
  message: z.string().trim().max(500, 'Keep it under 500 characters.'),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterIndividualValues = z.infer<typeof registerIndividualSchema>;
export type RegisterCompanyValues = z.infer<typeof registerCompanySchema>;
export type ResetRequestValues = z.infer<typeof resetRequestSchema>;
export type ResetConfirmValues = z.infer<typeof resetConfirmSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
export type CompanyValues = z.infer<typeof companySchema>;
export type DocumentValues = z.infer<typeof documentSchema>;
export type RequestValues = z.infer<typeof requestSchema>;
