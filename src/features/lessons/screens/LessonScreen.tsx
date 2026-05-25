import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { LessonEndToast } from '@/components/lesson-end-toast';
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
  const [showToast, setShowToast] = useState(false);
  const [highlightPractice, setHighlightPractice] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const practiceButtonScale = useRef(new Animated.Value(1)).current;

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

  const handleLessonEnd = () => {
    // Show toast notification
    setShowToast(true);
    
    // Scroll to practice button after a short delay
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 500);
    
    // Highlight practice button with pulse animation
    setHighlightPractice(true);
    startPulseAnimation();
  };

  const startPulseAnimation = () => {
    const pulse = Animated.sequence([
      Animated.timing(practiceButtonScale, {
        toValue: 1.05,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(practiceButtonScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);
    
    Animated.loop(pulse).start();
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
        {/* Toast notification */}
        <LessonEndToast 
          visible={showToast} 
          onHide={() => setShowToast(false)} 
        />
        
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
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

          {/* Swipeable lesson content */}
          <SwipeableLessonCards
            lessons={lessons}
            currentIndex={currentIndex}
            onIndexChange={setCurrentIndex}
            onLessonEnd={handleLessonEnd}
          >
          {(currentLesson: DbLesson, index: number) => (
            <View style={styles.lessonContent}>

              {/* header */}
              <View style={styles.header}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.levelBadge}>
                  {currentLesson.level.toUpperCase()} · {currentLesson.skill}
                </ThemedText>
                <ThemedText type="title" style={styles.title}>
                  {currentLesson.title}
                </ThemedText>
                <ThemedText type="subtitle" style={styles.goal}>
                  Goal: {currentLesson.goal}
                </ThemedText>
              </View>

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
                <Animated.View
                  style={[
                    index === lessons.length - 1 && highlightPractice && styles.highlightedButton,
                    { transform: [{ scale: index === lessons.length - 1 ? practiceButtonScale : 1 }] }
                  ]}
                >
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
                </Animated.View>
              </View>
            </View>
          )}
        </SwipeableLessonCards>
        </ScrollView>
      </ScreenShell>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
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
  highlightedButton: {
    shadowColor: '#9333ea',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 12,
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
