import { TouchableOpacity, View } from "react-native";
import { elevation } from "../theme/elevation";
import { Bell } from "phosphor-react-native";
import { colors } from "@/theme/colors";

interface NotificationBellProps {
  hasUnread?: boolean;
  onPress?: () => void;
}

export function NotificationBell({ hasUnread = false, onPress }: NotificationBellProps) {
  return (
    <TouchableOpacity style={elevation.raised}
      activeOpacity={0.7}
      onPress={onPress}
      className="w-[44px] h-[44px] bg-surface border border-border rounded-md items-center justify-center relative"
    >
      <Bell size={20} color={colors.textPrimary} weight="regular" />
      {hasUnread && (
        <View className="absolute top-[10px] right-[10px] w-[7px] h-[7px] rounded-full bg-accent" />
      )}
    </TouchableOpacity>
  );
}
