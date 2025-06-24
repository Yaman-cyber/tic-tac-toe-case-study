import { View, StyleSheet, Dimensions, ActivityIndicator, Text } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import routes from "../../../navigation/routes";
import { RootStackParamList } from "../../../types/navigation";
import colors from "../../../config/colors";
import StatCard from "../components/StatCard";
import { gameStats, StatisticsData } from "../../../utils/api/v1/statistics";

const { width } = Dimensions.get("window");

export default function StatisticsView({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, typeof routes.STATISTICS> }) {
  const { t } = useTranslation();
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await gameStats();
      setStats(response.data.data);
    } catch (err: any) {
      setError(err?.message || "Failed to load statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatCard title={t("total") || "Total"} value={stats?.total ?? 0} style={styles.card} />
      <StatCard title={t("won") || "Won"} value={stats?.won ?? 0} style={styles.card} />
      <StatCard title={t("lost") || "Lost"} value={stats?.lost ?? 0} style={styles.card} />
      <StatCard title={t("draws") || "Draws"} value={stats?.draw ?? 0} style={styles.card} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.white },
  card: { minWidth: width * 0.9 },
});
