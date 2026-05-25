import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { callGemini } from "../_shared/gemini.ts";

type RequestBody = {
  prompt?: string;
  weakPrompt?: string;
  strongPrompt?: string;
  mode?: "default" | "weak" | "strong" | "compare";
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
    return json({
      text: null,
      error:
        "GEMINI_API_KEY is not set. Run: supabase secrets set GEMINI_API_KEY=your-key && supabase functions deploy playground-complete",
    }, 503);
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ text: null, error: "Invalid JSON body" }, 400);
  }

  if (body.mode === "compare") {
    const weak = body.weakPrompt?.trim() ?? "Plan my day.";
    const strong = body.strongPrompt?.trim() ??
      "Plan my day. I work 9–6, want 30 min exercise, 1 hr study. Give a table.";

    const weakSystem =
      "Respond briefly to this vague prompt as a generic AI would. Under 70 words.";
    const strongSystem =
      "Respond helpfully to this well-structured prompt. Follow their format. Under 100 words.";

    const [weakRes, strongRes] = await Promise.all([
      callGemini(apiKey, weakSystem, weak, 120),
      callGemini(apiKey, strongSystem, strong, 150),
    ]);

    if (!weakRes.ok && !strongRes.ok) {
      return json({
        weakText: null,
        strongText: null,
        error: `Gemini failed: ${weakRes.error}`,
      }, 200);
    }

    return json({
      weakText: weakRes.ok ? weakRes.text : `Could not generate (${weakRes.error})`,
      strongText: strongRes.ok
        ? strongRes.text
        : `Could not generate (${strongRes.error})`,
      comparisonTip: strongRes.ok && weakRes.ok
        ? "Notice how the stronger prompt adds context, constraints, and output format — that is what you are training in this app."
        : null,
    }, 200);
  }

  const userPrompt = body.prompt?.trim();
  if (!userPrompt) {
    return json({ text: "Enter a prompt and tap Generate.", error: null }, 200);
  }

  const system =
    body.mode === "weak"
      ? "Respond briefly to this vague prompt as a generic AI would. Keep under 80 words."
      : body.mode === "strong"
        ? "Respond helpfully to this well-structured prompt. Use the structure they provided. Keep under 120 words."
        : "You are a demo assistant in a prompt-engineering learning app. Give a short, educational response (under 100 words).";

  const result = await callGemini(apiKey, system, userPrompt, 200);

  if (!result.ok) {
    return json({
      text: null,
      error: `AI service error: ${result.error}. Confirm GEMINI_API_KEY and deploy: supabase functions deploy playground-complete`,
    }, 200);
  }

  return json({ text: result.text, error: null, model: result.model }, 200);
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}
