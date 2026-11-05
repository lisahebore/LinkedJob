import { Ionicons } from '@expo/vector-icons';
import React from 'react';

type TabIconProps = {
  focused: boolean;
  color: unknown;
  size: number;
};

/** Builds the tabBarIcon renderer for a given icon name. */
export const tabIcon =
  (name: keyof typeof Ionicons.glyphMap) =>
  ({ color, size }: TabIconProps) => (
    <Ionicons
      name={name}
      size={size}
      color={color as React.ComponentProps<typeof Ionicons>['color']}
    />
  );
