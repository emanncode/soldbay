import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { User } from "phosphor-react-native";
import { colors } from "@/theme/colors";

export interface UserAvatarProps {
  imageUrl?: string | null;
  name?: string;
  size?: number;
  onPress?: () => void;
}

export function UserAvatar({
  imageUrl,
  name,
  size = 40,
  onPress,
}: UserAvatarProps) {
  const borderRadius = size / 2;

  const getInitials = (fullName?: string) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  const content = (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
        },
      ]}
      accessibilityRole="image"
      accessibilityLabel={name ? `${name}'s profile picture` : "Profile picture"}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: size, height: size, borderRadius }}
          contentFit="cover"
          transition={200}
        />
      ) : initials ? (
        <View style={[styles.fallback, { borderRadius }]}>
          <Text style={[styles.initialsText, { fontSize: Math.round(size * 0.38) }]}>
            {initials}
          </Text>
        </View>
      ) : (
        <View style={[styles.fallback, { borderRadius }]}>
          <User size={Math.round(size * 0.5)} color={colors.textSecondary} weight="regular" />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="View profile"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  fallback: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    fontFamily: "Manrope-SemiBold",
    fontWeight: "700",
    color: colors.textPrimary,
  },
});

