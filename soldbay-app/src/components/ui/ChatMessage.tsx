import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface ChatMessageProps {
  message: string;
  isSent: boolean;
  readAt?: string;
}

export function ChatMessage({ message, isSent, readAt }: ChatMessageProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Sent: peach in light mode (bgCard), teal in dark mode (borderLightSolid)
  // Received: light gray in light mode (primaryText/5), darkBgStep in dark mode
  const bubbleClass = isSent
    ? 'bg-bgCard dark:bg-borderLightSolid ml-auto rounded-tr-[16px] rounded-tl-[16px] rounded-bl-[16px] rounded-br-[4px]'
    : 'bg-primaryText/5 dark:bg-darkBgStep mr-auto rounded-tr-[16px] rounded-tl-[16px] rounded-bl-[4px] rounded-br-[16px]';

  return (
    <View className={`w-full mb-2 ${isSent ? 'items-end' : 'items-start'}`}>
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={() => setShowTooltip(true)}
        onPressOut={() => setShowTooltip(false)}
        className={`max-w-[80%] px-3 py-3 relative ${bubbleClass}`}
      >
        <Text className="font-sora text-[15px] text-primaryText dark:text-darkText">
          {message}
        </Text>
        
        {isSent && showTooltip && readAt && (
          <View className="absolute -bottom-7 right-0 bg-primaryText dark:bg-white px-2 py-1 rounded-sm z-10 shadow-sm">
            <Text className="font-sora text-[11px] text-white dark:text-primaryText">
              Read at {readAt}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
