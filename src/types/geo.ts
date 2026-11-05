export interface Coordinates {
  latitude: number;
  longitude: number;
}

/** A named place the user picked, e.g. from geocoding search or the device position. */
export interface PlaceValue extends Coordinates {
  label: string;
}
