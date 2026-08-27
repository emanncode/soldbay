import { Easing, useReducedMotion } from "react-native-reanimated";
import type { WithTimingConfig } from "react-native-reanimated";

/**
 * SOLDBAY MOTION TOKENS
 *
 * Two durations, one curve. That's the whole system.
 *
 *   micro    150ms — button press, chip toggle, small state flips
 *   standard 250ms — screen transitions, modal/sheet open, toast in/out
 *
 * Standard ease-in-out ONLY. No spring, no bounce. Reanimated's `withSpring`
 * presets are the path of least resistance, which is exactly why this is an
 * explicit token rather than a per-screen judgement call — a bouncy UI reads
 * as playful, and this product is trying to read as trustworthy.
 *
 * Pressed states are a deeper shade, NOT a scale-down. Don't animate scale on
 * press.
 */

export const duration = {
  micro: 150,
  standard: 250,
} as const;

/** The only easing curve in the system. */
export const easing = Easing.inOut(Easing.ease);

export const timing = {
  micro: { duration: duration.micro, easing } satisfies WithTimingConfig,
  standard: { duration: duration.standard, easing } satisfies WithTimingConfig,
} as const;

/**
 * Motion config that respects the OS reduce-motion setting.
 *
 * When reduce-motion is on, movement (position, scale, height) becomes
 * instant — but `fade` keeps a real duration. That's deliberate: the spec
 * requires degrading to instant/cross-fade *without dropping the state
 * feedback itself*. A duration-0 opacity change would make a toast or a
 * stepper advance appear with no perceptible transition at all, so the user
 * loses the signal that something happened. Cross-fade preserves it.
 *
 * @example
 *   const motion = useMotion();
 *   opacity.value = withTiming(1, motion.fade);
 *   translateY.value = withTiming(0, motion.standard);
 */
export function useMotion() {
  const reduced = useReducedMotion();

  return {
    reduced,
    /** Movement — collapses to instant under reduce-motion. */
    micro: reduced ? { duration: 0, easing } : timing.micro,
    /** Movement — collapses to instant under reduce-motion. */
    standard: reduced ? { duration: 0, easing } : timing.standard,
    /** Opacity — always animates, so state feedback survives reduce-motion. */
    fade: reduced ? timing.micro : timing.standard,
  } as const;
}

export type Motion = ReturnType<typeof useMotion>;
