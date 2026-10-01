import React from 'react';
import { View, Text, Modal as RNModal, TouchableWithoutFeedback, StyleProp, ViewStyle } from 'react-native';

export interface ModalProps {
  visible: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  actions: React.ReactNode;
  children?: React.ReactNode;
}

export function Modal({
  visible,
  title,
  description,
  onClose,
  actions,
  children,
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-primaryText/40 dark:bg-darkBg/80 justify-center items-center px-4">
          <TouchableWithoutFeedback>
            <View className="w-full max-w-[320px] bg-bgBase dark:bg-darkBgStep rounded-[16px] overflow-hidden">
              <View className="p-6">
                <Text className="text-[17px] font-sora-bold text-primaryText dark:text-darkText text-center mb-2">
                  {title}
                </Text>
                {description && (
                  <Text className="text-[15px] font-sora text-secondaryText dark:text-borderDark text-center mb-6">
                    {description}
                  </Text>
                )}
                
                {children && (
                  <View className="mb-6">
                    {children}
                  </View>
                )}
                
                <View className="gap-3">
                  {actions}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}
