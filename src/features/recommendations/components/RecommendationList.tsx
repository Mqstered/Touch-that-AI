import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import type { DbRecommendation } from "@/services/recommendations.service";

type RecommendationListProps = {
  recommendations: DbRecommendation[];
  onModulePress: (moduleSlug: string, lessonId?: string) => void;
};

export function RecommendationList({
  recommendations,
  onModulePress,
}: RecommendationListProps) {
  if (recommendations.length === 0) return null;

  return (
    <View style={styles.container}>
      <ThemedText
        type="smallBold"
        style={[styles.heading, { color: "#7e22ce" }]}
      >
        Your next steps
      </ThemedText>
      {recommendations.map((rec, i) => (
        <Pressable
          key={rec.lessonId || `rec-${i}`}
          onPress={() =>
            onModulePress(rec.moduleSlug, rec.lessonId || undefined)
          }
          style={styles.pressable}
        >
          <View style={styles.card}>
            <ThemedText type="smallBold" style={{ color: "#7e22ce" }}>
              {rec.lessonTitle}
            </ThemedText>
            {rec.reason ? (
              <ThemedText
                type="small"
                style={[styles.reason, { color: "#c026d3" }]}
              >
                {rec.reason}
              </ThemedText>
            ) : null}
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  heading: {
    marginBottom: Spacing.two,
  },
  pressable: {
    marginBottom: Spacing.two,
  },
  card: {
    width: "100%",
    borderRadius: Spacing.three,
    padding: Spacing.three,
    backgroundColor: "rgba(232, 204, 255, 0.88)",
    borderWidth: 1,
    borderColor: "#6B21A8",
    shadowColor: "#9333ea",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  reason: {
    marginTop: Spacing.one,
    lineHeight: 18,
  },
});
