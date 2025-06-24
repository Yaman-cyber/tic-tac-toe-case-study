// src/components/LanguageSwitcher.tsx
import React from "react";
import { View, Button } from "react-native";
import { changeAppLanguage } from "../i18n";

export default function LanguageSwitcher() {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 12 }}>
      <Button title="English" onPress={() => changeAppLanguage("en")} />
      <Button title="العربية" onPress={() => changeAppLanguage("ar")} />
    </View>
  );
}
