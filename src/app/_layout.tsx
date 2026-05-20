import { LearningProvider } from "@/context/learning-context";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <LearningProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </LearningProvider>
  );
}
