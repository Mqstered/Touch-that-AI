import React, { useContext } from "react";
import { Link } from "expo-router";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { PlaytestContext } from "./_layout";

export default function PlaytestLanding() {
  const { prompt, analyzeLive, score, specificity } = useContext(PlaytestContext);

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

      <View style={styles.analysisCard}>
        <Text style={styles.analysisLabel}>Prompt Clarity: {score}%</Text>
        <Text style={styles.analysisSub}>Specificity: {specificity}</Text>
      </View>

      <Link href="/playtest/details" style={styles.cta}>
        <Text style={styles.ctaText}>See detailed feedback</Text>
      </Link>
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
