import React, { useContext, useRef, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Animated,
  TouchableOpacity,
} from "react-native";
import { PlaytestContext } from "./_layout";

export default function PlaytestLanding() {
  const { prompt, analyzeLive, score, specificity, setPrompt } = useContext(PlaytestContext);
  const router = useRouter();

  const ctaScale = useRef(new Animated.Value(1)).current;
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    setShowTip(prompt.trim().length === 0);
  }, [prompt]);

  const pressIn = () => Animated.spring(ctaScale, { toValue: 0.96, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(ctaScale, { toValue: 1, useNativeDriver: true }).start();

  const examples = [
    "Create a 2-hour study plan for biology with breaks.",
    "Write 5 cozy cafe captions for college students.",
    "Explain global warming simply with 3 examples.",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shape the response</Text>

      <Text style={styles.subtitle}>Train your AI prompting instincts.</Text>

      <TextInput
        placeholder="Type your prompt..."
        placeholderTextColor="#a855f7"
        multiline
        value={prompt}
        onChangeText={analyzeLive}
        style={styles.input}
      />

      {showTip && (
        <View style={styles.tipsRow}>
          <Text style={styles.tipLabel}>Starter prompts:</Text>
          {examples.map((ex) => (
            <TouchableOpacity
              key={ex}
              onPress={() => setPrompt(ex)}
              style={styles.tipChip}
            >
              <Text style={styles.tipText}>{ex}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.analysisCard}>
        <Text style={styles.analysisLabel}>Prompt Clarity: {score}%</Text>
        <Text style={styles.analysisSub}>Specificity: {specificity}</Text>
      </View>

      <Pressable
        onPressIn={pressIn}
        onPressOut={pressOut}
        onPress={() => router.push("/playtest/details")}
        style={({ pressed }) => [styles.cta, pressed && { opacity: 0.95 }]}
      >
        <Animated.View style={{ transform: [{ scale: ctaScale }] }}>
          <Text style={styles.ctaText}>See detailed feedback</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7eefb",
    padding: 24,
    paddingTop: 80,
  },

  title: {
    color: "#6b21a8",
    fontSize: 48,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    color: "#7e22ce",
    fontSize: 18,
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#fdf8ff",
    color: "#581c87",
    padding: 20,
    borderRadius: 20,
    minHeight: 140,
    fontSize: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },

  tipsRow: {
    marginBottom: 18,
  },

  tipLabel: {
    color: "#6b21a8",
    fontWeight: "700",
    marginBottom: 8,
  },

  tipChip: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },

  tipText: {
    color: "#6b21a8",
  },

  analysisCard: {
    backgroundColor: "#fdf8ff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },

  analysisLabel: {
    color: "#7e22ce",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },

  analysisSub: {
    color: "#6b7280",
    fontSize: 16,
  },

  cta: {
    backgroundColor: "#9333ea",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
  },

  ctaText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
});
