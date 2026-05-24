import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

type RequestBody = {
  prompt: string;
  mode?: "default" | "weak" | "strong";
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
    return json(
      { text: "AI playground is not configured yet. Add GEMINI_API_KEY to Supabase Edge Function secrets." },
      503,
    );
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ text: "Invalid request." }, 400);
  }

  const userPrompt = body.prompt?.trim();
  if (!userPrompt) {
    return json({ text: "Enter a prompt and tap Generate." }, 200);
  }

  const system =
    body.mode === "weak"
      ? "Respond briefly to this vague prompt as a generic AI would. Keep under 80 words."
      : body.mode === "strong"
        ? "Respond helpfully to this well-structured prompt. Use the structure they provided. Keep under 120 words."
        : "You are a demo assistant in a prompt-engineering learning app. Give a short, educational response (under 100 words).";

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ parts: [{ text: userPrompt.slice(0, 2000) }] }],
        generationConfig: { maxOutputTokens: 200, temperature: 0.5 },
      }),
    });

    if (!res.ok) {
      console.error(await res.text());
      return json({ text: "Could not reach the AI service. Try again later." }, 200);
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
      "No response generated.";
    return json({ text }, 200);
  } catch (e) {
    console.error(e);
    return json({ text: "Something went wrong. Please try again." }, 200);
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
