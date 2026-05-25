import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SwipeableLessonCards } from '@/components/swipeable-lesson-cards';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTheme } from '@/hooks/use-theme';
import { fetchLessonsForModule, fetchNextPracticeLesson } from '@/services/lessons.service';
import type { DbLesson } from '@/types';

export default function LessonScreen() {
  const { moduleSlug, lessonId } = useLocalSearchParams<{
    moduleSlug: string;
    lessonId?: string;
  }>();
  const router = useRouter();
  const theme = useTheme();
  const { state } = useAuth();

  const [lessons, setLessons] = useState<DbLesson[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleSlug) return;
    setLoading(true);
    fetchLessonsForModule(moduleSlug).then((result) => {
      setLoading(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setLessons(result.data);
      if (lessonId) {
        const idx = result.data.findIndex((l) => l.id === lessonId);
        if (idx >= 0) setCurrentIndex(idx);
        return;
      }
      if (state.status === 'authenticated' && moduleSlug) {
        fetchNextPracticeLesson(state.session.user.id, moduleSlug).then((next) => {
          if (next.ok && next.data) {
            const idx = result.data.findIndex((l) => l.id === next.data!.id);
            if (idx >= 0) setCurrentIndex(idx);
          }
        });
      }
    });
  }, [moduleSlug, lessonId, state.status === 'authenticated' && state.session?.user.id]);

  if (!moduleSlug) return null;

  if (loading) {
    return (
      <AuthGuard>
        <ScreenShell>
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        </ScreenShell>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <ScreenShell>
          <ThemedText type="default" style={styles.errorText}>
            {error}
          </ThemedText>
          <PrimaryButton title="Go back" onPress={() => router.back()} />
        </ScreenShell>
      </AuthGuard>
    );
  }

  if (lessons.length === 0) {
    return (
      <AuthGuard>
        <ScreenShell>
          <ThemedText type="title" style={{ marginBottom: Spacing.three }}>
            No lessons yet
          </ThemedText>
          <ThemedText type="default" style={{ marginBottom: Spacing.four }}>
            Lessons for this module haven't been added to the database yet.
          </ThemedText>
          <PrimaryButton title="Go back" onPress={() => router.back()} />
        </ScreenShell>
      </AuthGuard>
    );
  }

  const lesson = lessons[currentIndex];
  const isLast = currentIndex === lessons.length - 1;

  const handlePractice = () => {
    router.push({
      pathname: '/lesson/practice',
      params: { lessonId: lesson.id, moduleSlug },
    });
  };

  const handleNext = () => {
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
    } else {
      handlePractice();
    }
  };

  return (
    <AuthGuard>
      <ScreenShell>
        {/* Header with back button */}
        <View style={styles.headerContainer}>
          <BackButton onPress={() => router.replace('/explore')} />
        </View>

        {/* Fixed progress indicator */}
        <View style={styles.stepRow}>
          {lessons.map((_, i) => (
            <View
              key={i}
              style={[
                styles.stepDot,
                {
                  backgroundColor:
                    i <= currentIndex ? theme.text : theme.backgroundSelected,
                },
              ]}
            />
          ))}
        </View>

        {/* Fixed lesson header */}
        {lessons[currentIndex] && (
          <View style={styles.fixedHeader}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.levelBadge}>
              {lessons[currentIndex].level.toUpperCase()} · {lessons[currentIndex].skill}
            </ThemedText>
            <ThemedText type="title" style={styles.title}>
              {lessons[currentIndex].title}
            </ThemedText>
            <ThemedText type="subtitle" style={styles.goal}>
              Goal: {lessons[currentIndex].goal}
            </ThemedText>
          </View>
        )}

        {/* Swipeable lesson content */}
        <SwipeableLessonCards
          lessons={lessons}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
        >
          {(currentLesson: DbLesson, index: number) => (
            <View style={styles.lessonContent}>

              {/* lesson body */}
              <ThemedView type="backgroundElement" style={styles.card}>
                <ThemedText type="default" style={styles.bodyText}>
                  {currentLesson.lessonText}
                </ThemedText>
              </ThemedView>

              {/* bad / good prompt examples */}
              {(currentLesson.badPrompt || currentLesson.goodPrompt) ? (
                <View style={styles.examples}>
                  {currentLesson.badPrompt ? (
                    <View style={[styles.exampleBox, styles.badBox]}>
                      <ThemedText type="smallBold" style={styles.exampleLabel}>
                        ✗ Weak prompt
                      </ThemedText>
                      <ThemedText type="small" style={styles.exampleText}>
                        {currentLesson.badPrompt}
                      </ThemedText>
                    </View>
                  ) : null}

                  {currentLesson.goodPrompt ? (
                    <View style={[styles.exampleBox, styles.goodBox]}>
                      <ThemedText type="smallBold" style={styles.exampleLabel}>
                        ✓ Strong prompt
                      </ThemedText>
                      <ThemedText type="small" style={styles.exampleText}>
                        {currentLesson.goodPrompt}
                      </ThemedText>
                    </View>
                  ) : null}
                </View>
              ) : null}

              {/* practice task preview */}
              <ThemedView type="backgroundElement" style={[styles.card, styles.taskCard]}>
                <ThemedText type="smallBold" style={styles.taskLabel}>
                  Your practice task
                </ThemedText>
                <ThemedText type="default">{currentLesson.practiceTask}</ThemedText>
              </ThemedView>

              {/* lesson navigation */}
              <View style={styles.actions}>
                {index > 0 ? (
                  <PrimaryButton
                    title="Previous"
                    onPress={() => setCurrentIndex((i) => i - 1)}
                    style={styles.secondaryBtn}
                  />
                ) : null}
                <PrimaryButton
                  title={index === lessons.length - 1 ? 'Start practice' : 'Next'}
                  onPress={() => {
                    if (index === lessons.length - 1) {
                      handlePractice();
                    } else {
                      setCurrentIndex((i) => i + 1);
                    }
                  }}
                  style={styles.primaryBtn}
                />
              </View>
            </View>
          )}
        </SwipeableLessonCards>
      </ScreenShell>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.six,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  fixedHeader: {
    marginBottom: Spacing.four,
  },
  lessonContent: {
    flex: 1,
    width: '100%',
  },
  errorText: {
    color: '#ef4444',
    marginBottom: Spacing.three,
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.one,
    marginBottom: Spacing.four,
    alignSelf: 'center',
  },
  stepDot: {
    width: 24,
    height: 4,
    borderRadius: 2,
  },
  header: {
    marginBottom: Spacing.four,
  },
  levelBadge: {
    marginBottom: Spacing.two,
    letterSpacing: 1,
  },
  title: {
    marginBottom: Spacing.two,
    color: '#6b21a8',
  },
  goal: {
    color: '#7e22ce',
    fontSize: 15,
  },
  card: {
    width: '100%',
    borderRadius: Spacing.three,
    padding: Spacing.four,
    marginBottom: Spacing.three,
  },
  bodyText: {
    lineHeight: 26,
  },
  examples: {
    width: '100%',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  exampleBox: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    borderLeftWidth: 3,
  },
  badBox: {
    backgroundColor: 'rgba(239,68,68,0.07)',
    borderLeftColor: '#ef4444',
  },
  goodBox: {
    backgroundColor: 'rgba(34,197,94,0.07)',
    borderLeftColor: '#22c55e',
  },
  exampleLabel: {
    marginBottom: Spacing.one,
  },
  exampleText: {
    lineHeight: 22,
  },
  taskCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#9333ea',
  },
  taskLabel: {
    color: '#7e22ce',
    marginBottom: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
    width: '100%',
  },
  secondaryBtn: {
    flex: 1,
  },
  primaryBtn: {
    flex: 1,
  },
});
