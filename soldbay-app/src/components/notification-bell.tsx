import { TouchableOpacity, View } from "react-native";
import { elevation } from "../theme/elevation";
import { Bell } from "phosphor-react-native";
import { colors } from "@/theme/colors";

interface NotificationBellProps {
  hasUnread?: boolean;
  onPress?: () => void;
}

export function NotificationBell({
  hasUnread = false,
  onPress,
}: NotificationBellProps) {
  return (
    <TouchableOpacity
      style={elevation.raised}
      activeOpacity={0.7}
      onPress={onPress}
      className="w-11 h-11 bg-surface border border-border rounded-full items-center justify-center relative"
    >
      <Bell size={20} color={colors.textPrimary} weight="regular" />
      {hasUnread && (
        <View className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-accent" />
      )}
    </TouchableOpacity>
  );
}
