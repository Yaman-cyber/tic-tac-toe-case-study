import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";

import AppIcon from "./AppIcon"; // Assuming you have a custom AppIcon component
import AppText from "./AppText";
import colors from "../../config/colors";

import { AppButtonProps } from "../../types/components/common/AppButton.types";

export default function AppButton({ text = "", onPress, buttonStyle, textStyle, iconName, iconColor = colors.white, iconSize = { width: 24, height: 24 } }: AppButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
      <View style={styles.content}>
        {iconName && <AppIcon name={iconName} width={iconSize.width} height={iconSize.height} color={iconColor} style={styles.icon} />}
        <AppText style={[styles.text, textStyle]}>{text}</AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    // flex: 1,
    marginLeft: 10,
    flexDirection: "row",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
