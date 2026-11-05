const DEFAULT_TIMEOUT_MS = 15000;

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/** Wraps fetch so a stalled connection fails after `timeoutMs` instead of hanging forever. */
export function fetchWithTimeout(timeoutMs: number = DEFAULT_TIMEOUT_MS): typeof fetch {
  return async (input, init) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(input, { ...init, signal: init?.signal ?? controller.signal });
    } finally {
      clearTimeout(timer);
    }
  };
}

/** GETs JSON from a public REST API, throwing HttpError for non-2xx responses. */
export async function getJson<T>(url: string): Promise<T> {
  const response = await fetchWithTimeout()(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new HttpError(response.status, `Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}
