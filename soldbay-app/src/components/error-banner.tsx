import React, { useEffect, useRef } from "react";
import { Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    Animated.spring(anim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [message, anim]);

  return (
    <Animated.View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "rgba(220,38,38,0.1)",
        borderWidth: 1,
        borderColor: "rgba(220,38,38,0.3)",
        borderRadius: 12,
        padding: 14,
        opacity: anim,
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [-8, 0],
            }),
          },
          {
            scale: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.96, 1],
            }),
          },
        ],
      }}
    >
      <Ionicons name="alert-circle" size={16} color="#ef4444" />
      <Text
        style={{
          fontFamily: "Inter-Regular",
          fontSize: 13,
          color: "#ef4444",
          flex: 1,
        }}
      >
        {message}
      </Text>
    </Animated.View>
  );
}
