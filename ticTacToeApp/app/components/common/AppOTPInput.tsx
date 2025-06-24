import React, { useRef } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Platform } from "react-native";

import colors from "../../config/colors";
import AppText from "./AppText";

import { AppOTPInputProps } from "../../types/components/common/AppOTPInput.types";

export default function AppOTPInput({ value, onChange, digits = 5, containerStyle, inputStyle, error, disabled = false }: AppOTPInputProps) {
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, idx: number) => {
    if (/[^0-9]/.test(text)) return;
    let newValue = value.split("");
    newValue[idx] = text;
    let joined = newValue.join("").slice(0, digits);
    onChange(joined);
    if (text && idx < digits - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === "Backspace" && !value[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputRow}>
        {Array.from({ length: digits }).map((_, idx) => (
          <TextInput
            key={idx}
            ref={(ref) => (inputs.current[idx] = ref)}
            style={[styles.input, inputStyle, value[idx] ? styles.filled : null, disabled ? styles.disabled : null]}
            value={value[idx] || ""}
            onChangeText={(text) => handleChange(text.slice(-1), idx)}
            onKeyPress={(e) => handleKeyPress(e, idx)}
            keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
            maxLength={1}
            editable={!disabled}
            selectTextOnFocus
            autoFocus={idx === 0}
            textAlign="center"
            underlineColorAndroid="transparent"
          />
        ))}
      </View>
      {error ? <AppText style={styles.error}>{error}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 16,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  input: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: colors.medium,
    borderRadius: 8,
    fontSize: 24,
    color: colors.dark,
    backgroundColor: colors.white,
    marginHorizontal: 4,
  },
  filled: {
    borderColor: colors.primary,
  },
  disabled: {
    backgroundColor: colors.grey,
    color: colors.medium,
  },
  error: {
    color: colors.danger,
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
});
