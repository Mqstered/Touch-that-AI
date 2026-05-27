import React from "react";
import { StyleSheet, View } from "react-native";

import { ProgressBar } from "@/components/progress-bar";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";

type MasteryOverviewProps = {
  averageMastery: number;
  totalLessons: number;
};

export function MasteryOverview({
  averageMastery,
  totalLessons,
}: MasteryOverviewProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <ThemedText type="smallBold" style={{ color: "#7e22ce" }}>
          Overall Mastery
        </ThemedText>
        <ThemedText type="smallBold" style={{ color: "#7e22ce" }}>
          {averageMastery}%
        </ThemedText>
      </View>
      <ProgressBar value={averageMastery} style={styles.bar} />
      <ThemedText type="small" style={{ color: "#a21caf" }}>
        {totalLessons} lessons available
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: Spacing.four,
    padding: Spacing.four,
    marginBottom: Spacing.three,
    backgroundColor: "rgba(232, 204, 255, 0.88)",
    borderWidth: 1,
    borderColor: "#6B21A8",
    shadowColor: "#9333ea",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.two,
  },
  bar: {
    marginBottom: Spacing.two,
  },
});
