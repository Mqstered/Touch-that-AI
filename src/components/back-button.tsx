import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  onPress: () => void;
};

export function BackButton({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.text}>Back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 42,
    paddingHorizontal: 16,

    borderRadius: 18,

    backgroundColor: "#ffffff",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#d8b4fe",

    shadowColor: "#9333ea",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.15,
    shadowRadius: 10,

    elevation: 6,
  },

  text: {
    fontSize: 14,
    color: "#7e22ce",
    fontWeight: "800",
  },
});
