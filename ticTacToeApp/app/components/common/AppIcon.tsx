import React, { ComponentType } from "react";
import { icons } from "../../assets/data/icons";

import { AppIconProps } from "../../types/components/common/AppIcon.types";

const typedIcons: Record<string, ComponentType<any>> = icons;

export default function AppIcon({ name, fill, color, ...props }: AppIconProps) {
  if (!name) return null;

  const Comp = typedIcons[name];

  if (!Comp) return null;

  return <Comp fill={color} color={color} {...props} />;
}
