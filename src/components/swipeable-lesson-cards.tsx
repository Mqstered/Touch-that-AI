import React, { useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import type { DbLesson } from '@/types';

interface SwipeableLessonCardsProps {
  lessons: DbLesson[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onLessonEnd?: () => void;
  children: (lesson: DbLesson, index: number) => React.ReactNode;
}

export function SwipeableLessonCards({
  lessons,
  currentIndex,
  onIndexChange,
  onLessonEnd,
  children,
}: SwipeableLessonCardsProps) {
  const theme = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return;

    const newIndex = direction === 'left' 
      ? Math.min(currentIndex + 1, lessons.length - 1)
      : Math.max(currentIndex - 1, 0);

    if (newIndex === currentIndex) return;

    setIsAnimating(true);
    
    // Update index immediately, then animate the content
    onIndexChange(newIndex);
    
    // Check if user reached the end of the lesson
    if (direction === 'left' && newIndex === lessons.length - 1 && onLessonEnd) {
      // Trigger lesson end callback after animation completes
      setTimeout(() => {
        onLessonEnd();
      }, 300);
    }
    
    // Animate from opposite side for smooth transition
    const fromValue = direction === 'left' ? 300 : -300;
    translateX.setValue(fromValue);
    
    // Animate to center
    Animated.timing(translateX, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setIsAnimating(false);
    });
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Only respond to horizontal swipes with minimum distance
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && 
             Math.abs(gestureState.dx) > 10;
    },

    onPanResponderMove: (_, gestureState) => {
      if (isAnimating) return; // Prevent gesture during animation
      
      // Allow horizontal movement with resistance at boundaries
      const isAtStart = currentIndex === 0 && gestureState.dx > 0;
      const isAtEnd = currentIndex === lessons.length - 1 && gestureState.dx < 0;
      
      if (isAtStart || isAtEnd) {
        // Apply resistance at boundaries
        const resistance = 0.3;
        translateX.setValue(gestureState.dx * resistance);
      } else {
        translateX.setValue(gestureState.dx);
      }
    },

    onPanResponderRelease: (_, gestureState) => {
      if (isAnimating) return; // Prevent gesture during animation
      
      const swipeThreshold = 40; // Reduced threshold for more responsive swipes
      const swipeVelocityThreshold = 0.5; // Increased velocity threshold
      const minSwipeDistance = 15; // Minimum distance to consider any swipe
      
      // Calculate absolute values for cleaner logic
      const absDx = Math.abs(gestureState.dx);
      const absVx = Math.abs(gestureState.vx);
      
      // Determine if this is a valid swipe gesture
      const isValidSwipe = absDx > minSwipeDistance;
      const hasStrongVelocity = absVx > swipeVelocityThreshold;
      
      // Determine swipe direction
      const isSwipeLeft = gestureState.dx < 0 && (absDx > swipeThreshold || (hasStrongVelocity && gestureState.dx < -minSwipeDistance));
      const isSwipeRight = gestureState.dx > 0 && (absDx > swipeThreshold || (hasStrongVelocity && gestureState.dx > minSwipeDistance));

      if (isSwipeLeft || isSwipeRight) {
        // Complete the swipe animation
        const direction = isSwipeLeft ? 'left' : 'right';
        handleSwipe(direction);
      } else {
        // Always snap back to center for any non-swipe gesture
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 120, // Slightly higher tension for quicker snap-back
          friction: 7,  // Slightly less friction for faster settling
        }).start();
      }
    },
  });

  if (lessons.length === 0) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ translateX }],
            // Add subtle purple shadow during swipe
            shadowColor: theme.text,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          },
        ]}
        {...panResponder.panHandlers}
      >
        {children(lessons[currentIndex], currentIndex)}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  cardContainer: {
    flex: 1,
  },
});
