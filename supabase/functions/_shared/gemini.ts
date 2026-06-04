/** Shared Gemini caller with model fallbacks for Edge Functions. */

const MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.5-flash",
];

export type GeminiResult =
  | { ok: true; text: string; model: string }
  | { ok: false; error: string };

export async function callGemini(
  apiKey: string,
  systemInstruction: string,
  userText: string,
  maxTokens = 500,
): Promise<GeminiResult> {
  const trimmed = userText.trim().slice(0, 2000);
  if (!trimmed) {
    return { ok: false, error: "Empty prompt" };
  }

  const combinedPrompt =
    `${systemInstruction}\n\n---\nUser:\n${trimmed}`;

  let lastError = "No models available";

  for (const model of MODELS) {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [{ role: "user", parts: [{ text: trimmed }] }],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: 0.5,
          },
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.error(`Gemini ${model} failed:`, res.status, errBody);
        lastError = `${model}: ${res.status}`;
        continue;
      }

      const data = await res.json();
      //const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      const parts = data?.candidates?.[0]?.content?.parts;
      const text = parts?.map((p: { text: any; }) => p?.text).join('').trim();
      // const text = parts
      //   ?.filter(p => typeof p?.text === "string")
      //   .map(p => p.text)
      //   .join("")
      //   .trim();

      if (text) {
        return { ok: true, text, model };
      }

      const block = data?.promptFeedback?.blockReason;
      if (block) {
        lastError = `Blocked: ${block}`;
        continue;
      }

      lastError = `${model}: empty response`;
    } catch (e) {
      console.error(`Gemini ${model} exception:`, e);
      lastError = e instanceof Error ? e.message : "Network error";

      // Plain combined prompt fallback (no systemInstruction)
      try {
        const res2 = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: combinedPrompt }] }],
            generationConfig: {
              maxOutputTokens: maxTokens,
              temperature: 0.5,
            },
          }),
        });
        if (res2.ok) {
          const data2 = await res2.json();
          //const text2 = data2?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          const parts2 = data2?.candidates?.[0]?.content?.parts;
          const text2 = parts2?.map((p: { text: any; }) => p?.text).join('').trim();
          if (text2) return { ok: true, text: text2, model: `${model}-fallback` };
        }
      } catch {
        // continue to next model
      }
    }
  }

  return { ok: false, error: lastError };
}
