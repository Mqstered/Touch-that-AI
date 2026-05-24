import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ModuleDetailScreen() {
  const router = useRouter();

  const { moduleId } = useLocalSearchParams();

  //------------------------------------------------
  // FAKE MODULE DATA
  //------------------------------------------------

  const modules = [
    {
      id: "prompting",
      title: "Prompt Engineering",
      subtitle: "Learn how to control AI responses effectively.",
      mastery: 68,
      progress: 68,
      description:
        "Understand how wording, structure, context, and constraints dramatically change AI outputs. Learn how professionals communicate with AI systems.",
      updatedAt: "2 hours ago",
      focus:
        "Practice building prompts with goals, tone, constraints, and examples.",
    },

    {
      id: "research",
      title: "AI Research Skills",
      subtitle: "Use AI for faster and smarter research.",
      mastery: 42,
      progress: 42,
      description:
        "Learn how to summarize articles, verify information, organize knowledge, and avoid misinformation while researching with AI.",
      updatedAt: "Yesterday",
      focus: "Practice verifying AI answers and requesting reliable sources.",
    },

    {
      id: "creativity",
      title: "Creative AI",
      subtitle: "Generate ideas, stories, and content.",
      mastery: 84,
      progress: 84,
      description:
        "Use AI to brainstorm ideas, write content, improve creativity, and accelerate content production.",
      updatedAt: "3 days ago",
      focus:
        "Experiment with tone, style, audience targeting, and creative direction.",
    },
  ];

  const module = modules.find((item) => item.id === moduleId);

  //------------------------------------------------
  // MODULE NOT FOUND
  //------------------------------------------------

  if (!module) {
    return (
      <View style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>Module not found</Text>

          <Pressable
            style={styles.backHomeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backHomeButtonText}>Return To Explore</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  //------------------------------------------------
  // MAIN SCREEN
  //------------------------------------------------

  return (
    <View style={styles.container}>
      {/* BACKGROUND GLOWS */}

      <View style={styles.glowPink} />
      <View style={styles.glowPurple} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO */}

        <View style={styles.hero}>
          <Text style={styles.title}>{module.title}</Text>

          <Text style={styles.subtitle}>{module.subtitle}</Text>
        </View>

        {/* MAIN CARD */}

        <View style={styles.card}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Mastery</Text>

            <Text style={styles.metricValue}>{module.mastery}%</Text>
          </View>

          {/* CUSTOM PROGRESS BAR */}

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${module.progress}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.bodyText}>{module.description}</Text>

          <Text style={styles.updateText}>Last update: {module.updatedAt}</Text>
        </View>

        {/* PRACTICE CARD */}

        <View style={styles.card}>
          <Text style={styles.practiceHeading}>AI Practice Mission</Text>

          <Text style={styles.bodyText}>{module.focus}</Text>

          <Pressable style={styles.reviewButton}>
            <Text style={styles.reviewButtonText}>Review This Module</Text>
          </Pressable>
        </View>

        {/* QUESTIONS BUTTON */}

        <Pressable
          onPress={() => router.push("/questions")}
          style={styles.questionsButton}
        >
          <Text style={styles.questionsButtonText}>Questions Next</Text>

          <Text style={styles.questionsButtonSubtext}>
            Continue your AI journey →
          </Text>
        </Pressable>

        {/* BACK BUTTON */}

        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Back to Explore</Text>
        </Pressable>
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
    paddingBottom: 140,
  },

  //------------------------------------------------
  // HERO
  //------------------------------------------------

  hero: {
    marginTop: 60,
    marginBottom: 40,
  },

  title: {
    fontSize: 48,
    fontWeight: "900",

    color: "#6b21a8",

    marginBottom: 16,

    textShadowColor: "rgba(168,85,247,0.35)",
    textShadowRadius: 18,
  },

  subtitle: {
    fontSize: 20,
    lineHeight: 34,

    color: "#db2777",
  },

  //------------------------------------------------
  // CARDS
  //------------------------------------------------

  card: {
    backgroundColor: "rgba(255,255,255,0.72)",

    borderWidth: 1,
    borderColor: "rgba(192,132,252,0.3)",

    borderRadius: 32,

    padding: 24,

    marginBottom: 26,

    shadowColor: "#c084fc",
    shadowOpacity: 0.22,
    shadowRadius: 18,

    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 10,
  },

  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  metricLabel: {
    color: "#a21caf",
    fontWeight: "700",
    fontSize: 16,
  },

  metricValue: {
    color: "#7e22ce",
    fontWeight: "800",
    fontSize: 18,
  },

  //------------------------------------------------
  // PROGRESS BAR
  //------------------------------------------------

  progressBackground: {
    height: 18,
    backgroundColor: "#f5d0fe",
    borderRadius: 999,
    overflow: "hidden",
    marginVertical: 20,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#a855f7",
    borderRadius: 999,
  },

  //------------------------------------------------
  // TEXT
  //------------------------------------------------

  bodyText: {
    color: "#86198f",

    fontSize: 16,

    lineHeight: 24,

    marginBottom: 12,
  },

  updateText: {
    color: "#db2777",
    fontSize: 14,
  },

  practiceHeading: {
    color: "#7e22ce",

    fontSize: 22,

    fontWeight: "800",

    marginBottom: 16,
  },

  //------------------------------------------------
  // REVIEW BUTTON
  //------------------------------------------------

  reviewButton: {
    backgroundColor: "#c026d3",

    marginTop: 10,

    paddingVertical: 18,

    borderRadius: 999,

    alignItems: "center",

    shadowColor: "#e879f9",
    shadowOpacity: 0.45,
    shadowRadius: 18,

    shadowOffset: {
      width: 0,
      height: 6,
    },
  },

  reviewButtonText: {
    color: "white",

    fontWeight: "800",

    fontSize: 18,
  },

  //------------------------------------------------
  // QUESTIONS BUTTON
  //------------------------------------------------

  questionsButton: {
    width: "100%",

    backgroundColor: "#9333ea",

    paddingVertical: 34,

    borderRadius: 38,

    alignItems: "center",

    marginTop: 20,

    shadowColor: "#a855f7",
    shadowOpacity: 0.55,
    shadowRadius: 24,

    shadowOffset: {
      width: 0,
      height: 10,
    },

    elevation: 18,
  },

  questionsButtonText: {
    color: "white",

    fontSize: 32,

    fontWeight: "900",

    letterSpacing: 1,
  },

  questionsButtonSubtext: {
    color: "#f5d0fe",

    marginTop: 10,

    fontSize: 16,

    fontWeight: "600",
  },

  //------------------------------------------------
  // BACK BUTTON
  //------------------------------------------------

  backButton: {
    marginTop: 24,

    alignSelf: "center",

    backgroundColor: "rgba(236,72,153,0.15)",

    paddingVertical: 14,
    paddingHorizontal: 24,

    borderRadius: 999,
  },

  backText: {
    color: "#db2777",

    fontSize: 16,

    fontWeight: "700",
  },

  //------------------------------------------------
  // NOT FOUND
  //------------------------------------------------

  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  notFoundTitle: {
    color: "#7e22ce",

    fontSize: 38,

    fontWeight: "900",

    marginBottom: 24,
  },

  backHomeButton: {
    backgroundColor: "#9333ea",

    paddingVertical: 18,
    paddingHorizontal: 34,

    borderRadius: 999,
  },

  backHomeButtonText: {
    color: "white",

    fontWeight: "800",

    fontSize: 18,
  },

  //------------------------------------------------
  // GLOW BACKGROUNDS
  //------------------------------------------------

  glowPink: {
    position: "absolute",

    width: 320,
    height: 320,

    borderRadius: 999,

    backgroundColor: "rgba(236,72,153,0.16)",

    top: -100,
    right: -120,
  },

  glowPurple: {
    position: "absolute",

    width: 280,
    height: 280,

    borderRadius: 999,

    backgroundColor: "rgba(168,85,247,0.18)",

    bottom: -80,
    left: -120,
  },
});
