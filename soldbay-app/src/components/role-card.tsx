import { TouchableOpacity, Text } from "react-native";

interface RoleCardProps {
  icon: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function RoleCard({ icon, label, selected, onPress }: RoleCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flex: 1,
        height: 80,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: selected ? "#e1261c" : "rgba(255,255,255,0.15)",
        backgroundColor: selected
          ? "rgba(225,38,28,0.08)"
          : "rgba(255,255,255,0.06)",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        ...(selected
          ? {
              shadowColor: "rgba(225,38,28,0.3)",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 12,
              elevation: 8,
            }
          : {}),
      }}
    >
      <Text
        style={{
          fontSize: 22,
          color: selected ? "#e1261c" : "rgba(255,255,255,0.6)",
        }}
      >
        {icon}
      </Text>
      <Text
        style={{
          fontFamily: "Inter-Medium",
          fontSize: 13,
          color: selected ? "#ffffff" : "rgba(255,255,255,0.8)",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
