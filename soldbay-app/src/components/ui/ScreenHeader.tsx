import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { Bell } from "phosphor-react-native";
import { colors } from "../../theme/tokens";

interface ScreenHeaderProps {
  title: string;
  hasUnreadNotifications?: boolean;
  onNotificationPress?: () => void;
}

export function ScreenHeader({
  title,
  hasUnreadNotifications = false,
  onNotificationPress,
}: ScreenHeaderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-title-2 text-primaryText dark:text-darkText">
        {title}
      </Text>

      <TouchableOpacity
        onPress={onNotificationPress}
        className="relative items-center justify-center w-9 h-9 rounded-full bg-bgBase dark:bg-darkBg shadow-elevation-1 dark:shadow-none"
      >
        <Bell
          size={20}
          color={isDark ? colors.darkText : colors.primaryText}
          weight="regular"
        />
        {hasUnreadNotifications && (
          <View className="absolute top-1.5 right-2.5 w-2 h-2 rounded-full border border-bgBase dark:border-darkBg bg-discountFill" />
        )}
      </TouchableOpacity>
    </View>
  );
}
