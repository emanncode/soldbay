export const soldbayEase = [0.25, 0.1, 0.25, 1] as const

export const sectionVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: soldbayEase },
  },
}

export const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: soldbayEase },
  },
})
