import { Coordinates, PlaceValue } from '../types/geo';

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Great-circle distance between two points, used to sort candidates by how close they are. */
export function distanceKm(from: Coordinates, to: Coordinates): number {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

export function toCoordinates(
  latitude: number | null,
  longitude: number | null,
): Coordinates | null {
  return latitude === null || longitude === null ? null : { latitude, longitude };
}

/** Rebuilds a PlaceValue from the three columns the database stores for a location. */
export function toPlace(
  label: string,
  latitude: number | null,
  longitude: number | null,
): PlaceValue | null {
  const coordinates = toCoordinates(latitude, longitude);
  return coordinates ? { ...coordinates, label: label || 'Saved location' } : null;
}
