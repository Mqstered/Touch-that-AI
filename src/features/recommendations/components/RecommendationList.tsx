import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { DbRecommendation } from '@/services/recommendations.service';

type RecommendationListProps = {
  recommendations: DbRecommendation[];
  onModulePress: (moduleSlug: string, lessonId?: string) => void;
};

export function RecommendationList({ recommendations, onModulePress }: RecommendationListProps) {
  if (recommendations.length === 0) return null;

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold" style={styles.heading}>
        Recommended for you
      </ThemedText>
      {recommendations.map((rec, i) => (
        <Pressable
          key={rec.lessonId || `rec-${i}`}
          onPress={() =>
            onModulePress(rec.moduleSlug, rec.lessonId || undefined)
          }
        >
          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">{rec.lessonTitle}</ThemedText>
            {rec.reason ? (
              <ThemedText type="small" themeColor="textSecondary" style={styles.reason}>
                {rec.reason}
              </ThemedText>
            ) : null}
          </ThemedView>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  heading: {
    marginBottom: Spacing.two,
  },
  card: {
    width: '100%',
    borderRadius: Spacing.three,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  reason: {
    marginTop: Spacing.one,
    lineHeight: 18,
  },
});
