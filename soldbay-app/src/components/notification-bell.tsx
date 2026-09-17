import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Bell } from "phosphor-react-native";
import { colors } from "@/theme/colors";

export interface NotificationBellProps {
  hasUnread?: boolean;
  unreadCount?: number;
  onPress?: () => void;
}

export function NotificationBell({
  hasUnread = false,
  unreadCount,
  onPress,
}: NotificationBellProps) {
  const showBadge = (unreadCount !== undefined && unreadCount > 0) || hasUnread;
  const countLabel =
    unreadCount !== undefined && unreadCount > 0
      ? unreadCount > 99
        ? "99+"
        : String(unreadCount)
      : null;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Notifications${countLabel ? `, ${countLabel} unread` : ""}`}
      style={styles.button}
      className="items-center justify-center relative"
    >
    <Bell size={20} color={colors.textPrimary} weight="bold" />
      {showBadge && (
        <View
          style={countLabel ? styles.countBadge : styles.unreadDot}
          className="absolute bg-accent rounded-full items-center justify-center"
        >
          {countLabel ? (
            <Text style={styles.countText}>{countLabel}</Text>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  countBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontSize: 12,
    lineHeight: 12,
    fontFamily: "Manrope-SemiBold",
    fontWeight: "700",
    color: colors.textPrimary,
  },
  unreadDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
});
