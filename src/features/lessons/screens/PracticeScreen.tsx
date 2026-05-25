import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { generateFeedback, scorePrompt } from '@/lib/scoring';
import { fetchEnhancedFeedback } from '@/services/ai.service';
import { fetchLessonById } from '@/services/lessons.service';
import { savePracticeAttempt } from '@/services/practice.service';
import { useTheme } from '@/hooks/use-theme';
import type { DbLesson, ScoredAttempt } from '@/types';

const MIN_CHARS = 20;

export default function PracticeScreen() {
  const { lessonId, moduleSlug } = useLocalSearchParams<{
    lessonId: string;
    moduleSlug: string;
  }>();
  const router = useRouter();
  const theme = useTheme();
  const { state } = useAuth();

  const [lesson, setLesson] = useState<DbLesson | null>(null);
  const [loadingLesson, setLoadingLesson] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const startedAt = useRef(new Date().toISOString());
  const startMs = useRef(Date.now());

  useEffect(() => {
    if (!lessonId) return;
    setLoadingLesson(true);
    setResponse('');
    setValidationError(null);
    startedAt.current = new Date().toISOString();
    startMs.current = Date.now();

    fetchLessonById(lessonId).then((result) => {
      setLoadingLesson(false);
      if (!result.ok) { setFetchError(result.error); return; }
      if (!result.data) { setFetchError('Lesson not found.'); return; }
      setLesson(result.data);
    });
  }, [lessonId]);

  if (!lessonId || !moduleSlug) return null;

  if (loadingLesson) {
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

  if (fetchError || !lesson) {
    return (
      <AuthGuard>
        <ScreenShell>
          <ThemedText type="default" style={styles.errorText}>
            {fetchError ?? 'Something went wrong.'}
          </ThemedText>
          <PrimaryButton title="Go back" onPress={() => router.back()} />
        </ScreenShell>
      </AuthGuard>
    );
  }

  const handleSubmit = async () => {
    setValidationError(null);
    if (response.trim().length < MIN_CHARS) {
      setValidationError(`Please write at least ${MIN_CHARS} characters before submitting.`);
      return;
    }

    setSubmitting(true);

    const scoreBreakdown = scorePrompt(response.trim());
    const feedback = generateFeedback(scoreBreakdown);
    const timeSpentSeconds = Math.round((Date.now() - startMs.current) / 1000);

    const aiTip = await fetchEnhancedFeedback(
      response.trim(),
      lesson.practiceTask,
      scoreBreakdown,
      feedback,
    );
    const combinedFeedback = aiTip ? [...feedback, aiTip] : feedback;

    const attempt: ScoredAttempt = {
      lessonId: lesson.id,
      userResponse: response.trim(),
      score: scoreBreakdown,
      feedback: combinedFeedback,
      timeSpentSeconds,
    };

    if (state.status === 'authenticated') {
      await savePracticeAttempt(state.session.user.id, attempt, startedAt.current);
    }

    setSubmitting(false);

    router.replace({
      pathname: '/lesson/score',
      params: {
        lessonId: lesson.id,
        moduleSlug,
        lessonTitle: lesson.title,
        total: String(scoreBreakdown.total),
        clarity: String(scoreBreakdown.clarity),
        context: String(scoreBreakdown.context),
        constraints: String(scoreBreakdown.constraints),
        outputFormat: String(scoreBreakdown.outputFormat),
        safety: String(scoreBreakdown.safety),
        feedback: JSON.stringify(combinedFeedback),
      },
    });
  };

  return (
    <AuthGuard>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScreenShell>
          <ThemedText type="smallBold" style={styles.lessonTitle}>
            {lesson.title}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.lessonMeta}>
            {lesson.moduleSlug} · {lesson.skill} · {lesson.level}
          </ThemedText>

          <ThemedView type="backgroundElement" style={[styles.card, styles.taskCard]}>
            <ThemedText type="smallBold" style={styles.taskLabel}>
              Practice task
            </ThemedText>
            <ThemedText type="default">{lesson.practiceTask}</ThemedText>
          </ThemedView>

          {/* reminder of goal */}
          <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
            Write a prompt that addresses this task clearly. Think about: context, constraints,
            output format, and safety.
          </ThemedText>

          {/* input */}
          <TextInput
            style={[
              styles.input,
              {
                color: theme.text,
                backgroundColor: theme.backgroundElement,
                borderColor: validationError ? '#ef4444' : theme.backgroundSelected,
              },
            ]}
            placeholder="Write your prompt here…"
            placeholderTextColor={theme.textSecondary}
            multiline
            value={response}
            onChangeText={setResponse}
            textAlignVertical="top"
            editable={!submitting}
          />

          <View style={styles.charRow}>
            <ThemedText type="small" themeColor="textSecondary">
              {response.trim().length} characters
            </ThemedText>
          </View>

          {validationError ? (
            <ThemedText type="small" style={styles.errorText}>
              {validationError}
            </ThemedText>
          ) : null}

          <View style={styles.actions}>
            <PrimaryButton
              title="Cancel"
              onPress={() => router.back()}
              style={styles.cancelBtn}
            />
            <PrimaryButton
              title={submitting ? 'Scoring…' : 'Submit'}
              onPress={handleSubmit}
              disabled={submitting}
              style={styles.submitBtn}
            />
          </View>

          {submitting ? (
            <View style={styles.scoringRow}>
              <ActivityIndicator size="small" />
              <ThemedText type="small" themeColor="textSecondary" style={{ marginLeft: Spacing.two }}>
                Scoring your response…
              </ThemedText>
            </View>
          ) : null}
        </ScreenShell>
      </KeyboardAvoidingView>
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
  card: {
    width: '100%',
    borderRadius: Spacing.three,
    padding: Spacing.four,
    marginBottom: Spacing.three,
  },
  taskCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#9333ea',
  },
  lessonTitle: {
    color: '#6b21a8',
    marginBottom: Spacing.one,
  },
  lessonMeta: {
    marginBottom: Spacing.three,
  },
  taskLabel: {
    color: '#7e22ce',
    marginBottom: Spacing.two,
  },
  hint: {
    marginBottom: Spacing.three,
    lineHeight: 20,
  },
  input: {
    width: '100%',
    minHeight: 160,
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: Spacing.two,
  },
  charRow: {
    alignItems: 'flex-end',
    marginBottom: Spacing.two,
  },
  errorText: {
    color: '#ef4444',
    marginBottom: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
  },
  submitBtn: {
    flex: 2,
  },
  scoringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.three,
  },
});
