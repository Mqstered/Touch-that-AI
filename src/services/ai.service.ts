import { supabase } from '@/lib/supabase';
import type { ScoreBreakdown } from '@/types';

type EnhanceFeedbackResponse = { tip: string | null; error?: string };
type PlaygroundResponse = { text: string };

/**
 * Optional Gemini-enhanced feedback (server-side only).
 * Returns null tip on failure — caller should keep rule-based tips.
 */
export async function fetchEnhancedFeedback(
  userResponse: string,
  practiceTask: string,
  score: ScoreBreakdown,
  ruleFeedback: string[],
): Promise<string | null> {
  const { data, error } = await supabase.functions.invoke<EnhanceFeedbackResponse>(
    'enhance-feedback',
    {
      body: {
        userResponse,
        practiceTask,
        score: {
          clarity: score.clarity,
          context: score.context,
          constraints: score.constraints,
          outputFormat: score.outputFormat,
          safety: score.safety,
          total: score.total,
        },
        ruleFeedback,
      },
    },
  );

  if (error || !data?.tip) return null;
  return data.tip;
}

/**
 * Live AI response for the Explore playground.
 */
export async function fetchPlaygroundResponse(
  prompt: string,
  mode: 'default' | 'weak' | 'strong' = 'default',
): Promise<string> {
  const { data, error } = await supabase.functions.invoke<PlaygroundResponse>(
    'playground-complete',
    { body: { prompt, mode } },
  );

  if (error) {
    return 'Could not reach the AI playground. Check your connection or try again later.';
  }

  return data?.text ?? 'No response generated.';
}
