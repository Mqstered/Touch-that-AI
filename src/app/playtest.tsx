import { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function PlaygroundScreen() {
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
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#f7eefb",
      }}
      contentContainerStyle={{
        padding: 24,
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      {/* BACKGROUND CIRCLES */}

      <View
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: 999,
          backgroundColor: "#e9d5ff",
          top: -80,
          right: -100,
          opacity: 0.5,
        }}
      />

      <View
        style={{
          position: "absolute",
          width: 250,
          height: 250,
          borderRadius: 999,
          backgroundColor: "#f5d0fe",
          bottom: 100,
          left: -120,
          opacity: 0.4,
        }}
      />

      {/* TITLE */}

      <Text
        style={{
          color: "#6b21a8",
          fontSize: 56,
          fontWeight: "bold",
          marginBottom: 12,
        }}
      >
        Shape the response
      </Text>

      <Text
        style={{
          color: "#7e22ce",
          fontSize: 20,
          marginBottom: 40,
        }}
      >
        Train your AI prompting instincts.
      </Text>

      {/* INPUT */}

      <TextInput
        placeholder="Type your prompt..."
        placeholderTextColor="#a855f7"
        multiline
        value={prompt}
        onChangeText={analyzeLive}
        style={{
          backgroundColor: "#fdf8ff",
          color: "#581c87",
          padding: 28,
          borderRadius: 30,
          minHeight: 220,
          fontSize: 22,
          textAlignVertical: "top",
          marginBottom: 30,
          borderWidth: 2,
          borderColor: "#e9d5ff",
        }}
      />

      {/* LIVE AI ANALYSIS */}

      <View
        style={{
          backgroundColor: "#fdf8ff",
          borderRadius: 30,
          padding: 28,
          marginBottom: 30,
          borderWidth: 2,
          borderColor: "#e9d5ff",
        }}
      >
        <Text
          style={{
            color: "#7e22ce",
            fontSize: 16,
            marginBottom: 20,
            fontWeight: "600",
          }}
        >
          LIVE AI ANALYSIS
        </Text>

        <Text
          style={{
            color: "#581c87",
            fontSize: 22,
            marginBottom: 14,
            fontWeight: "600",
          }}
        >
          Prompt Clarity: {score}%
        </Text>

        {/* PROGRESS BAR */}

        <View
          style={{
            height: 14,
            backgroundColor: "#ead5ff",
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          <View
            style={{
              width: `${score}%`,
              height: "100%",
              backgroundColor: "#9333ea",
            }}
          />
        </View>

        <Text
          style={{
            color: "#6b7280",
            fontSize: 20,
            marginBottom: 12,
          }}
        >
          Specificity: {specificity}
        </Text>

        <Text
          style={{
            color: "#6b7280",
            fontSize: 20,
          }}
        >
          AI Confidence: {Math.min(score + 8, 100)}%
        </Text>
      </View>

      {/* BUTTON */}

      <TouchableOpacity
        onPress={analyzePrompt}
        style={{
          backgroundColor: "#9333ea",
          paddingVertical: 22,
          borderRadius: 24,
          alignItems: "center",
          marginBottom: 40,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
          }}
        >
          Analyze Prompt
        </Text>
      </TouchableOpacity>

      {/* THINKING */}

      {thinking && (
        <View
          style={{
            backgroundColor: "#fdf8ff",
            borderRadius: 30,
            padding: 28,
            marginBottom: 30,
            borderWidth: 2,
            borderColor: "#e9d5ff",
          }}
        >
          <Text
            style={{
              color: "#9333ea",
              fontSize: 18,
              marginBottom: 14,
              fontWeight: "bold",
            }}
          >
            AI THINKING...
          </Text>

          <Text
            style={{
              color: "#581c87",
              fontSize: 20,
              lineHeight: 34,
            }}
          >
            Analyzing intent...
            {"\n"}
            Evaluating clarity...
            {"\n"}
            Optimizing structure...
          </Text>
        </View>
      )}

      {/* FEEDBACK */}

      {feedback !== "" && (
        <View
          style={{
            backgroundColor: "#fdf8ff",
            borderRadius: 30,
            padding: 28,
            marginBottom: 30,
            borderWidth: 2,
            borderColor: "#e9d5ff",
          }}
        >
          <Text
            style={{
              color: "#9333ea",
              fontSize: 18,
              marginBottom: 14,
              fontWeight: "bold",
            }}
          >
            AI FEEDBACK
          </Text>

          <Text
            style={{
              color: "#581c87",
              fontSize: 22,
              lineHeight: 38,
            }}
          >
            {feedback}
          </Text>
        </View>
      )}

      {/* PROMPT UPGRADED */}

      {improvedPrompt !== "" && (
        <View
          style={{
            backgroundColor: "#faf5ff",
            borderRadius: 30,
            padding: 28,
            borderWidth: 2,
            borderColor: "#9333ea",
          }}
        >
          <Text
            style={{
              color: "#9333ea",
              fontSize: 18,
              marginBottom: 16,
              fontWeight: "bold",
            }}
          >
            PROMPT UPGRADED
          </Text>

          <Text
            style={{
              color: "#581c87",
              fontSize: 22,
              lineHeight: 38,
            }}
          >
            {improvedPrompt}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}