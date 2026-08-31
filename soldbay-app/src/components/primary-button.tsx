import React, { useState } from "react";
import {
  TouchableWithoutFeedback,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface PrimaryButtonProps {
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  label: string;
}

export function PrimaryButton({
  onPress,
  loading,
  disabled,
  label,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;
  const [scaleAnim] = useState(() => new Animated.Value(1));

  const handlePressIn = () => {
    if (isDisabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (isDisabled) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
    >
      <Animated.View
        style={[
          styles.btnContainer,
          isDisabled && styles.btnDisabled,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <LinearGradient
          colors={
            isDisabled
              ? ["#27272a", "#18181b"]
              : ["#22c55e", "#15803d"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.contentRow}>
            {loading && <ActivityIndicator color="#ffffff" size="small" />}
            <Text
              style={[
                styles.btnText,
                isDisabled && { color: "#71717a" },
              ]}
            >
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    borderRadius: 16,
    height: 56,
    width: "100%",
    overflow: "hidden",
  },
  btnDisabled: {
    opacity: 0.7,
  },
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#ffffff",
    letterSpacing: 0.2,
  },
});
