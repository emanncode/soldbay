import { type ReactNode } from "react";
import { View, Dimensions, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

interface PageAtmosphereProps {
  style?: ViewStyle;
  className?: string;
  children: ReactNode;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export function PageAtmosphere({
  style,
  className,
  children,
}: PageAtmosphereProps) {
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: "#07060f",
          overflow: "hidden",
          position: 'relative'
        },
        style,
      ]}
      className={className}
    >
      <View
        style={{
          position: "absolute",
          top: -SCREEN_H * 0.1,
          left: SCREEN_W * 0.05,
          width: SCREEN_W * 0.9,
          height: SCREEN_H * 0.6,
          borderRadius: SCREEN_W * 0.45,
          backgroundColor: "rgba(91, 61, 240, 0.35)",
        }}
        pointerEvents="none"
      />

      <View
        style={{
          position: "absolute",
          top: SCREEN_H * 0.2,
          right: -SCREEN_W * 0.15,
          width: SCREEN_W * 0.7,
          height: SCREEN_H * 0.5,
          borderRadius: SCREEN_W * 0.35,
          backgroundColor: "rgba(69, 39, 200, 0.2)",
        }}
        pointerEvents="none"
      />

      <View
        style={{
          position: "absolute",
          top: SCREEN_H * 0.5,
          left: -SCREEN_W * 0.1,
          width: SCREEN_W * 0.5,
          height: SCREEN_H * 0.4,
          borderRadius: SCREEN_W * 0.25,
          backgroundColor: "rgba(46, 31, 141, 0.25)",
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
        colors={["#0b0b1080", "#0a081833", "#07060f00"]}
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
