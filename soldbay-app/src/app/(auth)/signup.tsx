import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useAppRouter as useRouter } from '@/hooks/useAppRouter';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CampusPicker } from '../../components/ui/CampusPicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, CaretDown } from 'phosphor-react-native';
import { IconButton } from '../../components/ui/IconButton';
import { colors } from '../../theme/tokens';
import { useColorScheme } from 'nativewind';

const MOCK_CAMPUSES = [
  'University of Lagos (UNILAG)',
  'Obafemi Awolowo University (OAU)',
  'University of Ibadan (UI)',
  'Ahmadu Bello University (ABU)',
  'University of Nigeria Nsukka (UNN)'
];

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [campusPickerVisible, setCampusPickerVisible] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<string>('');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-bgBase dark:bg-darkBg">
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="px-4 pb-2 bg-bgBase dark:bg-darkBg z-10 flex-row items-center">
        <IconButton icon={CaretLeft} onPress={() => router.back()} accessibilityLabel="Go back" style={{ marginLeft: -4 }} />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 40) }}>
          <View className="mb-8 mt-2">
            <Text className="text-large-title text-primaryText dark:text-darkText mb-2">Sign Up</Text>
            <Text className="text-body text-secondaryText dark:text-borderDark">Create your buyer account first.</Text>
          </View>

          <View className="gap-4 mb-6">
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Input label="First Name" placeholder="e.g. John" />
              </View>
              <View className="flex-1">
                <Input label="Surname" placeholder="e.g. Doe" />
              </View>
            </View>
            <Input label="Matric Number" placeholder="Enter your matric number" />
            <Input label="Email" placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" />
            <Input label="Phone (Optional)" placeholder="e.g. 08012345678" keyboardType="phone-pad" />
            
            <View>
              <Text className="text-[13px] font-sora-bold text-primaryText dark:text-darkText mb-2">Campus</Text>
              <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={() => setCampusPickerVisible(true)}
                className="min-h-[50px] bg-primaryText/5 dark:bg-darkBgStep rounded-lg px-4 flex-row items-center justify-between"
              >
                <Text className={`text-[15px] font-sora ${selectedCampus ? 'text-primaryText dark:text-darkText' : 'text-secondaryText'}`}>
                  {selectedCampus || 'Select your campus...'}
                </Text>
                <CaretDown size={20} color={isDark ? colors.borderDark : colors.secondaryText} />
              </TouchableOpacity>
            </View>

            <Input label="Password" placeholder="Create a strong password" secureTextEntry />
          </View>

          <Button label="Create Account" onPress={() => router.replace('/(tabs)')} />
        </ScrollView>
      </TouchableWithoutFeedback>

      <CampusPicker
        visible={campusPickerVisible}
        onClose={() => setCampusPickerVisible(false)}
        onSelect={setSelectedCampus}
        campuses={MOCK_CAMPUSES}
      />
    </KeyboardAvoidingView>
  );
}
