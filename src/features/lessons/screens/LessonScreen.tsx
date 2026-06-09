import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { BackButton } from "@/components/back-button";
import { LessonEndToast } from "@/components/lesson-end-toast";
import { PrimaryButton } from "@/components/primary-button";
import { ScreenShell } from "@/components/screen-shell";
import { SwipeableLessonCards } from "@/components/swipeable-lesson-cards";
import { Spacing } from "@/constants/theme";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
    fetchLessonsForModule,
    fetchNextPracticeLesson,
} from "@/services/lessons.service";
import type { DbLesson } from "@/types";

export default function LessonScreen() {
  const { moduleSlug, lessonId } = useLocalSearchParams<{
    moduleSlug: string;
    lessonId?: string;
  }>();

  const router = useRouter();
  const { state } = useAuth();

  const [lessons, setLessons] = useState<DbLesson[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [highlightPractice, setHighlightPractice] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const practiceButtonScale = useRef(new Animated.Value(1)).current;

  //------------------------------------------------
  // LOAD LESSONS
  //------------------------------------------------

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

        if (idx >= 0) {
          setCurrentIndex(idx);
        }

        return;
      }

      if (state.status === "authenticated") {
        fetchNextPracticeLesson(state.session.user.id, moduleSlug).then(
          (next) => {
            if (next.ok && next.data) {
              const idx = result.data.findIndex((l) => l.id === next.data!.id);

              if (idx >= 0) {
                setCurrentIndex(idx);
              }
            }
          },
        );
      }
    });
  }, [
    moduleSlug,
    lessonId,
    state.status === "authenticated" && state.session?.user.id,
  ]);

  //------------------------------------------------
  // LOADING
  //------------------------------------------------

  if (!moduleSlug) return null;

  if (loading) {
    return (
      <AuthGuard>
        <ScreenShell>
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#9333ea" />
          </View>
        </ScreenShell>
      </AuthGuard>
    );
  }

  //------------------------------------------------
  // ERROR
  //------------------------------------------------

  if (error) {
    return (
      <AuthGuard>
        <ScreenShell>
          <Text style={styles.errorText}>{error}</Text>

          <PrimaryButton title="Go back" onPress={() => router.back()} />
        </ScreenShell>
      </AuthGuard>
    );
  }

  //------------------------------------------------
  // EMPTY
  //------------------------------------------------

  if (lessons.length === 0) {
    return (
      <AuthGuard>
        <ScreenShell>
          <Text style={styles.emptyTitle}>No lessons yet</Text>

          <Text style={styles.emptyText}>
            Lessons for this module haven't been added yet.
          </Text>

          <PrimaryButton title="Go back" onPress={() => router.back()} />
        </ScreenShell>
      </AuthGuard>
    );
  }

  //------------------------------------------------
  // CURRENT LESSON
  //------------------------------------------------

  const lesson = lessons[currentIndex];

  //------------------------------------------------
  // PRACTICE
  //------------------------------------------------

  const handlePractice = () => {
    router.push({
      pathname: "/lesson/practice",
      params: {
        lessonId: lesson.id,
        moduleSlug,
      },
    });
  };

  //------------------------------------------------
  // LESSON END
  //------------------------------------------------

  const handleLessonEnd = () => {
    setShowToast(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 500);

    setHighlightPractice(true);

    startPulseAnimation();
  };

  //------------------------------------------------
  // PULSE
  //------------------------------------------------

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

  //------------------------------------------------
  // UI
  //------------------------------------------------

  return (
    <AuthGuard>
      <ScreenShell>
        <LessonEndToast
          visible={showToast}
          onHide={() => setShowToast(false)}
        />

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}

          <View style={styles.headerContainer}>
            <BackButton onPress={() => router.replace("/explore")} />
          </View>

          {/* PROGRESS */}

          <View style={styles.stepRow}>
            {lessons.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.stepDot,
                  {
                    backgroundColor:
                      i <= currentIndex ? "#7c3aed" : "rgba(124,58,237,0.18)",
                  },
                ]}
              />
            ))}
          </View>

          {/* LESSON */}

          <SwipeableLessonCards
            lessons={lessons}
            currentIndex={currentIndex}
            onIndexChange={setCurrentIndex}
            onLessonEnd={handleLessonEnd}
          >
            {(currentLesson: DbLesson, index: number) => (
              <View style={styles.lessonContent}>
                {/* TITLE */}

                <View style={styles.header}>
                  <Text style={styles.levelBadge}>
                    {currentLesson.level.toUpperCase()} · {currentLesson.skill}
                  </Text>

                  <Text style={styles.title}>{currentLesson.title}</Text>

                  <Text style={styles.goal}>Goal: {currentLesson.goal}</Text>
                </View>

                {/* LESSON CARD */}

                <View style={styles.card}>
                  <Text style={styles.bodyText}>
                    {currentLesson.lessonText}
                  </Text>
                </View>

                {/* EXAMPLES */}

                {currentLesson.badPrompt || currentLesson.goodPrompt ? (
                  <View style={styles.examples}>
                    {currentLesson.badPrompt ? (
                      <View style={[styles.exampleBox, styles.badBox]}>
                        <Text style={styles.badLabel}>✗ Weak prompt</Text>

                        <Text style={styles.exampleText}>
                          {currentLesson.badPrompt}
                        </Text>
                      </View>
                    ) : null}

                    {currentLesson.goodPrompt ? (
                      <View style={[styles.exampleBox, styles.goodBox]}>
                        <Text style={styles.goodLabel}>✓ Strong prompt</Text>

                        <Text style={styles.exampleText}>
                          {currentLesson.goodPrompt}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {/* TASK */}

                <View style={[styles.card, styles.taskCard]}>
                  <Text style={styles.taskLabel}>Your practice task</Text>

                  <Text style={styles.taskText}>
                    {currentLesson.practiceTask}
                  </Text>
                </View>

                {/* BUTTONS */}

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
                      index === lessons.length - 1 &&
                        highlightPractice &&
                        styles.highlightedButton,
                      {
                        transform: [
                          {
                            scale:
                              index === lessons.length - 1
                                ? practiceButtonScale
                                : 1,
                          },
                        ],
                      },
                    ]}
                  >
                    <PrimaryButton
                      title={
                        index === lessons.length - 1 ? "Start practice" : "Next"
                      }
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
  //------------------------------------------------
  // LAYOUT
  //------------------------------------------------

  scrollView: {
    flex: 1,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing.six,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },

  lessonContent: {
    flex: 1,
    width: "100%",
  },

  //------------------------------------------------
  // PROGRESS
  //------------------------------------------------

  stepRow: {
    flexDirection: "row",
    gap: Spacing.one,
    marginBottom: Spacing.four,
    alignSelf: "center",
  },

  stepDot: {
    width: 28,
    height: 5,
    borderRadius: 999,
  },

  //------------------------------------------------
  // HEADER
  //------------------------------------------------

  header: {
    marginBottom: Spacing.five,
  },

  levelBadge: {
    marginBottom: Spacing.two,
    letterSpacing: 1,
    color: "#a855f7",
    fontWeight: "700",
    fontSize: 13,
  },

  title: {
    marginBottom: Spacing.two,
    color: "#6d28d9",
    fontSize: 46,
    fontWeight: "800",

    textShadowColor: "rgba(168,85,247,0.18)",
    textShadowRadius: 10,
  },

  goal: {
    color: "#db2777",
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 26,
  },

  //------------------------------------------------
  // CARD
  //------------------------------------------------

  card: {
    width: "100%",

    borderRadius: 28,

    padding: Spacing.four,

    marginBottom: Spacing.three,

    backgroundColor: "rgba(243,232,255,0.96)",

    borderWidth: 1,
    borderColor: "rgba(168,85,247,0.24)",

    shadowColor: "#9333ea",
    shadowOpacity: 0.12,
    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 8,
  },

  bodyText: {
    lineHeight: 34,
    fontSize: 17,
    color: "#4c1d95",
    fontWeight: "600",
  },

  //------------------------------------------------
  // EXAMPLES
  //------------------------------------------------

  examples: {
    width: "100%",
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },

  exampleBox: {
    borderRadius: 24,
    padding: Spacing.three,
    borderLeftWidth: 5,
    borderWidth: 1,
  },

  badBox: {
    backgroundColor: "rgba(168,85,247,0.10)",
    borderLeftColor: "#9333ea",
    borderColor: "rgba(147,51,234,0.18)",
  },

  goodBox: {
    backgroundColor: "rgba(236,72,153,0.10)",
    borderLeftColor: "#ec4899",
    borderColor: "rgba(236,72,153,0.18)",
  },

  badLabel: {
    marginBottom: Spacing.one,
    fontSize: 20,
    color: "#7e22ce",
    fontWeight: "800",
  },

  goodLabel: {
    marginBottom: Spacing.one,
    fontSize: 20,
    color: "#db2777",
    fontWeight: "800",
  },

  exampleText: {
    lineHeight: 30,
    fontSize: 16,
    color: "#581c87",
    fontWeight: "600",
  },

  //------------------------------------------------
  // TASK CARD
  //------------------------------------------------

  taskCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#c084fc",

    backgroundColor: "rgba(250,245,255,1)",
  },

  taskLabel: {
    color: "#9333ea",
    marginBottom: Spacing.two,
    fontSize: 22,
    fontWeight: "800",
  },

  taskText: {
    color: "#4c1d95",
    fontSize: 18,
    lineHeight: 32,
    fontWeight: "700",
  },

  //------------------------------------------------
  // BUTTONS
  //------------------------------------------------

  actions: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.three,
    width: "100%",
    justifyContent: "space-between",
  },

  secondaryBtn: {
    flex: 1,
    maxWidth: "48%",
  },

  primaryBtn: {
    flex: 1,
    maxWidth: "48%",
  },

  highlightedButton: {
    shadowColor: "#c084fc",

    shadowOffset: {
      width: 0,
      height: 0,
    },

    shadowOpacity: 0.8,
    shadowRadius: 16,

    elevation: 16,
  },

  //------------------------------------------------
  // EMPTY / ERROR
  //------------------------------------------------

  emptyTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#6d28d9",
    marginBottom: Spacing.three,
  },

  emptyText: {
    fontSize: 16,
    color: "#6b21a8",
    marginBottom: Spacing.four,
  },

  errorText: {
    color: "#db2777",
    marginBottom: Spacing.three,
    fontWeight: "700",
    fontSize: 16,
  },
});
