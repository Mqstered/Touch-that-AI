import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const TYPING_TEXT = 'Learn how to command the future.';

export default function OnboardingScreen() {
  const router = useRouter();

  //------------------------------------------------
  // ANIMATIONS
  //------------------------------------------------

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;

  const cursorOpacity = useRef(new Animated.Value(1)).current;

  //------------------------------------------------
  // STATES
  //------------------------------------------------

  const [hovered, setHovered] = useState(false);
  const [typedText, setTypedText] = useState('');

  //------------------------------------------------
  // TYPING EFFECT
  //------------------------------------------------

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setTypedText(TYPING_TEXT.slice(0, index + 1));
      index++;
      if (index >= TYPING_TEXT.length) clearInterval(interval);
    }, 60);

    return () => clearInterval(interval);
  }, []);

  //------------------------------------------------
  // BLINKING CURSOR
  //------------------------------------------------

  useEffect(() => {
    const cursorLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
    );
    cursorLoop.start();
    return () => cursorLoop.stop();
  }, [cursorOpacity]);

  //------------------------------------------------
  // FLOATING PARTICLES
  //------------------------------------------------

  useEffect(() => {
    const createFloating = (anim: Animated.Value, duration: number) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: -20, duration, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 20, duration, useNativeDriver: true }),
        ]),
      );
      loop.start();
      return loop;
    };

    const l1 = createFloating(particle1, 4000);
    const l2 = createFloating(particle2, 5000);
    const l3 = createFloating(particle3, 6000);

    return () => { l1.stop(); l2.stop(); l3.stop(); };
  }, [particle1, particle2, particle3]);

  //------------------------------------------------
  // BUTTON HOVER
  //------------------------------------------------

  const shakeLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  const startHoverAnimation = () => {
    setHovered(true);
    Animated.spring(scaleAnim, { toValue: 1.5, friction: 4, useNativeDriver: true }).start();
    shakeLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 4, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -4, duration: 40, useNativeDriver: true }),
      ]),
    );
    shakeLoopRef.current.start();
  };

  const stopHoverAnimation = () => {
    setHovered(false);
    shakeLoopRef.current?.stop();
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  //------------------------------------------------
  // UI
  //------------------------------------------------

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3e8ff" />

      <Animated.View
        style={[styles.particleLarge, { top: 120, left: 40, transform: [{ translateY: particle1 }] }]}
      />
      <Animated.View
        style={[styles.particleMedium, { bottom: 150, right: 60, transform: [{ translateY: particle2 }] }]}
      />
      <Animated.View
        style={[styles.particleSmall, { top: 250, right: 120, transform: [{ translateY: particle3 }] }]}
      />

      <Text style={styles.title}>Touch That AI</Text>
      <Text style={styles.subtitle}>Touch it well and it will touch your soul</Text>

      <View style={styles.typingContainer}>
        <Text style={styles.typingText}>{typedText}</Text>
        <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>|</Animated.Text>
      </View>

      <Pressable
        onPress={() => router.push('/explore')}
        onHoverIn={startHoverAnimation}
        onHoverOut={stopHoverAnimation}
        onPressIn={startHoverAnimation}
        onPressOut={stopHoverAnimation}
        style={{ marginTop: 50 }}
      >
        <Animated.View
          style={[
            styles.button,
            hovered && styles.buttonHovered,
            { transform: [{ scale: scaleAnim }, { translateX: shakeAnim }] },
          ]}
        >
          <Text style={[styles.buttonText, hovered && styles.buttonTextHovered]}>
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
    width: '100%',
    height: '100%',
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    overflow: 'hidden',
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#6b21a8',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(107, 33, 168, 0.3)',
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#db2777',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  typingContainer: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
  },
  typingText: {
    fontSize: 18,
    color: '#7e22ce',
    fontWeight: '600',
  },
  cursor: {
    fontSize: 20,
    color: '#7e22ce',
    marginLeft: 2,
  },
  button: {
    backgroundColor: '#9333ea',
    paddingVertical: 18,
    paddingHorizontal: 42,
    borderRadius: 999,
    shadowColor: '#9333ea',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  buttonHovered: {
    backgroundColor: '#c084fc',
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 16,
  },
  buttonText: {
    color: '#fdf4ff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  buttonTextHovered: {
    color: '#ffffff',
  },
  particleLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(192, 132, 252, 0.18)',
  },
  particleMedium: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
  },
  particleSmall: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 999,
    backgroundColor: 'rgba(147, 51, 234, 0.12)',
  },
});
