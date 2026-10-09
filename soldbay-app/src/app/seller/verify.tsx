import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAppRouter as useRouter } from '@/hooks/useAppRouter';
import { Button } from '../../components/ui/Button';
import { UploadBox } from '../../components/ui/UploadBox';
import { FilterChip } from '../../components/ui/FilterChip';
import { IconButton } from '../../components/ui/IconButton';
import { CaretLeft } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VerifySellerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [verificationType, setVerificationType] = useState<'id' | 'portal'>('id');
  
  const [idFront, setIdFront] = useState<{ uri: string } | null>(null);
  const [idBack, setIdBack] = useState<{ uri: string } | null>(null);
  const [portalScreenshot, setPortalScreenshot] = useState<{ uri: string } | null>(null);

  const isFormValid = verificationType === 'id' 
    ? (idFront !== null && idBack !== null) 
    : (portalScreenshot !== null);

  const handleSubmit = () => {
    // In a real app, upload the files
    router.back(); // Or navigate to a success confirmation
  };

  const mockPickImage = (setter: React.Dispatch<React.SetStateAction<{ uri: string } | null>>) => {
    // Mock image selection
    setter({ uri: 'https://images.unsplash.com/photo-1588508065123-287b28e015d8?auto=format&fit=crop&q=80&w=400' });
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
          To build trust on Soldbay, all sellers must verify their student status. Choose one method below.
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
          <View className="gap-6 mb-8">
            <UploadBox
              type="id"
              state={idFront ? "filled" : "empty"}
              imageUrl={idFront?.uri}
              label="Front of Student ID"
              onPress={() => mockPickImage(setIdFront)}
            />
            <UploadBox
              type="id"
              state={idBack ? "filled" : "empty"}
              imageUrl={idBack?.uri}
              label="Back of Student ID"
              onPress={() => mockPickImage(setIdBack)}
            />
          </View>
        ) : (
          <View className="mb-8">
            <UploadBox
              type="portal"
              state={portalScreenshot ? "filled" : "empty"}
              imageUrl={portalScreenshot?.uri}
              label="Student Portal Screenshot"
              onPress={() => mockPickImage(setPortalScreenshot)}
            />
            <Text className="text-[12px] font-sora text-secondaryText dark:text-borderDark mt-2 text-center px-4">
              Must clearly show your name, matriculation number, and current session.
            </Text>
          </View>
        )}

        <Button 
          label="Submit Verification" 
          variant="primary" 
          disabled={!isFormValid} 
          onPress={handleSubmit} 
        />
      </ScrollView>
    </View>
  );
}
