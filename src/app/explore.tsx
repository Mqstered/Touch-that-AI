import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* BACKGROUND GLOWS */}

      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* HERO */}

      <View style={styles.hero}>
        <Text style={styles.title}>Command Intelligence</Text>

        <Text style={styles.subtitle}>
          Learn how to control AI with smarter prompts, creativity, and real
          world workflows.
        </Text>
      </View>

      {/* CARD 1 */}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>AI Skill Progress</Text>

        <Text style={styles.cardText}>
          Every mission improves your ability to communicate with AI more
          effectively.
        </Text>

        <View style={styles.progressBackground}>
          <View style={styles.progressFill} />
        </View>

        <Text style={styles.progressText}>33% AI Mastery</Text>
      </View>

      {/* CARD 2 */}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Prompt Playground</Text>

        <Text style={styles.cardText}>
          Experiment with prompts and learn how small changes create completely
          different AI responses.
        </Text>

        <View style={styles.fakeInput}>
          <Text style={styles.fakeInputText}>
            Explain why prompt structure matters...
          </Text>
        </View>

        <View style={styles.responseBox}>
          <Text style={styles.responseTitle}>AI Response</Text>

          <Text style={styles.responseText}>
            Strong prompts give AI clearer instructions, context, formatting,
            and goals — resulting in smarter and more accurate answers.
          </Text>
        </View>
      </View>

      {/* QUESTIONS BUTTON */}

      <Pressable
        style={styles.questionsButton}
        onPress={() => router.push("/questions")}
      >
        <Text style={styles.questionsButtonText}>Questions Next</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  //------------------------------------------------
  // CONTAINER
  //------------------------------------------------

  container: {
    flexGrow: 1,
    backgroundColor: "#f3e8ff",
    padding: 24,
    alignItems: "center",
    paddingBottom: 120,
  },

  //------------------------------------------------
  // HERO
  //------------------------------------------------

  hero: {
    width: "100%",
    maxWidth: 900,
    marginTop: 60,
    marginBottom: 40,
  },

  title: {
    fontSize: 54,
    fontWeight: "800",
    color: "#6b21a8",
    marginBottom: 18,

    textShadowColor: "rgba(168,85,247,0.35)",
    textShadowRadius: 18,
  },

  subtitle: {
    fontSize: 22,
    lineHeight: 34,
    color: "#db2777",
    maxWidth: 700,
  },

  //------------------------------------------------
  // CARDS
  //------------------------------------------------

  card: {
    width: "100%",
    maxWidth: 900,

    backgroundColor: "rgba(255,255,255,0.72)",

    borderRadius: 30,

    padding: 28,

    marginBottom: 30,

    borderWidth: 1,
    borderColor: "rgba(192,132,252,0.3)",

    shadowColor: "#c084fc",
    shadowOpacity: 0.25,
    shadowRadius: 24,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 12,
  },

  cardTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#7e22ce",
    marginBottom: 16,
  },

  cardText: {
    fontSize: 18,
    lineHeight: 28,
    color: "#a21caf",
    marginBottom: 22,
  },

  //------------------------------------------------
  // PROGRESS
  //------------------------------------------------

  progressBackground: {
    height: 18,
    backgroundColor: "#e9d5ff",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 14,
  },

  progressFill: {
    width: "33%",
    height: "100%",
    backgroundColor: "#a855f7",
    borderRadius: 999,
  },

  progressText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7e22ce",
  },

  //------------------------------------------------
  // PLAYGROUND
  //------------------------------------------------

  fakeInput: {
    backgroundColor: "#faf5ff",

    borderWidth: 1,
    borderColor: "#d8b4fe",

    borderRadius: 20,

    padding: 22,

    marginBottom: 22,
  },

  fakeInputText: {
    fontSize: 18,
    color: "#9333ea",
  },

  responseBox: {
    backgroundColor: "rgba(192,132,252,0.18)",

    borderRadius: 22,

    padding: 22,
  },

  responseTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7e22ce",
    marginBottom: 12,
  },

  responseText: {
    fontSize: 17,
    lineHeight: 28,
    color: "#6b21a8",
    fontWeight: "600",
  },

  //------------------------------------------------
  // QUESTIONS BUTTON
  //------------------------------------------------

  questionsButton: {
    marginTop: 20,

    backgroundColor: "#9333ea",

    paddingVertical: 24,
    paddingHorizontal: 60,

    borderRadius: 999,

    shadowColor: "#9333ea",
    shadowOpacity: 0.45,
    shadowRadius: 24,

    shadowOffset: {
      width: 0,
      height: 10,
    },

    elevation: 12,
  },

  questionsButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1,
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

    bottom: 80,
    left: -80,
  },
});
