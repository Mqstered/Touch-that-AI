import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { callGemini } from "../_shared/gemini.ts";

type ScoreBreakdown = {
  clarity: number;
  context: number;
  constraints: number;
  outputFormat: number;
  safety: number;
  total: number;
};

type RequestBody = {
  userResponse: string;
  practiceTask: string;
  score: ScoreBreakdown;
  ruleFeedback: string[];
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
    return json({ tip: null, error: "GEMINI_API_KEY not configured" }, 503);
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ tip: null, error: "Invalid JSON" }, 400);
  }

  const { userResponse, practiceTask, score, ruleFeedback } = body;
  if (!userResponse?.trim()) {
    return json({ tip: null }, 200);
  }

  const prompt = `You are a friendly AI tutor in a prompt-engineering learning app.
Practice task: "${practiceTask}"
Student prompt: "${userResponse.slice(0, 1500)}"
Rubric (0-2 each): clarity=${score.clarity}, context=${score.context}, constraints=${score.constraints}, outputFormat=${score.outputFormat}, safety=${score.safety}. Total=${score.total}/10.
Rule tips already shown: ${ruleFeedback.join(" ")}

Write exactly 1-2 short sentences of personalized feedback referencing their wording. Do not repeat rule tips. No markdown.`;

  const result = await callGemini(
    apiKey,
    "You are an encouraging prompt-writing coach.",
    prompt,
    120,
  );

  if (!result.ok) {
    console.error("enhance-feedback:", result.error);
    return json({ tip: null, error: result.error }, 200);
  }

  return json({ tip: result.text }, 200);
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}
