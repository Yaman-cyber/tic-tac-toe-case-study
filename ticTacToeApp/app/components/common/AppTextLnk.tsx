import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import AppText from "./AppText";
import colors from "../../config/colors";
import { AppTextLnkProps } from "../../types/components/common/AppTextLnk.types";

export default function AppTextLnk({ text, textStyle, containerStyle, onPress, ...props }: AppTextLnkProps) {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity style={[styles.redirectContainer, containerStyle]} onPress={handlePress} {...props}>
      <AppText style={[styles.redirect, textStyle]}>{text}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  redirectContainer: { alignItems: "center", marginBottom: 16 },
  redirect: { color: colors.primary, textDecorationLine: "underline" },
});
