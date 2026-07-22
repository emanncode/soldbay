import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

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
      activeOpacity={0.8}
      style={{
        backgroundColor: isDisabled
          ? "rgba(255,255,255,0.08)"
          : "#e1261c",
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
        opacity: loading ? 0.5 : 1,
      }}
    >
      {loading && <ActivityIndicator color="#ffffff" size="small" />}
      <Text
        style={{
          fontFamily: "Inter-SemiBold",
          fontSize: 16,
          color: isDisabled ? "rgba(255,255,255,0.4)" : "#ffffff",
        }}
      >
        {loading ? `${label}...` : label}
      </Text>
    </TouchableOpacity>
  );
}
