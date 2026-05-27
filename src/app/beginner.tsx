import { Text, TouchableOpacity, View } from "react-native";

export default function BeginnerScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000000",
        padding: 24,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Beginner AI Missions
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#1e1e1e",
          padding: 20,
          borderRadius: 20,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "600",
          }}
        >
          Prompt Basics
        </Text>

        <Text
          style={{
            color: "#aaa",
            marginTop: 8,
          }}
        >
          Learn how to give AI clearer instructions.
        </Text>
      </TouchableOpacity>
    </View>
  );
}
