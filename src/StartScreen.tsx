import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const typingText = "Learn how to command the future.";

export default function StartScreen() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;

  const cursorOpacity = useRef(new Animated.Value(1)).current;

  const [hovered, setHovered] = useState(false);
  const [typedText, setTypedText] = useState("");

  //------------------------------------------------
  // TYPING EFFECT
  //------------------------------------------------
  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setTypedText(typingText.slice(0, index + 1));
      index++;

      if (index >= typingText.length) {
        clearInterval(interval);
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  //------------------------------------------------
  // BLINKING CURSOR
  //------------------------------------------------
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  //------------------------------------------------
  // FLOATING PARTICLES
  //------------------------------------------------
  useEffect(() => {
    const createFloatingAnimation = (
      anim: Animated.Value,
      duration: number,
    ) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -20,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 20,
            duration,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    createFloatingAnimation(particle1, 4000);
    createFloatingAnimation(particle2, 5000);
    createFloatingAnimation(particle3, 6000);
  }, []);

  //------------------------------------------------
  // BUTTON HOVER
  //------------------------------------------------
  const startHoverAnimation = () => {
    setHovered(true);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1.5,
        friction: 4,
        useNativeDriver: true,
      }),

      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 4,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -4,
            duration: 40,
            useNativeDriver: true,
          }),
        ]),
      ),
    ]).start();
  };

  const stopHoverAnimation = () => {
    setHovered(false);

    shakeAnim.stopAnimation();

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),

      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3e8ff" />

      {/* BACKGROUND PARTICLES */}

      <Animated.View
        style={[
          styles.particleLarge,
          {
            top: 120,
            left: 40,
            transform: [{ translateY: particle1 }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.particleMedium,
          {
            bottom: 150,
            right: 60,
            transform: [{ translateY: particle2 }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.particleSmall,
          {
            top: 250,
            right: 120,
            transform: [{ translateY: particle3 }],
          },
        ]}
      />

      {/* MAIN CONTENT */}

      <Text style={styles.title}>Touch That AI</Text>

      <Text style={styles.subtitle}>
        Touch it well and it will touch your soul
      </Text>

      {/* TYPING TEXT */}

      <View style={styles.typingContainer}>
        <Text style={styles.typingText}>{typedText}</Text>

        <Animated.Text
          style={[
            styles.cursor,
            {
              opacity: cursorOpacity,
            },
          ]}
        >
          |
        </Animated.Text>
      </View>

      {/* BUTTON */}

      <Pressable
        onHoverIn={startHoverAnimation}
        onHoverOut={stopHoverAnimation}
        style={{ marginTop: 50 }}
      >
        <Animated.View
          style={[
            styles.button,
            hovered && styles.buttonHovered,
            {
              transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
            },
          ]}
        >
          <Text
            style={[styles.buttonText, hovered && styles.buttonTextHovered]}
          >
            Ready to Touch
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3e8ff",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    overflow: "hidden",
  },

  //------------------------------------------------
  // TITLE
  //------------------------------------------------

  title: {
    fontSize: 48,
    fontWeight: "700",
    color: "#6b21a8",
    textAlign: "center",
    marginBottom: 16,
    textShadowColor: "rgba(107, 33, 168, 0.3)",
    textShadowRadius: 10,
  },

  subtitle: {
    fontSize: 18,
    color: "#db2777",
    textAlign: "center",
    paddingHorizontal: 16,
  },

  //------------------------------------------------
  // TYPING
  //------------------------------------------------

  typingContainer: {
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
  },

  typingText: {
    fontSize: 18,
    color: "#7e22ce",
    fontWeight: "600",
  },

  cursor: {
    fontSize: 20,
    color: "#7e22ce",
    marginLeft: 2,
  },

  //------------------------------------------------
  // BUTTON
  //------------------------------------------------

  button: {
    backgroundColor: "#9333ea",
    paddingVertical: 18,
    paddingHorizontal: 42,
    borderRadius: 999,

    shadowColor: "#9333ea",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  buttonHovered: {
    backgroundColor: "#c084fc",
    shadowOpacity: 0.8,
    shadowRadius: 25,
  },

  buttonText: {
    color: "#fdf4ff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 1,
  },

  buttonTextHovered: {
    color: "#ffffff",
  },

  //------------------------------------------------
  // PARTICLES
  //------------------------------------------------

  particleLarge: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(192, 132, 252, 0.18)",
  },

  particleMedium: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: "rgba(236, 72, 153, 0.15)",
  },

  particleSmall: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 999,
    backgroundColor: "rgba(147, 51, 234, 0.12)",
  },
});
