// src/app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="alarm">
      <Stack.Screen name="alarm" />
      <Stack.Screen name="step-counter" />
    </Stack>
  );
}
