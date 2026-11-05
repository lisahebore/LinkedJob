import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { searchPlaces } from '../services/geocodingService';
import { useDebouncedValue } from './useDebouncedValue';

const DEBOUNCE_MS = 400;
const MIN_TERM_LENGTH = 2;

export function usePlaceSearch(rawTerm: string) {
  const term = useDebouncedValue(rawTerm.trim(), DEBOUNCE_MS);
  const enabled = term.length >= MIN_TERM_LENGTH;
  const query = useQuery({
    queryKey: queryKeys.places(term),
    queryFn: () => searchPlaces(term),
    enabled,
    retry: 1,
  });
  return { ...query, term, enabled };
}
