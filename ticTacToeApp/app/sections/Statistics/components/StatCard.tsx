import React from "react";
import { View, StyleSheet } from "react-native";

import AppText from "../../../components/common/AppText";
import colors from "../../../config/colors";

interface StatCardProps {
  title: string;
  value: string | number;
  color?: string;
  style?: object;
}

export default function StatCard({ title, value, color = colors.white, style }: StatCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: color }, style]}>
      <AppText style={styles.title}>{title}</AppText>
      <AppText style={styles.value}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    color: colors.black,
    fontWeight: "500",
  },
  value: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: "bold",
    color: colors.dark,
  },
});
