import { supabase } from '@/lib/supabase';
import type { ScoreBreakdown } from '@/types';

type EnhanceFeedbackResponse = { tip: string | null; error?: string };
type PlaygroundResponse = {
  text?: string | null;
  error?: string | null;
  weakText?: string | null;
  strongText?: string | null;
  comparisonTip?: string | null;
};

/**
 * Optional Gemini-enhanced feedback (server-side only).
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

  if (error) return null;
  return data?.tip ?? null;
}

export async function fetchPlaygroundResponse(
  prompt: string,
  mode: 'default' | 'weak' | 'strong' = 'default',
): Promise<string> {
  const { data, error } = await supabase.functions.invoke<PlaygroundResponse>(
    'playground-complete',
    { body: { prompt, mode } },
  );

  if (error) {
    return `Playground unavailable: ${error.message}. Deploy with: supabase functions deploy playground-complete`;
  }

  if (data?.error) {
    return data.error;
  }

  return data?.text ?? 'No response generated.';
}

export type CompareResult = {
  weakText: string;
  strongText: string;
  comparisonTip: string | null;
};

/** A/B compare weak vs strong prompts — signature Prompt Lab feature. */
export async function fetchPromptCompare(
  weakPrompt: string,
  strongPrompt: string,
): Promise<CompareResult> {
  const { data, error } = await supabase.functions.invoke<PlaygroundResponse>(
    'playground-complete',
    {
      body: {
        mode: 'compare',
        weakPrompt,
        strongPrompt,
      },
    },
  );

  if (error) {
    return {
      weakText: `Error: ${error.message}`,
      strongText: 'Deploy: supabase functions deploy playground-complete',
      comparisonTip: null,
    };
  }

  if (data?.error && !data.weakText && !data.strongText) {
    return {
      weakText: data.error,
      strongText: data.error,
      comparisonTip: null,
    };
  }

  return {
    weakText: data?.weakText ?? 'No response',
    strongText: data?.strongText ?? 'No response',
    comparisonTip: data?.comparisonTip ?? null,
  };
}
