import React, { useEffect, useRef } from "react";
import { Text, Animated, View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ErrorBannerProps {
  message: string;
  title?: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, title, onDismiss }: ErrorBannerProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    Animated.spring(anim, {
      toValue: 1,
      tension: 60,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [message, anim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [-10, 0],
              }),
            },
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.96, 1],
              }),
            },
          ],
        },
      ]}
    >
      {/* Glowing Error Icon Badge */}
      <View style={styles.iconCircle}>
        <Ionicons name="alert-circle" size={18} color="#ef4444" />
      </View>

      {/* Message Content */}
      <View style={styles.textContainer}>
        {title ? <Text style={styles.titleText}>{title}</Text> : null}
        <Text style={styles.messageText}>{message}</Text>
      </View>

      {/* Optional Dismiss button */}
      {onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          hitSlop={8}
          style={styles.dismissBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={16} color="rgba(255, 255, 255, 0.5)" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(239, 68, 68, 0.09)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.28)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(239, 68, 68, 0.16)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  titleText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 13,
    color: "#fca5a5",
  },
  messageText: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#ffffff",
    lineHeight: 18,
  },
  dismissBtn: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
});
