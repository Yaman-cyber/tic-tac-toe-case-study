import React from "react";
import { Text } from "react-native";

import defaultStyles from "../../config/styles";
import { AppTextProps } from "../../types/components/common/AppText.types";

export default function AppText({ children, style, ...otherProps }: AppTextProps) {
  return (
    <Text {...otherProps} style={[defaultStyles.text, style]}>
      {children}
    </Text>
  );
}
