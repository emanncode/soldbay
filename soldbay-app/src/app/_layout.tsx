import { Stack, ThemeProvider, DefaultTheme, DarkTheme } from 'expo-router';
import { useFonts, Sora_400Regular, Sora_600SemiBold, Sora_700Bold } from '@expo-google-fonts/sora';
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import './global.css';
import { useColorScheme } from 'react-native';
import { colors } from '../theme/tokens';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
    Fraunces_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Set the root system background color to prevent a white flash during swipe-back on Android
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colorScheme === 'dark' ? colors.darkBg : colors.bgBase);
  }, [colorScheme]);

  if (!fontsLoaded) {
    return null;
  }
  
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.darkBg,
      card: colors.darkBgStep,
      text: colors.darkText,
      border: colors.borderDark,
    },
  };

  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.bgBase,
      card: colors.bgBase,
      text: colors.primaryText,
      border: colors.borderLight,
    },
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? customDarkTheme : customLightTheme}>
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: colorScheme === 'dark' ? colors.darkBg : colors.bgBase } }}>
      <Stack.Screen name="(tabs)" options={{ animation: 'slide_from_right' }} />
    </Stack>
    </ThemeProvider>
  );
}
