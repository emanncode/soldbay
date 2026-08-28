import { type ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface StickyActionBarProps {
  children: ReactNode;
  className?: string;
}

/**
 * SOLDBAY STICKY ACTION BAR
 *
 * Fixed bottom action container with:
 * - 1px top border (#E5E5E5).
 * - White elevated surface (#FFFFFF).
 * - Safe area bottom inset support.
 */
export function StickyActionBar({
  children,
  className = "",
}: StickyActionBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      className={`w-full border-t border-border bg-surface-elevated px-2 pt-1.5 ${className}`}
    >
      {children}
    </View>
  );
}
