import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
};

export function PrimaryButton({ title, onPress, style }: Props) {
  const isPrevious = title === "Previous";

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        isPrevious ? styles.previousButton : styles.nextButton,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          isPrevious ? styles.previousText : styles.nextText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  //------------------------------------------------
  // BASE
  //------------------------------------------------

  button: {
    height: 62,
    borderRadius: 22,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 24,

    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.2,
    shadowRadius: 12,

    elevation: 8,
  },

  //------------------------------------------------
  // NEXT BUTTON
  //------------------------------------------------

  nextButton: {
    backgroundColor: "#9333ea",

    borderWidth: 1,
    borderColor: "#c084fc",

    shadowColor: "#9333ea",
  },

  nextText: {
    color: "#ffffff",
  },

  //------------------------------------------------
  // PREVIOUS BUTTON
  //------------------------------------------------

  previousButton: {
    backgroundColor: "#f3e8ff",

    borderWidth: 1,
    borderColor: "#d8b4fe",

    shadowColor: "#c084fc",
  },

  previousText: {
    color: "#6b21a8",
  },

  //------------------------------------------------
  // TEXT
  //------------------------------------------------

  text: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
