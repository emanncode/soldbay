import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { Platform } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
} from "@expo-google-fonts/manrope";
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          // Manrope only, three weights. Names must match tailwind.config.js
          // `fontFamily` — RN doesn't reliably synthesise weights from one
          // family, so each weight is registered as its own family.
          "Manrope-Regular": Manrope_400Regular,
          "Manrope-Medium": Manrope_500Medium,
          "Manrope-SemiBold": Manrope_600SemiBold,
        });
      } catch (error) {
        if (Platform.OS !== "web") {
          console.warn("Fonts failed to load: ", error);
        }
      } finally {
        setFontsLoaded(true);
        SplashScreen.hideAsync().catch(() => {});
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }


  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="select-role" />
      <Stack.Screen name="forgot-password/index" />
      <Stack.Screen name="forgot-password/enter-code" />
      <Stack.Screen name="forgot-password/new-password" />
      <Stack.Screen name="forgot-password/success" />
      <Stack.Screen name="select-university" />
      <Stack.Screen name="seller/verify" />
      <Stack.Screen name="seller/dashboard" />
      <Stack.Screen name="seller/create-listing" />
      <Stack.Screen name="buyer/home" />
      <Stack.Screen name="buyer/listing-detail" />
    </Stack>
  );
}
