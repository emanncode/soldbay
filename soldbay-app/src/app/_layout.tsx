import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from "@expo-google-fonts/bricolage-grotesque";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { Satisfy_400Regular } from "@expo-google-fonts/satisfy";
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "BricolageGrotesque-Medium": BricolageGrotesque_500Medium,
          "BricolageGrotesque-SemiBold": BricolageGrotesque_600SemiBold,
          "BricolageGrotesque-Bold": BricolageGrotesque_700Bold,
          "BricolageGrotesque-ExtraBold": BricolageGrotesque_800ExtraBold,
          "Inter-Regular": Inter_400Regular,
          "Inter-Medium": Inter_500Medium,
          "Inter-SemiBold": Inter_600SemiBold,
          "Satisfy-Regular": Satisfy_400Regular,
        });
      } catch (error) {
        console.warn("Fonts failed to load: ", error);
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
