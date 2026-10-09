import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { Bell } from "phosphor-react-native";
import { colors } from "../../theme/tokens";
import { Avatar } from "./Avatar";

interface ScreenHeaderProps {
  title: string;
  hasUnreadNotifications?: boolean;
  onNotificationPress?: () => void;
  userImageUrl?: string;
  userName?: string;
  onProfilePress?: () => void;
}

export function ScreenHeader({
  title,
  hasUnreadNotifications = false,
  onNotificationPress,
  userImageUrl,
  userName = "User", // default fallback
  onProfilePress,
}: ScreenHeaderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Derive initials from name
  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <View className="flex-row items-center justify-between mb-6">
      <Text className="text-title-2 text-primaryText dark:text-darkText">
        {title}
      </Text>

      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          onPress={onNotificationPress}
          className="relative items-center justify-center w-9 h-9 rounded-full bg-bgBase dark:bg-darkBg shadow-elevation-1 dark:shadow-none"
        >
          <Bell
            size={22}
            color={isDark ? colors.darkText : colors.primaryText}
            weight="regular"
          />
          {hasUnreadNotifications && (
            <View className="absolute top-1.5 right-2.5 w-2 h-2 rounded-full border border-bgBase dark:border-darkBg bg-discountFill" />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onProfilePress} activeOpacity={0.8}>
          <Avatar imageUrl={userImageUrl} initials={initials} size={36} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
