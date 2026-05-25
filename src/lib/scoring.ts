import type { ScoreBreakdown } from '@/types';

/**
 * Rule-based prompt scorer.
 *
 * Each of the five criteria scores 0–2:
 *   0 = absent / very weak
 *   1 = partially present
 *   2 = clearly present
 *
 * Total = sum of all five → max 10.
 */

const MIN_WORDS = 8;
const GOOD_WORDS = 20;

// ─── helpers ──────────────────────────────────────────────────────────────────

function words(text: string): string[] {
  return text.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function wordCount(text: string): number {
  return words(text).length;
}

function containsAny(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase();
  return terms.some((t) => lower.includes(t));
}

// ─── criteria ─────────────────────────────────────────────────────────────────

/**
 * Clarity: Is the prompt specific and unambiguous?
 * - 0: fewer than MIN_WORDS words — too short to be meaningful
 * - 1: brief but understandable
 * - 2: detailed, ≥ GOOD_WORDS words with clear subject
 */
function scoreClarity(text: string): number {
  const n = wordCount(text);
  if (n < MIN_WORDS) return 0;
  if (n >= GOOD_WORDS) return 2;
  return 1;
}

/**
 * Context: Does the prompt supply background / audience / purpose?
 * Signals: "I am", "I'm", "as a", "for a", "my", "we", "our",
 *          "audience", "purpose", "goal", "because", "so that"
 */
function scoreContext(text: string): number {
  const signals = [
    "i am", "i'm", "as a", "for a", "for my", "for our",
    "my goal", "my purpose", "our goal", "audience",
    "purpose", "because", "so that", "in order to",
  ];
  const hits = signals.filter((s) => text.toLowerCase().includes(s)).length;
  if (hits === 0) return 0;
  if (hits === 1) return 1;
  return 2;
}

/**
 * Constraints: Does the prompt set limits or requirements?
 * Signals: numbers, "only", "do not", "don't", "avoid", "limit",
 *          "no more than", "at most", "must", "should not",
 *          "without", "exclude", "maximum", "minimum"
 */
function scoreConstraints(text: string): number {
  const hasNumber = /\d+/.test(text);
  const signals = [
    "only", "do not", "don't", "avoid", "limit", "no more",
    "at most", "must", "should not", "without", "exclude",
    "maximum", "minimum", "no longer than", "exactly",
  ];
  const hits = signals.filter((s) => text.toLowerCase().includes(s)).length;
  const total = (hasNumber ? 1 : 0) + hits;
  if (total === 0) return 0;
  if (total === 1) return 1;
  return 2;
}

/**
 * Output format: Does the prompt specify what form the answer should take?
 * Signals: "list", "bullet", "table", "summary", "paragraph",
 *          "steps", "numbered", "in json", "as a", "format",
 *          "sentence", "word", "section", "heading"
 */
function scoreOutputFormat(text: string): number {
  const signals = [
    "list", "bullet", "table", "summary", "paragraph",
    "step", "numbered", "in json", "format", "sentence",
    "word", "section", "heading", "short", "brief", "concise",
    "explain", "describe", "compare", "outline",
  ];
  const hits = signals.filter((s) => text.toLowerCase().includes(s)).length;
  if (hits === 0) return 0;
  if (hits === 1) return 1;
  return 2;
}

/**
 * Safety / privacy: Does the prompt avoid requesting harmful, private,
 * or unethical content? Score is 2 by default and drops for red-flag terms.
 *
 * Red flags: "hack", "bypass", "ignore your instructions",
 *            "pretend you have no rules", "social security",
 *            "password", "illegal", "jailbreak"
 */
function scoreSafety(text: string): number {
  const hardFlags = [
    "hack", "jailbreak", "bypass", "ignore your instructions",
    "pretend you have no rules", "act as if you have no restrictions",
    "social security number", "credit card number", "password",
    "illegal", "how to make a bomb", "how to make a weapon",
  ];
  const softFlags = ["exploit", "circumvent", "override rules", "break the rules"];

  if (containsAny(text, hardFlags)) return 0;
  if (containsAny(text, softFlags)) return 1;
  return 2;
}

// ─── public API ───────────────────────────────────────────────────────────────

/**
 * Score a user's prompt response against five criteria.
 * Returns a ScoreBreakdown with individual scores (0–2 each) and total (0–10).
 */
export function scorePrompt(userResponse: string): ScoreBreakdown {
  const clarity = scoreClarity(userResponse);
  const context = scoreContext(userResponse);
  const constraints = scoreConstraints(userResponse);
  const outputFormat = scoreOutputFormat(userResponse);
  const safety = scoreSafety(userResponse);

  return {
    clarity,
    context,
    constraints,
    outputFormat,
    safety,
    total: clarity + context + constraints + outputFormat + safety,
  };
}

/**
 * Generate beginner-friendly feedback messages based on a score breakdown.
 * Returns an array of plain-English suggestions — empty array if everything scored 2.
 */
export function generateFeedback(score: ScoreBreakdown): string[] {
  const tips: string[] = [];

  if (score.clarity < 2) {
    tips.push(
      score.clarity === 0
        ? 'Your prompt is very short. Try to write at least 2–3 sentences describing exactly what you need.'
        : 'Add more detail. A specific, precise prompt gets a much better response.',
    );
  }

  if (score.context < 2) {
    tips.push(
      score.context === 0
        ? 'Provide context — tell the AI who you are, what you already know, or why you need this.'
        : 'A bit more background (e.g. your role, the goal, the audience) will sharpen the answer.',
    );
  }

  if (score.constraints < 2) {
    tips.push(
      score.constraints === 0
        ? 'Add constraints — for example: word count, format, things to avoid, or a specific scope.'
        : 'Try adding one more limit or requirement (e.g. "no more than 3 bullet points").',
    );
  }

  if (score.outputFormat < 2) {
    tips.push(
      score.outputFormat === 0
        ? 'Specify the output format you want — a list, a summary, steps, a table, etc.'
        : 'Be more explicit about format — for example "a numbered list of 5 items".',
    );
  }

  if (score.safety < 2) {
    tips.push(
      score.safety === 0
        ? 'Your prompt contains content that could be unsafe or harmful. Rephrase to stay within ethical boundaries.'
        : 'Some wording in your prompt may push against safety guidelines — consider rephrasing.',
    );
  }

  if (tips.length === 0) {
    tips.push('Great prompt! You covered clarity, context, constraints, output format, and safety.');
  }

  return tips;
}

/** Convert a raw 0–10 score to a percentage mastery delta (used to update user_progress) */
export function scoreToDelta(total: number): number {
  return Math.round((total / 10) * 20);
}
