import React from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";

export default function StartScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3e8ff" />
      <Text style={styles.title}>Touch That AI</Text>
      <Text style={styles.subtitle}>
        Touch it well and it will touch your soul
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3e8ff", // light purple
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: "700",
    color: "#6b21a8", // deep purple
    textAlign: "center",
    marginBottom: 16, // Fixed typo from 'manginBobtom'
  },
  subtitle: {
    fontSize: 18,
    color: "#db2777", // pink
    textAlign: "center",
    paddingHorizontal: 16,
  },
});
