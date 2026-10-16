"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SlidingPillCtaOption {
  id: string;
  label: React.ReactNode;
  href?: string;
  icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  onClick?: () => void;
}

export type SlidingPillLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export interface SlidingPillCtaProps {
  /** The options to render in the segmented pill. Typically 2 choices. */
  options: SlidingPillCtaOption[];
  /** The initially highlighted option id. Defaults to the first option id. */
  defaultActiveId?: string;
  /**
   * If true, the pill springs back to defaultActiveId when the cursor leaves the container.
   * If false (default sticky behavior), the highlight stays on the last hovered option.
   */
  revertOnMouseLeave?: boolean;
  /** Unique layoutId for Framer Motion shared layout animation. Defaults to "sliding-pill-indicator". */
  layoutId?: string;
  /** Optional custom Link component (e.g., Next.js Link or SmoothLink). Defaults to regular <a>. */
  LinkComponent?: React.ComponentType<SlidingPillLinkProps>;
  /** Additional classes for the outer container track. */
  className?: string;
  /** Additional classes for the sliding background pill. */
  pillClassName?: string;
  /** Classes applied to the label text when active. */
  activeTextClassName?: string;
  /** Classes applied to the label text when inactive. */
  inactiveTextClassName?: string;
}

export function SlidingPillCta({
  options,
  defaultActiveId,
  revertOnMouseLeave = false,
  layoutId = "sliding-pill-indicator",
  LinkComponent,
  className,
  pillClassName,
  activeTextClassName = "text-primary-foreground",
  inactiveTextClassName = "text-foreground",
}: SlidingPillCtaProps) {
  const reduceMotion = useReducedMotion();
  const initialId = defaultActiveId ?? options[0]?.id ?? "";

  const [active, setActive] = useState<string>(initialId);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pressed, setPressed] = useState<string | null>(null);

  const displayedActive = revertOnMouseLeave ? (hovered ?? active) : active;

  const handlePress = (option: SlidingPillCtaOption) => {
    setActive(option.id);
    setPressed(option.id);
    window.setTimeout(() => setPressed(null), 300);
    option.onClick?.();
  };

  return (
    <div
      role="group"
      aria-label="Action options"
      onMouseLeave={() => {
        if (revertOnMouseLeave) setHovered(null);
      }}
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-background p-1.5 shadow-elevation-3",
        className,
      )}
    >
      {options.map((option) => {
        const isCurrent = displayedActive === option.id;
        const Icon = option.icon;

        const commonProps = {
          onMouseEnter: () => {
            if (revertOnMouseLeave) {
              setHovered(option.id);
            } else {
              setActive(option.id);
            }
          },
          onFocus: () => {
            setActive(option.id);
            if (revertOnMouseLeave) setHovered(option.id);
          },
          onClick: () => handlePress(option),
          className:
            "relative flex h-11 items-center justify-center overflow-hidden rounded-full px-6 font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        };

        const innerContent = (
          <>
            {/* Sliding animated background pill */}
            {isCurrent && (
              <motion.span
                layoutId={layoutId}
                className={cn("absolute inset-0 rounded-full bg-primary", pillClassName)}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 400, damping: 34 }
                }
              />
            )}

            {/* Micro-interaction click burst */}
            <AnimatePresence>
              {pressed === option.id && (
                <motion.span
                  key={`press-${option.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none absolute inset-0 z-10 rounded-full bg-white/25"
                />
              )}
            </AnimatePresence>

            {/* Label and optional icon */}
            <span
              className={cn(
                "relative z-20 flex items-center gap-2 transition-colors",
                isCurrent ? activeTextClassName : inactiveTextClassName,
              )}
            >
              {option.label}
              {Icon && <Icon className="size-4" aria-hidden="true" />}
            </span>
          </>
        );

        if (option.href) {
          if (LinkComponent) {
            return (
              <LinkComponent key={option.id} href={option.href} {...commonProps}>
                {innerContent}
              </LinkComponent>
            );
          }
          return (
            <a key={option.id} href={option.href} {...commonProps}>
              {innerContent}
            </a>
          );
        }

        return (
          <button key={option.id} type="button" {...commonProps}>
            {innerContent}
          </button>
        );
      })}
    </div>
  );
}
