import { TouchableOpacity, Text, Platform } from "react-native";

interface RoleCardProps {
  icon: string;
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export function RoleCard({ icon, label, selected, onPress, disabled }: RoleCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
      style={{
        flex: 1,
        height: 72,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: selected ? "#e1261c" : "rgba(255,255,255,0.12)",
        backgroundColor: selected
          ? "rgba(225,38,28,0.08)"
          : "rgba(255,255,255,0.06)",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        opacity: disabled ? 0.5 : 1,
        ...(selected
          ? Platform.select({
              ios: {
                shadowColor: "rgba(225,38,28,0.3)",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 12,
              },
              android: {
                elevation: 8,
              },
              web: {
                boxShadow: "0px 4px 12px rgba(225,38,28,0.3)",
              },
            })
          : {}),
      }}
    >
      <Text
        style={{
          fontSize: 20,
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
