export const soldbayEase = [0.25, 0.1, 0.25, 1] as const

/**
 * Scroll reveal variants — opacity + translateY only (GPU-friendly).
 * Avoid scale/filter/layout props that force expensive paint on scroll.
 */
export const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: soldbayEase },
  },
}

export const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: soldbayEase },
  },
}

export const scaleInVariants = {
  // Named "scale" historically — uses only opacity/y for scroll perf
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: soldbayEase },
  },
}

/** Staggered children; custom = index for enter delay only */
export const staggerCardVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: Math.min(0.08 * i, 0.24), ease: soldbayEase },
  }),
}

export const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay, ease: soldbayEase },
  },
})

/**
 * Form / modal page entry — parent card scales up lightly once.
 * Use with stagger children for fields.
 */
export const formCardEntry = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: soldbayEase,
      when: "beforeChildren" as const,
      staggerChildren: 0.055,
      delayChildren: 0.08,
    },
  },
}

/** Individual form field / row inside formCardEntry */
export const formFieldEntry = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: soldbayEase },
  },
}

/**
 * Shared viewport for whileInView.
 * once: true — animate in once only (no reverse on scroll up).
 * Reverse-on-leave re-triggers layout/paint constantly and can make scroll feel laggy.
 */
export const scrollViewport = {
  once: true as const,
  amount: 0.15 as const,
  margin: "0px 0px -8% 0px" as const,
}
