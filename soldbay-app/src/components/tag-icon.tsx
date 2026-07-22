import { View } from "react-native";

interface TagIconProps {
  size?: number;
  fill?: string;
}

export function TagIcon({ size = 24, fill = "#e1261c" }: TagIconProps) {
  const h = size * 0.875;
  const innerW = size * 0.75;
  const innerH = h * 0.82;
  const hole = size * 0.25;
  return (
    <View style={{ width: size, height: h }}>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: innerH,
          backgroundColor: fill,
          borderRadius: size * 0.18,
          borderTopRightRadius: 0,
        }}
      />
      <View
        style={{
          position: "absolute",
          right: 0,
          top: innerH * 0.08,
          width: innerW,
          height: innerH * 0.6,
          backgroundColor: fill,
          borderTopRightRadius: size * 0.18,
          borderTopLeftRadius: size * 0.08,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: innerH * 0.15,
          left: innerW * 0.55,
          width: hole,
          height: hole,
          borderRadius: hole / 2,
          backgroundColor: "#07060f",
        }}
      />
    </View>
  );
}
