interface ErrorLike {
  name?: string;
  message?: string;
  code?: string;
}

function asErrorLike(error: unknown): ErrorLike {
  return typeof error === 'object' && error !== null ? (error as ErrorLike) : {};
}

const NETWORK_PATTERN = /network request failed|failed to fetch|network error|abort|timed? ?out/i;

export function isNetworkError(error: unknown): boolean {
  const { name = '', message = '' } = asErrorLike(error);
  return NETWORK_PATTERN.test(`${name} ${message}`);
}

const KNOWN_MESSAGES: [RegExp, string][] = [
  [/invalid login credentials/i, 'Incorrect email or password.'],
  [/email not confirmed/i, 'Please confirm your email address first. Check your inbox.'],
  [/already registered|already been registered/i, 'An account with this email already exists.'],
  [
    /token has expired|otp.*expired|invalid.*(token|otp)/i,
    'That code is incorrect or has expired.',
  ],
  [/rate limit|too many requests/i, 'Too many attempts. Please wait a minute and try again.'],
  [
    /database error saving new user/i,
    'We could not create your account. The IPA number may already be registered.',
  ],
  [/different from the old password/i, 'Choose a password you have not used before.'],
  [/row-level security|permission denied/i, 'You do not have permission to do that.'],
  [/payload too large|exceeded the maximum allowed size/i, 'That file is too large.'],
  [/mime type .* is not supported/i, 'That file type is not allowed. Use PDF or Word.'],
];

/** Turns any thrown value into a sentence that is safe and useful to show a person. */
export function toUserMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return 'The request timed out or you are offline. Check your connection and try again.';
  }
  const { message = '', code } = asErrorLike(error);
  const known = KNOWN_MESSAGES.find(([pattern]) => pattern.test(message));
  if (known) return known[1];
  if (code === '42501') return 'You do not have permission to do that.';
  if (code === '23505') return 'That already exists.';
  // P0001 is a database rule we wrote ourselves (supabase/schema.sql), so its text is safe to show.
  if (code === 'P0001') return message;
  if (error instanceof Error && message.length > 0 && message.length < 140) return message;
  return 'Something went wrong. Please try again.';
}

export function hasErrorCode(error: unknown, code: string): boolean {
  return asErrorLike(error).code === code;
}
