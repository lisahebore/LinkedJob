import { getJson, HttpError } from '../lib/http';
import { PlaceValue } from '../types/geo';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const MAX_RESULTS = 5;

interface GeocodingResponse {
  results?: {
    name: string;
    admin1?: string;
    country?: string;
    latitude: number;
    longitude: number;
  }[];
}

/** Turns a typed place name into coordinates. An empty array means nothing matched. */
export async function searchPlaces(term: string): Promise<PlaceValue[]> {
  const params = new URLSearchParams({
    name: term,
    count: String(MAX_RESULTS),
    language: 'en',
    format: 'json',
  });

  let body: GeocodingResponse;
  try {
    body = await getJson<GeocodingResponse>(`${GEOCODING_URL}?${params.toString()}`);
  } catch (error) {
    if (error instanceof HttpError && error.status === 429) {
      throw new Error('Place search is busy. Please try again in a minute.');
    }
    throw error;
  }

  return (body.results ?? []).map((result) => ({
    label: [result.name, result.admin1, result.country].filter(Boolean).join(', '),
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}
