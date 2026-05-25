import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

const happyRobot = require("../../assets/animations/happy-robot.json");
const sadRobot = require("../../assets/animations/sad-robot.json");

const { width } = Dimensions.get("window");

const questions = [
  {
    question: "Which prompt gives the BEST AI result?",
    options: [
      "Help me study.",
      "Create a 2-hour biology study plan with breaks and important topics to revise.",
      "Study better.",
      "Tell me something about school.",
    ],
    answer:
      "Create a 2-hour biology study plan with breaks and important topics to revise.",
  },
  {
    question: "Why are detailed prompts better?",
    options: [
      "AI likes long text.",
      "They help the AI understand context clearly.",
      "Because they look cooler.",
      "No reason.",
    ],
    answer: "They help the AI understand context clearly.",
  },
  {
    question: "What improves AI responses most?",
    options: [
      "Being specific.",
      "Using emojis only.",
      "Writing random words.",
      "Short unclear prompts.",
    ],
    answer: "Being specific.",
  },
  {
    question: "What is prompt engineering?",
    options: [
      "Repairing robots.",
      "Designing prompts to guide AI better.",
      "Creating computer chips.",
      "Building websites.",
    ],
    answer: "Designing prompts to guide AI better.",
  },
  {
    question: "What should a good AI prompt include?",
    options: [
      "Context and clarity.",
      "Randomness.",
      "Typos.",
      "Nothing.",
    ],
    answer: "Context and clarity.",
  },
];

export default function QuestionsScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const question = questions[currentQuestion];

  const handleAnswer = (option: string) => {
    const correct = option === question.answer;

    setSelectedAnswer(option);
    setIsCorrect(correct);
    setShowPopup(true);

    if (correct) {
      setShowConfetti(true);
    }
  };

  const nextQuestion = () => {
    setShowPopup(false);
    setSelectedAnswer(null);
    setShowConfetti(false);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <LinearGradient
      colors={["#020617", "#050B1A", "#090014"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Background Glow */}
        <View style={styles.topGlow} />
        <View style={styles.bottomGlow} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1} of {questions.length}
          </Text>

          <View style={styles.energyContainer}>
            <Text style={styles.energyText}>⚡ 12</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarBackground}>
          <LinearGradient
            colors={["#00E5FF", "#8B5CF6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressBarFill,
              {
                width: `${
                  ((currentQuestion + 1) / questions.length) * 100
                }%`,
              },
            ]}
          />
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.question}>
            Which prompt gives the{" "}
            <Text style={{ color: "#00E5FF" }}>BEST</Text> AI result?
          </Text>

          {/* Options */}
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedOption,
                ]}
                onPress={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
              >
                <View style={styles.optionCircle}>
                  <Text style={styles.optionLetter}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>

                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Popup Robot */}
        <Modal transparent visible={showPopup} animationType="fade">
          <View style={styles.popupOverlay}>
            <LinearGradient
              colors={["#0F172A", "#111827"]}
              style={styles.popupCard}
            >
              <View style={styles.popupGlow} />

              {showConfetti && (
                <ConfettiCannon
                  count={80}
                  origin={{ x: width / 2, y: 0 }}
                  fadeOut
                />
              )}

              <LottieView
                source={isCorrect ? happyRobot : sadRobot}
                autoPlay
                loop
                style={styles.robot}
              />

              <Text style={styles.popupTitle}>
                {isCorrect ? "Great Choice!" : "Nice Try"}
              </Text>

              <Text style={styles.popupMessage}>
                {isCorrect
                  ? "Specificity makes AI smarter."
                  : "Not quite. Try adding more specificity and context."}
              </Text>

              <TouchableOpacity onPress={nextQuestion}>
                <LinearGradient
                  colors={["#00E5FF", "#8B5CF6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.nextButton}
                >
                  <Text style={styles.nextButtonText}>
                    {currentQuestion === questions.length - 1
                      ? "Finish"
                      : "Next Question"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  topGlow: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 250,
    height: 250,
    backgroundColor: "rgba(0,229,255,0.15)",
    borderRadius: 200,
  },

  bottomGlow: {
    position: "absolute",
    bottom: -100,
    right: -100,
    width: 250,
    height: 250,
    backgroundColor: "rgba(139,92,246,0.15)",
    borderRadius: 200,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },

  progressText: {
    color: "#C084FC",
    fontSize: 18,
    fontWeight: "700",
  },

  energyContainer: {
    backgroundColor: "rgba(139,92,246,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.3)",
  },

  energyText: {
    color: "#FCD34D",
    fontWeight: "800",
    fontSize: 16,
  },

  progressBarBackground: {
    height: 8,
    backgroundColor: "#111827",
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 20,
    marginTop: 20,
  },

  progressBarFill: {
    height: "100%",
    borderRadius: 20,
  },

  questionContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 50,
  },

  question: {
    color: "white",
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 52,
    marginBottom: 40,
  },

  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(5,15,40,0.9)",
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.18)",
    borderRadius: 24,
    padding: 22,
    marginBottom: 22,
    shadowColor: "#00E5FF",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  selectedOption: {
    borderColor: "#00E5FF",
    backgroundColor: "rgba(0,229,255,0.08)",
    shadowOpacity: 0.35,
  },

  optionCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,229,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  optionLetter: {
    color: "#00E5FF",
    fontWeight: "900",
    fontSize: 18,
  },

  optionText: {
    color: "white",
    fontSize: 22,
    flex: 1,
    lineHeight: 30,
  },

  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  popupCard: {
    width: "50%",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.4)",
    overflow: "hidden",
  },

  popupGlow: {
    position: "absolute",
    width: 300,
    height: 300,
    backgroundColor: "rgba(139,92,246,0.2)",
    borderRadius: 200,
  },

  robot: {
    width: 180,
    height: 180,
  },

  popupTitle: {
    color: "white",
    fontSize: 38,
    fontWeight: "900",
    marginTop: 10,
  },

  popupMessage: {
    color: "#CBD5E1",
    textAlign: "center",
    fontSize: 20,
    marginTop: 15,
    lineHeight: 30,
  },

  nextButton: {
    marginTop: 30,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 20,
  },

  nextButtonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 18,
  },
});