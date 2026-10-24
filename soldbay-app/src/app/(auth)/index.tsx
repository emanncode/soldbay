import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useAppRouter as useRouter } from '@/hooks/useAppRouter';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EnvelopeSimple, Lock } from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import { colors } from '../../theme/tokens';
import { useAuth } from '../../context/AuthContext';
import { helpfulDialog } from '../../lib/dialogs';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? colors.borderDark : colors.secondaryText;
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      helpfulDialog('Missing details', 'Enter your email address and password to continue.');
      return;
    }
    setIsSubmitting(true);
    try {
      await signIn({ email: email.trim(), password });
      router.replace('/(tabs)');
    } catch (error) {
      helpfulDialog('Could not log in', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address" 
              autoCapitalize="none" 
              leftIcon={<EnvelopeSimple size={20} color={iconColor} />}
            />
            <Input 
              label="Password" 
              placeholder="Enter your password" 
              value={password}
              onChangeText={setPassword}
              isPassword 
              leftIcon={<Lock size={20} color={iconColor} />}
            />
          </View>

          <View className="gap-4">
            <Button label={isSubmitting ? "Logging in..." : "Log In"} disabled={isSubmitting} onPress={handleSignIn} />
            <Button label="Create an Account" variant="secondary" onPress={() => router.push('/(auth)/signup')} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
