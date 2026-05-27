import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";

import { ThemedView } from "@/components/themed-view";
import { UserMenu } from "@/components/user-menu";
import { MaxContentWidth, Spacing } from "@/constants/theme";

export function ScreenShell({ style, ...props }: ViewProps) {
  return (
    // We combine the base container style, any incoming custom styles,
    // and your other props here seamlessly.
    <ThemedView style={[styles.container, style]} {...props}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.menuRow}>
          <UserMenu />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          {props.children}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1eaff",
  },
  safeArea: {
    flex: 1,
  },
  menuRow: {
    position: "absolute",
    top: Spacing.four,
    right: Spacing.four,
    zIndex: 100,
  },
  content: {
    padding: Spacing.four,
    paddingTop: Spacing.six,
    alignItems: "flex-start",
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
  },
});
