import React, { forwardRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";

import { AppInputProps } from "../../types/components/common/AppInput.types";
import AppText from "./AppText";
import AppIcon from "./AppIcon";
import stylesConfig from "../../config/styles";

const AppInput = forwardRef<TextInput, AppInputProps>(
  (
    {
      label,
      error,
      leftIconName,
      rightIconName,
      leftIconColor = stylesConfig.colors.medium,
      rightIconColor = stylesConfig.colors.medium,
      leftIconContainerStyle,
      rightIconContainerStyle,
      containerStyle,
      inputContainerStyle,
      labelStyle,
      inputStyle,
      errorStyle,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {/* Label */}
        {label && <AppText style={[styles.label, labelStyle]}>{label}</AppText>}

        {/* Input Container */}
        <View style={[styles.inputContainer, inputContainerStyle, error ? styles.inputContainerError : null]}>
          {/* Left Icon */}
          {leftIconName && (
            <View style={[styles.leftIcon, leftIconContainerStyle]}>
              <AppIcon name={leftIconName} color={leftIconColor} width={20} height={20} />
            </View>
          )}

          {/* TextInput */}
          <TextInput
            ref={ref}
            style={[styles.input, leftIconName ? styles.inputWithLeftIcon : null, rightIconName ? styles.inputWithRightIcon : null, inputStyle]}
            placeholderTextColor={stylesConfig.colors.medium}
            {...props}
          />

          {/* Right Icon */}
          {rightIconName && (
            <View style={[styles.rightIcon, rightIconContainerStyle]}>
              <AppIcon name={rightIconName} color={rightIconColor} width={20} height={20} />
            </View>
          )}
        </View>

        {/* Error Message */}
        {error && <AppText style={[styles.error, errorStyle]}>{error}</AppText>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: stylesConfig.colors.dark,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: stylesConfig.colors.white,
    borderWidth: 1,
    borderColor: stylesConfig.colors.light,
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 16,
  },
  inputContainerError: {
    borderColor: stylesConfig.colors.danger,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: stylesConfig.colors.dark,
    padding: 0,
    paddingVertical: 12,
  },
  inputWithLeftIcon: {
    marginLeft: 12,
  },
  inputWithRightIcon: {
    marginRight: 12,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  error: {
    color: stylesConfig.colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
});

export default AppInput;
