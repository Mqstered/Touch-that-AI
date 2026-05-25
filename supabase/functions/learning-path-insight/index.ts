import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { callGemini } from "../_shared/gemini.ts";

type LearnerProfile = {
  preferred_goal?: string;
  suggested_level?: string;
  weak_skill?: string | null;
  weak_criterion?: string | null;
  avg_score_10?: number;
  total_attempts?: number;
  criterion_averages?: Record<string, number>;
};

type RequestBody = {
  profile: LearnerProfile;
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS });
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return json({ insight: null }, 200);
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ insight: null }, 400);
  }

  const p = body.profile ?? {};
  const attempts = p.total_attempts ?? 0;

  const userPrompt = attempts === 0
    ? `A new user is starting a prompt-engineering app with goal "${p.preferred_goal ?? "study"}" at beginner level. Write 2 short encouraging sentences about what they will learn first. No markdown.`
    : `Based on learner data, write 2-3 short personalized sentences about their learning path. Friendly, specific. No markdown.

Goal: ${p.preferred_goal ?? "study"}
Level: ${p.suggested_level ?? "beginner"}
Average score: ${p.avg_score_10 ?? 0}/10
Attempts: ${attempts}
Weakest rubric: ${p.weak_criterion ?? "unknown"}
Weakest skill: ${p.weak_skill ?? "general"}`;

  const result = await callGemini(
    apiKey,
    "You are an AI learning coach for a mobile app called Touch That AI.",
    userPrompt,
    150,
  );

  if (!result.ok) {
    console.error("learning-path-insight:", result.error);
    return json({ insight: null }, 200);
  }

  return json({ insight: result.text }, 200);
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}
