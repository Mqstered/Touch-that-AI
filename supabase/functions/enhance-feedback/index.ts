import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
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
The user completed this practice task: "${practiceTask}"
Their prompt: "${userResponse.slice(0, 1500)}"
Rubric scores (0-2 each): clarity=${score.clarity}, context=${score.context}, constraints=${score.constraints}, outputFormat=${score.outputFormat}, safety=${score.safety}. Total=${score.total}/10.
Rule-based tips already shown: ${ruleFeedback.join(" ")}

Write exactly 1-2 short sentences of personalized feedback referencing their specific wording. Do not repeat the rule tips verbatim. Be encouraging and concrete. No markdown.`;

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 120, temperature: 0.4 },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini error:", errText);
      return json({ tip: null, error: "Model unavailable" }, 200);
    }

    const data = await res.json();
    const tip =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
    return json({ tip }, 200);
  } catch (e) {
    console.error(e);
    return json({ tip: null, error: "Request failed" }, 200);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
