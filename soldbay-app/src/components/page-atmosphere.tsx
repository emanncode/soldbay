import { type ReactNode } from "react";
import { View, Dimensions, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

interface PageAtmosphereProps {
  style?: ViewStyle;
  className?: string;
  children: ReactNode;
  theme?: "dark" | "green";
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export function PageAtmosphere({
  style,
  className,
  children,
  theme = "dark",
}: PageAtmosphereProps) {
  if (theme === "green") {
    return (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: "#2B8721",
            overflow: "hidden",
            position: 'relative'
          },
          style,
        ]}
        className={className}
      >
        <LinearGradient
          colors={["#aee572", "#47a331", "#216e18"]}
          locations={[0, 0.5, 1]}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        {children}
      </View>
    );
  }

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: "#070606", // Rich deep warm black
          overflow: "hidden",
          position: 'relative'
        },
        style,
      ]}
      className={className}
    >
      {/* Top right orange/amber glow */}
      <View
        style={{
          position: "absolute",
          top: -SCREEN_H * 0.1,
          right: -SCREEN_W * 0.1,
          width: SCREEN_W * 1.1,
          height: SCREEN_H * 0.65,
          borderRadius: SCREEN_W * 0.55,
          backgroundColor: "rgba(255, 79, 24, 0.22)", // Warm orange glow
        }}
        pointerEvents="none"
      />

      {/* Middle right warm bronze/brown glow */}
      <View
        style={{
          position: "absolute",
          top: SCREEN_H * 0.2,
          right: -SCREEN_W * 0.2,
          width: SCREEN_W * 0.8,
          height: SCREEN_H * 0.5,
          borderRadius: SCREEN_W * 0.4,
          backgroundColor: "rgba(120, 53, 4, 0.18)", // Warm bronze/amber glow
        }}
        pointerEvents="none"
      />

      {/* Bottom left subtle amber glow */}
      <View
        style={{
          position: "absolute",
          top: SCREEN_H * 0.5,
          left: -SCREEN_W * 0.1,
          width: SCREEN_W * 0.5,
          height: SCREEN_H * 0.4,
          borderRadius: SCREEN_W * 0.25,
          backgroundColor: "rgba(194, 65, 12, 0.12)", // Soft amber glow
        }}
        pointerEvents="none"
      />

      <BlurView
        intensity={32}
        tint="dark"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        pointerEvents="none"
      />

      <LinearGradient
        colors={["#0b0a0a80", "#0a080833", "#07060600"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        pointerEvents="none"
      />

      {children}
    </View>
  );
}
