#!/usr/bin/env node
import { writeFileSync } from "node:fs";

let _idSeq = 0;
function uid() {
  return `g${(_idSeq++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

// ── Helpers ──────────────────────────────────────────────────────────

const text = (name, content, opts = {}) => ({
  type: "text", name,
  fill: opts.fill ?? "#1d1d1f",
  content,
  fontFamily: "Inter",
  fontSize: opts.fontSize ?? 14,
  fontWeight: opts.fontWeight ?? 400,
  lineHeight: opts.lineHeight ?? 1.4,
  ...(opts.textAlign ? { textAlign: opts.textAlign } : {}),
  ...(opts.width ? { width: opts.width } : {}),
  ...(opts.textGrowth ? { textGrowth: opts.textGrowth } : {}),
});

const rect = (name, w, h, fill, opts = {}) => ({
  type: "rectangle", name,
  width: w, height: h,
  cornerRadius: opts.cornerRadius ?? 0,
  fill: fill ?? "transparent",
  ...(opts.stroke ? { stroke: opts.stroke, strokeWidth: opts.strokeWidth ?? 1 } : {}),
});

const frame = (name, w, h, fill = "transparent", opts = {}) => ({
  type: "frame", name,
  width: w, height: h,
  fill,
  cornerRadius: opts.cornerRadius ?? 0,
  ...(opts.stroke ? { stroke: opts.stroke, strokeWidth: opts.strokeWidth ?? 1 } : {}),
  layout: opts.layout ?? "none",
  ...(opts.gap ? { gap: opts.gap } : {}),
  ...(opts.padding ? { padding: opts.padding } : {}),
  ...(opts.alignItems ? { alignItems: opts.alignItems } : {}),
  ...(opts.justifyContent ? { justifyContent: opts.justifyContent } : {}),
  children: opts.children ?? [],
});

function assignIds(node) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) { node.forEach(assignIds); return; }
  if (node.type && !node.id) node.id = uid();
  if (node.children) node.children.forEach(assignIds);
}

// ── Theme Variables (matching soldbay globals.css) ───────────────────

const VARIABLES = {
  "--background":             { type: "color", value: [{ value: "#ffffff" }] },
  "--foreground":             { type: "color", value: [{ value: "#1d1d1f" }] },
  "--card":                   { type: "color", value: [{ value: "#ffffff" }] },
  "--card-foreground":        { type: "color", value: [{ value: "#1d1d1f" }] },
  "--popover":                { type: "color", value: [{ value: "#ffffff" }] },
  "--popover-foreground":     { type: "color", value: [{ value: "#1d1d1f" }] },
  "--primary":                { type: "color", value: [{ value: "#e1261c" }] },
  "--primary-hover":          { type: "color", value: [{ value: "#c91f16" }] },
  "--primary-foreground":     { type: "color", value: [{ value: "#ffffff" }] },
  "--secondary":              { type: "color", value: [{ value: "#f5f5f7" }] },
  "--secondary-foreground":   { type: "color", value: [{ value: "#1d1d1f" }] },
  "--muted":                  { type: "color", value: [{ value: "#f5f5f7" }] },
  "--muted-foreground":       { type: "color", value: [{ value: "#6e6e73" }] },
  "--accent":                 { type: "color", value: [{ value: "#e1261c" }] },
  "--accent-foreground":      { type: "color", value: [{ value: "#ffffff" }] },
  "--destructive":            { type: "color", value: [{ value: "#dc2626" }] },
  "--destructive-foreground": { type: "color", value: [{ value: "#ffffff" }] },
  "--border":                 { type: "color", value: [{ value: "#d2d2d7" }] },
  "--input":                  { type: "color", value: [{ value: "#d2d2d7" }] },
  "--ring":                   { type: "color", value: [{ value: "#e1261c" }] },
  "--success":                { type: "color", value: [{ value: "#16a34a" }] },
  "--warning":                { type: "color", value: [{ value: "#f59e0b" }] },
  "--info":                   { type: "color", value: [{ value: "#2563eb" }] },
  "--radius":                 { type: "number", value: [{ value: 10 }] },
};

// ── Components ──────────────────────────────────────────────────────

// Button
function makeButton(label, bg, fg, opts = {}) {
  return frame(label, 120, 36, bg, {
    cornerRadius: 9999, reusable: true,
    children: [
      text("label", "Button", { fill: fg, fontSize: 14, fontWeight: 500, textAlign: "center", textGrowth: "fixed-width", width: 100 }),
    ],
    ...(opts.stroke ? { stroke: opts.stroke, strokeWidth: 1 } : {}),
  });
}

// Badge
function makeBadge(label, bg, fg, opts = {}) {
  return frame(label, 60, 20, bg, {
    cornerRadius: 9999, reusable: true,
    children: [
      text("label", "Badge", { fill: fg, fontSize: 12, fontWeight: 500, textAlign: "center", textGrowth: "fixed-width", width: 44 }),
    ],
    ...(opts.stroke ? { stroke: opts.stroke, strokeWidth: 1 } : {}),
  });
}

// ── Assemble ────────────────────────────────────────────────────────

const components = [
  makeButton("Button/Default",     "var(--primary)",   "var(--primary-foreground)"),
  makeButton("Button/Secondary",   "var(--secondary)", "var(--secondary-foreground)"),
  makeButton("Button/Destructive", "var(--destructive)", "var(--destructive-foreground)"),
  makeButton("Button/Outline",     "transparent",      "var(--foreground)",    { stroke: "var(--border)" }),
  makeButton("Button/Ghost",       "transparent",      "var(--foreground)"),

  makeBadge("Badge/Default",     "var(--primary)",   "var(--primary-foreground)"),
  makeBadge("Badge/Secondary",   "var(--secondary)", "var(--secondary-foreground)"),
  makeBadge("Badge/Destructive", "var(--destructive)", "var(--destructive-foreground)"),
  makeBadge("Badge/Outline",     "transparent",      "var(--foreground)", { stroke: "var(--border)" }),

  // Card
  frame("Card", 300, 180, "var(--card)", {
    cornerRadius: 10, reusable: true,
    stroke: "var(--border)", strokeWidth: 1,
    children: [
      text("title", "Card Title", { fill: "var(--card-foreground)", fontSize: 16, fontWeight: 600, width: 260 }),
      text("body", "Card content goes here.", { fill: "var(--muted-foreground)", fontSize: 14, width: 260 }),
    ],
  }),
];

// Assign stable IDs
components.forEach(assignIds);

const doc = {
  version: 1,
  fileToken: uid(),
  variables: VARIABLES,
  children: [{
    id: uid(),
    type: "frame",
    name: "shadcn: design system components",
    width: 1200, height: 800,
    fill: "var(--background)",
    children: components,
  }],
};

const out = new URL("shadcn.lib.pen", import.meta.url);
writeFileSync(out, JSON.stringify(doc, null, 2));
console.log(`Written ${out.pathname}`);
console.log(`  Variables: ${Object.keys(VARIABLES).length}`);
console.log(`  Components: ${components.length}`);
components.forEach((c) => console.log(`    - ${c.name}`));
