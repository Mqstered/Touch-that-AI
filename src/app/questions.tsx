import { useState } from "react";
import {
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const questions = [
  {
    question: "Which prompt will give the BEST AI result?",
    options: [
      "Help me study.",
      "Create a 2-hour biology study plan with breaks and important topics to revise.",
      "Study better.",
      "Tell me something about school.",
    ],
    correctAnswer: 1,
    explanation:
      "Better prompts include clear instructions, context, and specific goals.",
  },

  {
    question: "Which prompt gives the AI the best personalization?",
    options: [
      "Make me a workout plan.",
      "Create a workout routine.",
      "Create a 4-day beginner workout plan for someone with knee pain and limited equipment.",
      "Help me lose weight.",
    ],
    correctAnswer: 2,
    explanation:
      "Specific constraints and context improve AI responses significantly.",
  },

  {
    question: "Which prompt is best for reducing misinformation?",
    options: [
      "Explain quantum computing.",
      "Explain quantum computing simply.",
      "Explain quantum computing simply and include reliable sources.",
      "Tell me everything about quantum computing.",
    ],
    correctAnswer: 2,
    explanation:
      "Asking for sources improves reliability and verification.",
  },

  {
    question: "Which prompt gives clearer creative direction?",
    options: [
      "Write Instagram captions.",
      "Write aesthetic captions.",
      "Write 5 cozy cafe captions targeting college students with a warm tone.",
      "Make social media content.",
    ],
    correctAnswer: 2,
    explanation:
      "Audience, tone, and context help guide AI creativity.",
  },

  {
    question: "Which prompt gives better debugging help?",
    options: [
      "Fix my code.",
      "Debug this.",
      "Find the bug and explain the mistake step-by-step before fixing it.",
      "Why doesn't this work?",
    ],
    correctAnswer: 2,
    explanation:
      "Structured debugging prompts produce more educational responses.",
  },
];

export default function QuestionScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const question = questions[currentQuestion];

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        padding: 24,
      }}
    >
      <Text
        style={{
          color: "#888",
          fontSize: 16,
          marginBottom: 10,
        }}
      >
        Question {currentQuestion + 1} of {questions.length}
      </Text>

      <View
  style={{
    height: 12,
    backgroundColor: "#222",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 30,
  }}
>
  <View
    style={{
      height: "100%",
      width: `${((currentQuestion + 1) / questions.length) * 100}%`,
      backgroundColor: "#7c3aed",
      borderRadius: 10,
    }}
  />
</View>

      <Text
        style={{
          color: "white",
          fontSize: 30,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Prompt Basics
      </Text>

      <Text
        style={{
          color: "#aaa",
          fontSize: 18,
          marginBottom: 30,
        }}
      >
        {question.question}
      </Text>

      {question.options.map((option, index) => {
        const isCorrect = index === question.correctAnswer;
        const isSelected = index === selectedAnswer;

        let backgroundColor = "#1e1e1e";

        if (selectedAnswer !== null) {
          if (isCorrect) {
            backgroundColor = "#14532d";
          } else if (isSelected) {
            backgroundColor = "#7f1d1d";
          }
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedAnswer(index)}
            style={{
              backgroundColor,
              padding: 18,
              borderRadius: 18,
              marginBottom: 14,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
              }}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}

      {selectedAnswer !== null && (
        <View
          style={{
            marginTop: 20,
            backgroundColor: "#111",
            padding: 20,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            {selectedAnswer === question.correctAnswer
              ? "Correct!"
              : "Not quite!"}
          </Text>

          <Text
            style={{
              color: "#bbb",
              fontSize: 16,
            }}
          >
            {question.explanation}
          </Text>
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 30,
        }}
      >
        <TouchableOpacity
          onPress={previousQuestion}
          style={{
            backgroundColor: "#222",
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 14,
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={nextQuestion}
          style={{
            backgroundColor: "#7c3aed",
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 14,
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}