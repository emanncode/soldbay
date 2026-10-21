import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAppRouter as useRouter } from '@/hooks/useAppRouter';
import { useRole } from '../../context/RoleContext';
import { Button } from '../../components/ui/Button';
import { UploadBox } from '../../components/ui/UploadBox';
import { FilterChip } from '../../components/ui/FilterChip';
import { IconButton } from '../../components/ui/IconButton';
import { CaretLeft } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { helpfulDialog } from '../../lib/dialogs';

export default function VerifySellerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { switchToSeller } = useRole();
  
  const [verificationType, setVerificationType] = useState<'id' | 'portal'>('id');
  
  const [studentIdImage, setStudentIdImage] = useState<{ uri: string } | null>(null);
  const [portalScreenshot, setPortalScreenshot] = useState<{ uri: string } | null>(null);

  const selectedEvidence = verificationType === 'id' ? studentIdImage : portalScreenshot;

  const handleSubmit = () => {
    helpfulDialog(
      'Verification is not connected yet',
      'Your image is selected on this device, but this app build cannot submit it for review yet.'
    );
  };

  const pickImage = async (setter: React.Dispatch<React.SetStateAction<{ uri: string } | null>>) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        setter({ uri: result.assets[0].uri });
      }
    } catch {
      helpfulDialog('Could not open photos', 'Please try selecting your image again.');
    }
  };

  return (
    <View className="flex-1 bg-bgBase dark:bg-darkBg">
      {/* Header */}
      <View 
        className="flex-row items-center px-4 pb-4 border-b border-primaryText/10 dark:border-borderDark/24"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <IconButton icon={CaretLeft} onPress={() => router.back()} accessibilityLabel="Go back" style={{ marginLeft: -4, marginRight: 8 }} />
        <Text className="text-title-2 text-primaryText dark:text-darkText">Verify as Seller</Text>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 40) }}>
        <Text className="text-[15px] font-sora text-secondaryText dark:text-borderDark mt-6 mb-6 leading-relaxed">
          Verify to earn a student badge. You can also continue as an unverified seller and verify later.
        </Text>

        {/* Method Toggle */}
        <View className="flex-row gap-3 mb-8">
          <FilterChip 
            label="Student ID Card" 
            selected={verificationType === 'id'} 
            onPress={() => setVerificationType('id')} 
          />
          <FilterChip 
            label="Portal Screenshot" 
            selected={verificationType === 'portal'} 
            onPress={() => setVerificationType('portal')} 
          />
        </View>

        {/* Upload Areas */}
        {verificationType === 'id' ? (
          <View className="mb-8">
            <UploadBox
              type="id"
              state={studentIdImage ? "filled" : "empty"}
              imageUrl={studentIdImage?.uri}
              label="Student ID (one clear side)"
              onPress={() => pickImage(setStudentIdImage)}
            />
          </View>
        ) : (
          <View className="mb-8">
            <UploadBox
              type="portal"
              state={portalScreenshot ? "filled" : "empty"}
              imageUrl={portalScreenshot?.uri}
              label="Student Portal Screenshot"
              onPress={() => pickImage(setPortalScreenshot)}
            />
            <Text className="text-[12px] font-sora text-secondaryText dark:text-borderDark mt-2 text-center px-4">
              Must clearly show your name, matriculation number, and current session.
            </Text>
          </View>
        )}

        <Button 
          label="Submit Verification" 
          variant="primary" 
          disabled={!selectedEvidence}
          onPress={handleSubmit} 
        />
        <Button
          label="Continue without verification"
          variant="secondary"
          onPress={switchToSeller}
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </View>
  );
}
