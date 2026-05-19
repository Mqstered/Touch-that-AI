import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function StartScreen() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const [hovered, setHovered] = useState(false);

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

      <Text style={styles.title}>Touch That AI</Text>

      <Text style={styles.subtitle}>
        Touch it well and it will touch your soul
      </Text>

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
  },

  title: {
    fontSize: 48,
    fontWeight: "700",
    color: "#6b21a8",
    textAlign: "center",
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 18,
    color: "#db2777",
    textAlign: "center",
    paddingHorizontal: 16,
  },

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
});
