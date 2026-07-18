#!/usr/bin/env node
import { writeFileSync, readFileSync } from "node:fs";

let _idSeq = 0;
function uid() {
  return `g${(_idSeq++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

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

const ref = (compId, name, w, h, opts = {}) => ({
  type: "ref", name,
  ref: `s:${compId}`,
  width: w, height: h,
  ...(opts.descendants ? { descendants: opts.descendants } : {}),
});

function assignIds(node) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) { node.forEach(assignIds); return; }
  if (node.type && !node.id) node.id = uid();
  if (node.children) node.children.forEach(assignIds);
  if (node.descendants && typeof node.descendants === "object" && !Array.isArray(node.descendants)) {
    Object.values(node.descendants).forEach(assignIds);
  }
}

// Load shadcn library to get component IDs
const libPath = new URL("shadcn.lib.pen", import.meta.url);
const lib = JSON.parse(readFileSync(libPath, "utf-8"));
const libFrame = lib.children[0];
const libMap = {};
for (const c of libFrame.children) {
  libMap[c.name] = c.id;
}

console.log("Library components:");
for (const [name, id] of Object.entries(libMap)) {
  console.log(`  ${name}: ${id}`);
}

// ── Hero Section ────────────────────────────────────────────────────

const hero = frame("Hero Section", 1440, 800, "#0b0b10", {
  children: [
    rect("Gradient BG", 1440, 800, "transparent", {
      children: [], // gradient handled by Pencil
    }),
    text("Heading", "Everything on\ncampus is for sale", {
      fill: "#ffffff", fontSize: 72, fontWeight: 700,
      textAlign: "center", width: 700,
    }),
    text("Subtitle", "Textbooks, gadgets, food, services — from real students on your campus.", {
      fill: "#ffffff", fontSize: 18, width: 500, textAlign: "center",
    }),
  ],
});

const landing = frame("Landing Page", 1440, 3000, "var(--background)", {
  children: [hero],
});

assignIds(landing);

const doc = {
  version: 1,
  fileToken: uid(),
  imports: { s: "shadcn.lib.pen" },
  children: [landing],
};

const out = new URL("soldbay-landing.pen", import.meta.url);
writeFileSync(out, JSON.stringify(doc, null, 2));
console.log(`\nWritten ${out.pathname}`);
