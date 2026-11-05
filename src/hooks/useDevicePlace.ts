import { useMutation } from '@tanstack/react-query';
import { getDevicePlace } from '../services/locationService';

/** Asks for permission (if needed), reads the GPS position and names it. */
export function useDevicePlace() {
  return useMutation({ mutationFn: getDevicePlace });
}
