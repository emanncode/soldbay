import { View } from "react-native";

export interface DividerProps {
  className?: string;
}

/**
 * SOLDBAY DIVIDER
 *
 * 1px hairline divider with border token (#E5E5E5).
 */
export function Divider({ className = "" }: DividerProps) {
  return <View className={`h-px w-full bg-border ${className}`} />;
}
