import type { Href } from 'expo-router';

/** Builds a route from a runtime value (such as an id) without needing generated typed routes. */
export function asHref(path: string): Href {
  return path as Href;
}
