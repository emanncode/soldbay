import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
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

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.88}
      style={[styles.btnContainer, isDisabled && styles.btnDisabled]}
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
    </TouchableOpacity>
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
