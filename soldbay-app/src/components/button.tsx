import { useState, type ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { colors } from "../theme/colors";

/**
 * SOLDBAY BUTTON — the only button in the system.
 *
 * Four variants. 48px high. Radius 10 (`md`).
 *
 * Rules encoded here, all easy to break by accident:
 *   - Pressed state is a DEEPER SHADE, never a scale/spring. No hover states
 *     either — this is touch-first.
 *   - Loading swaps the label for a spinner with NO LAYOUT SHIFT: the label
 *     stays mounted at zero opacity so the button keeps its exact width.
 *   - `full` (the default) fills its container; `auto` hugs its label. There's
 *     no explicit width prop, so screens can't invent off-scale sizes.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  /** Leading icon. Pass a Lucide element sized 20. */
  icon?: ReactNode;
  width?: "full" | "auto";
  className?: string;
}

/** Surface classes per variant, split by resting / pressed / disabled. */
const surface: Record<
  ButtonVariant,
  { base: string; pressed: string; disabled: string }
> = {
  primary: {
    base: "bg-accent",
    pressed: "bg-accent-hover",
    disabled: "bg-neutral-200",
  },
  secondary: {
    base: "bg-surface-elevated border border-neutral-300",
    pressed: "bg-neutral-100 border border-neutral-300",
    disabled: "bg-surface-elevated border border-neutral-200",
  },
  ghost: {
    base: "bg-transparent",
    pressed: "bg-accent-tint",
    disabled: "bg-transparent",
  },
  destructive: {
    base: "bg-error",
    pressed: "bg-[#B91C1C]",
    disabled: "bg-neutral-200",
  },
};

const labelColor: Record<ButtonVariant, { base: string; disabled: string }> = {
  primary: { base: "text-text-inverse", disabled: "text-neutral-500" },
  secondary: { base: "text-text-primary", disabled: "text-neutral-400" },
  ghost: { base: "text-accent", disabled: "text-neutral-400" },
  destructive: { base: "text-text-inverse", disabled: "text-neutral-500" },
};

/** Spinner colour has to match the label, and can't come from a className. */
const spinnerColor: Record<ButtonVariant, string> = {
  primary: colors.textInverse,
  secondary: colors.textPrimary,
  ghost: colors.accent,
  destructive: colors.textInverse,
};

export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
  width = "full",
  className = "",
}: ButtonProps) {
  // Tracked in state rather than Pressable's style callback so the pressed
  // shade can be expressed as a token className like everything else.
  const [pressed, setPressed] = useState(false);
  const inert = disabled || loading;

  const surfaceClass = inert
    ? surface[variant].disabled
    : pressed
      ? surface[variant].pressed
      : surface[variant].base;

  const textClass = inert
    ? labelColor[variant].disabled
    : labelColor[variant].base;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={inert}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inert, busy: loading }}
      className={`h-6 flex-row items-center justify-center rounded-md px-2 ${
        width === "full" ? "w-full" : "self-start"
      } ${surfaceClass} ${className}`}
    >
      {/* Label and spinner are stacked, so switching between them can't
          change the button's measured size. */}
      <View className="flex-row items-center justify-center gap-1">
        {icon ? <View style={{ opacity: loading ? 0 : 1 }}>{icon}</View> : null}
        <Text
          numberOfLines={1}
          style={{ opacity: loading ? 0 : 1 }}
          className={`text-body-medium ${textClass}`}
        >
          {label}
        </Text>
      </View>
      {loading ? (
        <View className="absolute inset-0 items-center justify-center">
          <ActivityIndicator size="small" color={spinnerColor[variant]} />
        </View>
      ) : null}
    </Pressable>
  );
}
