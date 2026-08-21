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
  dense?: boolean;
}

export function PrimaryButton({
  onPress,
  loading,
  disabled,
  label,
  dense,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.9}
      style={[
        styles.btnContainer,
        dense ? styles.denseContainer : null,
        isDisabled && styles.btnDisabled,
      ]}
    >
      <LinearGradient
        colors={isDisabled ? ["#cccccc", "#dddddd"] : ["#82df42", "#ebc948"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.contentRow}>
          {loading && <ActivityIndicator color="#000000" size="small" />}
          <Text
            style={[
              styles.btnText,
              isDisabled && { color: "rgba(0, 0, 0, 0.35)" },
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
    borderRadius: 26,
    height: 52,
    width: "100%",
    overflow: "hidden",
  },
  denseContainer: {
    height: 44,
    borderRadius: 22,
  },
  btnDisabled: {
    opacity: 0.6,
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
    gap: 8,
  },
  btnText: {
    fontFamily: "BricolageGrotesque-SemiBold",
    fontSize: 16,
    color: "#000000",
  },
});
