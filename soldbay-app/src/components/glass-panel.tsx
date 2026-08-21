import { type ReactNode } from "react";
import { View, type ViewStyle, Platform } from "react-native";
import { BlurView } from "expo-blur";

type GlassVariant = "panel" | "panel-strong" | "nav" | "panel-focus";

interface VariantStyle {
  intensity: number;
  tint: "dark" | "light";
  bgOverlay: string;
  borderColor: string;
  highlightOpacity: number;
  borderRadius: number;
  shadow: ViewStyle;
}

const variantConfig: Record<GlassVariant, VariantStyle> = {
  panel: {
    intensity: 30,
    tint: "dark",
    bgOverlay: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.12)",
    highlightOpacity: 0.08,
    borderRadius: 16,
    shadow: Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 32,
      },
      android: {
        elevation: 16,
      },
      web: {
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.35)",
      },
    }) || {},
  },
  "panel-strong": {
    intensity: 42,
    tint: "dark",
    bgOverlay: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.16)",
    highlightOpacity: 0.12,
    borderRadius: 16,
    shadow: Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 40,
      },
      android: {
        elevation: 20,
      },
      web: {
        boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.4)",
      },
    }) || {},
  },
  nav: {
    intensity: 25,
    tint: "dark",
    bgOverlay: "transparent",
    borderColor: "rgba(255,255,255,0.14)",
    highlightOpacity: 0.1,
    borderRadius: 0,
    shadow: {},
  },
  "panel-focus": {
    intensity: 50,
    tint: "dark",
    bgOverlay: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.22)",
    highlightOpacity: 0.16,
    borderRadius: 16,
    shadow: Platform.select({
      ios: {
        shadowColor: "#5b3df0",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 80,
      },
      android: {
        elevation: 24,
      },
      web: {
        boxShadow: "0px 0px 80px rgba(91, 61, 240, 0.25)",
      },
    }) || {},
  },
};

interface GlassPanelProps {
  variant?: GlassVariant;
  style?: ViewStyle;
  className?: string;
  children: ReactNode;
}

export function GlassPanel({
  variant = "panel",
  style,
  className,
  children,
}: GlassPanelProps) {
  const config = variantConfig[variant];

  return (
    <BlurView
      intensity={config.intensity}
      tint={config.tint}
      style={[
        {
          overflow: "hidden",
          borderRadius: config.borderRadius,
          borderWidth: 1,
          borderColor: config.borderColor,
        },
        config.shadow,
        style,
      ]}
      className={className}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        {children}
      </View>
    </BlurView>
  );
}
