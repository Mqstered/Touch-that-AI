import { Slot } from "expo-router";
import React, { createContext, useState } from "react";

type PlaytestContextType = {
  prompt: string;
  setPrompt: (p: string) => void;
  score: number;
  specificity: string;
  thinking: boolean;
  feedback: string;
  improvedPrompt: string;
  analyzeLive: (text: string) => void;
  analyzePrompt: () => Promise<void>;
};

export const PlaytestContext = createContext<PlaytestContextType>({
  prompt: "",
  setPrompt: () => {},
  score: 0,
  specificity: "Weak",
  thinking: false,
  feedback: "",
  improvedPrompt: "",
  analyzeLive: () => {},
  analyzePrompt: async () => {},
});

export default function PlaytestLayout() {
  const [prompt, setPrompt] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [specificity, setSpecificity] = useState("Weak");
  const [thinking, setThinking] = useState(false);
  const [improvedPrompt, setImprovedPrompt] = useState("");

  const analyzeLive = (text: string) => {
    setPrompt(text);

    let liveScore = Math.min(text.length * 2, 100);

    if (text.includes("because")) liveScore += 10;
    if (text.includes("?")) liveScore += 5;
    if (text.length > 80) liveScore += 10;

    if (liveScore > 100) liveScore = 100;

    setScore(liveScore);

    if (liveScore < 40) {
      setSpecificity("Weak");
    } else if (liveScore < 70) {
      setSpecificity("Medium");
    } else {
      setSpecificity("Strong");
    }
  };

  const analyzePrompt = async () => {
    setThinking(true);
    setFeedback("");
    setImprovedPrompt("");

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setThinking(false);

    const lowerPrompt = prompt.toLowerCase();

    // WEATHER / CLIMATE
    if (
      lowerPrompt.includes("weather") ||
      lowerPrompt.includes("climate") ||
      lowerPrompt.includes("global warming")
    ) {
      setFeedback(
        "Your prompt has a strong topic but lacks specificity and desired output style."
      );

      setImprovedPrompt(
        "Explain how global warming impacts weather patterns, rising temperatures, and extreme climate events in beginner-friendly terms."
      );

      return;
    }

    // FOOD / DIET
    if (
      lowerPrompt.includes("diet") ||
      lowerPrompt.includes("food") ||
      lowerPrompt.includes("weight")
    ) {
      setFeedback(
        "Good intent detected. Adding goals and constraints improves AI response quality."
      );

      setImprovedPrompt(
        "Create a healthy Indian meal plan for weight gain focused on protein intake, calorie surplus, and affordable foods."
      );

      return;
    }

    // STUDY / LEARNING
    if (
      lowerPrompt.includes("study") ||
      lowerPrompt.includes("learn") ||
      lowerPrompt.includes("exam")
    ) {
      setFeedback(
        "Your learning request is understandable, but the AI needs more structure and outcome direction."
      );

      setImprovedPrompt(
        "Create a 2-hour study plan for biology revision with breaks, active recall exercises, and priority topics."
      );

      return;
    }

    // CODING
    if (
      lowerPrompt.includes("code") ||
      lowerPrompt.includes("programming") ||
      lowerPrompt.includes("python")
    ) {
      setFeedback(
        "Technical prompts improve significantly when the desired output and difficulty level are specified."
      );

      setImprovedPrompt(
        "Teach me Python loops with beginner-friendly examples and a small practice exercise at the end."
      );

      return;
    }

    // DEFAULT FALLBACK
    setFeedback(
      "Your prompt has potential, but adding clearer intent and expected outcomes would improve the AI response."
    );

    setImprovedPrompt(
      `Explain "${prompt}" in a detailed, beginner-friendly way with examples and practical insights.`
    );
  };

  return (
    <PlaytestContext.Provider
      value={{
        prompt,
        setPrompt,
        score,
        specificity,
        thinking,
        feedback,
        improvedPrompt,
        analyzeLive,
        analyzePrompt,
      }}
    >
      <Slot />
    </PlaytestContext.Provider>
  );
}
