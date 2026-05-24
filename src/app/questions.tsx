import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
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
    explanation: "Asking for sources improves reliability and verification.",
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
    explanation: "Audience, tone, and context help guide AI creativity.",
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

  //------------------------------------------------
  // NEXT QUESTION
  //------------------------------------------------

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  //------------------------------------------------
  // PREVIOUS QUESTION
  //------------------------------------------------

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* BACKGROUND GLOWS */}

      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* QUESTION COUNTER */}

        <Text style={styles.questionCounter}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>

        {/* PROGRESS BAR */}

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              },
            ]}
          />
        </View>

        {/* TITLE */}

        <Text style={styles.title}>Prompt Basics</Text>

        {/* QUESTION */}

        <Text style={styles.question}>{question.question}</Text>

        {/* OPTIONS */}

        {question.options.map((option, index) => {
          const isCorrect = index === question.correctAnswer;

          const isSelected = index === selectedAnswer;

          let backgroundColor = "rgba(255,255,255,0.7)";

          if (selectedAnswer !== null) {
            if (isCorrect) {
              backgroundColor = "#bbf7d0";
            } else if (isSelected) {
              backgroundColor = "#fecdd3";
            }
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedAnswer(index)}
              style={[
                styles.optionButton,
                {
                  backgroundColor,
                },
              ]}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}

        {/* RESULT CARD */}

        {selectedAnswer !== null && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>
              {selectedAnswer === question.correctAnswer
                ? "Correct!"
                : "Not quite!"}
            </Text>

            <Text style={styles.resultText}>{question.explanation}</Text>
          </View>
        )}

        {/* NAVIGATION BUTTONS */}

        <View style={styles.navigationRow}>
          <TouchableOpacity
            onPress={previousQuestion}
            style={styles.previousButton}
          >
            <Text style={styles.navigationText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={nextQuestion} style={styles.nextButton}>
            <Text style={styles.navigationText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  //------------------------------------------------
  // CONTAINER
  //------------------------------------------------

  container: {
    flex: 1,
    backgroundColor: "#fdf2ff",
    overflow: "hidden",
  },

  scrollContent: {
    padding: 24,
    paddingTop: 70,
    paddingBottom: 120,
  },

  //------------------------------------------------
  // QUESTION COUNTER
  //------------------------------------------------

  questionCounter: {
    color: "#c026d3",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
  },

  //------------------------------------------------
  // PROGRESS BAR
  //------------------------------------------------

  progressBackground: {
    height: 14,
    backgroundColor: "#f5d0fe",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 34,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#a855f7",
    borderRadius: 999,
  },

  //------------------------------------------------
  // TITLE
  //------------------------------------------------

  title: {
    color: "#6b21a8",
    fontSize: 42,
    fontWeight: "900",
    marginBottom: 20,

    textShadowColor: "rgba(168,85,247,0.35)",
    textShadowRadius: 14,
  },

  //------------------------------------------------
  // QUESTION
  //------------------------------------------------

  question: {
    color: "#86198f",
    fontSize: 22,
    lineHeight: 34,
    marginBottom: 28,
    fontWeight: "600",
  },

  //------------------------------------------------
  // OPTIONS
  //------------------------------------------------

  optionButton: {
    padding: 22,

    borderRadius: 24,

    marginBottom: 16,

    borderWidth: 1,
    borderColor: "rgba(192,132,252,0.3)",

    shadowColor: "#d946ef",
    shadowOpacity: 0.12,
    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  optionText: {
    color: "#6b21a8",
    fontSize: 17,
    lineHeight: 26,
    fontWeight: "600",
  },

  //------------------------------------------------
  // RESULT CARD
  //------------------------------------------------

  resultCard: {
    marginTop: 24,

    backgroundColor: "rgba(255,255,255,0.75)",

    padding: 24,

    borderRadius: 28,

    borderWidth: 1,
    borderColor: "rgba(192,132,252,0.3)",

    marginBottom: 40,
  },

  resultTitle: {
    color: "#7e22ce",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 14,
  },

  resultText: {
    color: "#86198f",
    fontSize: 17,
    lineHeight: 28,
  },

  //------------------------------------------------
  // NAVIGATION
  //------------------------------------------------

  navigationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: 10,
    marginBottom: 30,
  },

  previousButton: {
    backgroundColor: "#f0abfc",

    paddingVertical: 18,
    paddingHorizontal: 30,

    borderRadius: 999,

    minWidth: 140,
    alignItems: "center",
  },

  nextButton: {
    backgroundColor: "#9333ea",

    paddingVertical: 18,
    paddingHorizontal: 30,

    borderRadius: 999,

    minWidth: 140,
    alignItems: "center",

    shadowColor: "#a855f7",
    shadowOpacity: 0.35,
    shadowRadius: 16,

    shadowOffset: {
      width: 0,
      height: 6,
    },
  },

  navigationText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },

  //------------------------------------------------
  // BACKGROUND GLOWS
  //------------------------------------------------

  glowTop: {
    position: "absolute",

    width: 320,
    height: 320,

    borderRadius: 999,

    backgroundColor: "rgba(192,132,252,0.18)",

    top: -120,
    right: -100,
  },

  glowBottom: {
    position: "absolute",

    width: 260,
    height: 260,

    borderRadius: 999,

    backgroundColor: "rgba(236,72,153,0.16)",

    bottom: -80,
    left: -80,
  },
});
