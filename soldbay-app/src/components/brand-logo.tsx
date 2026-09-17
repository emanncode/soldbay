import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export interface BrandLogoProps {
  fontSize?: number;
  variant?: "primary" | "inverted";
  showDot?: boolean;
  uppercase?: boolean;
}

/**
 * SOLDBAY BRAND LOGO / WORDMARK
 * Matches the reference header layout with bold, crisp typography.
 * Supports bold uppercase wordmark (like SSENSE) or display serif title.
 */
export function BrandLogo({
  fontSize = 22,
  variant = "primary",
  showDot = true,
  uppercase = true,
}: BrandLogoProps) {
  const textColor = variant === "inverted" ? "#F4F1E8" : colors.textPrimary;
  const dotColor = colors.accent;
  const dotSize = Math.max(5, Math.round(fontSize * 0.25));

  return (
    <View
      style={styles.container}
      accessibilityRole="header"
      accessibilityLabel="Soldbay"
    >
      <Text
        style={[
          uppercase ? styles.wordmarkSans : styles.wordmarkSerif,
          {
            fontSize,
            lineHeight: Math.round(fontSize * 1.2),
            color: textColor,
          },
        ]}
      >
        {uppercase ? "SOLDBAY" : "Soldbay"}
      </Text>
      {showDot && (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: dotColor,
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              marginBottom: Math.round(fontSize * 0.56),
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  wordmarkSans: {
    fontFamily: "Manrope-SemiBold",
    fontWeight: "800",
    letterSpacing: 0.8,
    includeFontPadding: false,
  },
  wordmarkSerif: {
    fontFamily: "Fraunces-SemiBold",
    fontWeight: "700",
    letterSpacing: -0.5,
    includeFontPadding: false,
  },
  dot: {},
});

