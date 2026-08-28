import { Image, Text, View } from "react-native";

export interface AvatarProps {
  name?: string;
  imageUrl?: string | null;
  size?: 32 | 40 | 64;
  className?: string;
}

/**
 * SOLDBAY AVATAR
 *
 * Rules from DESIGN.md:
 * - Three standard sizes: 32 (inline), 40 (card), 64 (profile).
 * - Full rounded-full radius.
 * - Falls back to uppercase initials on accent-tint background (#CCFBF1) with accent-hover text (#0F766E).
 */
export function Avatar({
  name = "User",
  imageUrl,
  size = 40,
  className = "",
}: AvatarProps) {
  const getInitials = (str: string) => {
    const parts = str.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  const sizeStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const fontClass =
    size === 64
      ? "text-h2 font-manrope-semibold text-accent-hover"
      : size === 32
        ? "text-caption font-manrope-medium text-accent-hover"
        : "text-small-medium text-accent-hover";

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={sizeStyle}
        className={`bg-neutral-200 ${className}`}
        accessibilityLabel={name}
      />
    );
  }

  return (
    <View
      style={sizeStyle}
      className={`items-center justify-center bg-accent-tint ${className}`}
      accessibilityLabel={name}
    >
      <Text className={fontClass}>{initials}</Text>
    </View>
  );
}
