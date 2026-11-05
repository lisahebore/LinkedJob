import * as Location from 'expo-location';
import { Coordinates, PlaceValue } from '../types/geo';

export class LocationPermissionError extends Error {
  constructor() {
    super(
      'Location permission was denied. You can allow it in your phone settings, or search for a place instead.',
    );
    this.name = 'LocationPermissionError';
  }
}

/** Two decimals is roughly 1 km, so a job seeker's exact position is never stored or shared. */
const COORDINATE_PRECISION = 100;

function roundCoordinate(value: number): number {
  return Math.round(value * COORDINATE_PRECISION) / COORDINATE_PRECISION;
}

async function describePlace(coordinates: Coordinates): Promise<string> {
  try {
    const [place] = await Location.reverseGeocodeAsync(coordinates);
    const parts = [place?.city ?? place?.subregion, place?.region, place?.country].filter(Boolean);
    if (parts.length > 0) return parts.join(', ');
  } catch {
    // Reverse geocoding is best-effort: some Android devices have no geocoder service.
  }
  return 'Current location';
}

export async function getDevicePlace(): Promise<PlaceValue> {
  if (!(await Location.hasServicesEnabledAsync())) {
    throw new Error('Location services are turned off on this device.');
  }
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') throw new LocationPermissionError();

  const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  const coordinates = { latitude: position.coords.latitude, longitude: position.coords.longitude };
  return {
    latitude: roundCoordinate(coordinates.latitude),
    longitude: roundCoordinate(coordinates.longitude),
    label: await describePlace(coordinates),
  };
}
