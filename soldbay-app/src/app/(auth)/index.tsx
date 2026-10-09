import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useAppRouter as useRouter } from '@/hooks/useAppRouter';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EnvelopeSimple, Lock } from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import { colors } from '../../theme/tokens';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? colors.borderDark : colors.secondaryText;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-bgBase dark:bg-darkBg">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 px-6 justify-center" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
          <View className="mb-10">
            <Text className="text-large-title text-primaryText dark:text-darkText mb-2">Welcome Back</Text>
            <Text className="text-body text-secondaryText dark:text-borderDark">Log in to continue to Soldbay.</Text>
          </View>

          <View className="gap-4 mb-8">
            <Input 
              label="Email Address" 
              placeholder="Enter your email" 
              keyboardType="email-address" 
              autoCapitalize="none" 
              leftIcon={<EnvelopeSimple size={20} color={iconColor} />}
            />
            <Input 
              label="Password" 
              placeholder="Enter your password" 
              isPassword 
              leftIcon={<Lock size={20} color={iconColor} />}
            />
          </View>

          <View className="gap-4">
            <Button label="Log In" onPress={() => router.replace('/(tabs)')} />
            <Button label="Create an Account" variant="secondary" onPress={() => router.push('/(auth)/signup')} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
