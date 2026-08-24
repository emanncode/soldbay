import React, { useEffect, useRef } from "react";
import { Animated, View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface ToastBannerProps {
  message: string | null;
  type?: "error" | "success" | "info";
  durationMs?: number;
  onDismiss?: () => void;
}

export function ToastBanner({
  message,
  type = "info",
  durationMs = 3000,
  onDismiss,
}: ToastBannerProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!message) return;

    opacity.setValue(0);
    translateY.setValue(20);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 20,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onDismiss?.();
      });
    }, durationMs);

    return () => clearTimeout(timer);
  }, [message, durationMs, opacity, translateY, onDismiss]);

  if (!message) return null;

  const iconName =
    type === "error"
      ? "alert-circle"
      : type === "success"
        ? "checkmark-circle"
        : "information-circle";

  const iconColor =
    type === "error"
      ? "#ef4444"
      : type === "success"
        ? "#22c55e"
        : "#38bdf8";

  const borderColor =
    type === "error"
      ? "rgba(239, 68, 68, 0.3)"
      : type === "success"
        ? "rgba(34, 197, 94, 0.3)"
        : "rgba(56, 189, 248, 0.3)";

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onDismiss}
        style={styles.contentRow}
      >
        <Ionicons name={iconName} size={18} color={iconColor} />
        <Text style={styles.messageText}>{message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 36,
    alignSelf: "center",
    maxWidth: "90%",
    backgroundColor: "rgba(24, 24, 27, 0.95)",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    zIndex: 9999,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.4)",
      },
    }),
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  messageText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#ffffff",
  },
});
