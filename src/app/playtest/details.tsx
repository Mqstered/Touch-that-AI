import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { PlaytestContext } from "./_layout";

export default function PlaytestDetails() {
  const {
    prompt,
    analyzePrompt,
    thinking,
    feedback,
    improvedPrompt,
  } = useContext(PlaytestContext);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 24, paddingTop: 80, paddingBottom: 80 }}
    >
      <Text style={styles.title}>Detailed Feedback</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Your Prompt</Text>
        <Text style={styles.promptText}>{prompt || "(empty)"}</Text>
      </View>

      <TouchableOpacity onPress={analyzePrompt} style={styles.button}>
        <Text style={styles.buttonText}>Analyze Prompt</Text>
      </TouchableOpacity>

      {thinking && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>AI THINKING...</Text>
          <Text style={styles.bodyText}>Analyzing intent...\nEvaluating clarity...\nOptimizing structure...</Text>
        </View>
      )}

      {feedback !== "" && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>AI FEEDBACK</Text>
          <Text style={styles.bodyText}>{feedback}</Text>
        </View>
      )}

      {improvedPrompt !== "" && (
        <View style={[styles.card, styles.highlightCard]}>
          <Text style={styles.sectionTitle}>PROMPT UPGRADED</Text>
          <Text style={styles.bodyText}>{improvedPrompt}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7eefb" },

  title: {
    color: "#6b21a8",
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 12,
    paddingHorizontal: 24,
  },

  card: {
    backgroundColor: "#fdf8ff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#e9d5ff",
    marginHorizontal: 0,
  },

  highlightCard: {
    borderColor: "#9333ea",
  },

  sectionTitle: {
    color: "#9333ea",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  promptText: {
    color: "#581c87",
    fontSize: 18,
    lineHeight: 26,
  },

  bodyText: {
    color: "#581c87",
    fontSize: 18,
    lineHeight: 28,
  },

  button: {
    backgroundColor: "#9333ea",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 18,
  },

  buttonText: { color: "white", fontSize: 18, fontWeight: "700" },
});
