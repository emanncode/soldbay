"use client"

import { motion, useReducedMotion } from "framer-motion"
import { scrollViewport, sectionVariants } from "@/lib/motion"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  id?: string
}

/**
 * Section that fades/slides in once when scrolled into view.
 * Respects prefers-reduced-motion (no animation).
 */
export function AnimatedSection({
  children,
  className,
  delay = 0,
  id,
}: AnimatedSectionProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    )
  }

  return (
    <motion.section
      id={id}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      transition={delay ? { delay } : undefined}
      className={className}
    >
      {children}
    </motion.section>
  )
}
