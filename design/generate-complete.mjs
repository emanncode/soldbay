#!/usr/bin/env node
import { writeFileSync } from "node:fs";

let _idSeq = 0;
function uid() { return `n${(_idSeq++).toString(36)}${Math.random().toString(36).slice(2, 6)}`; }

// ── Node factories ───────────────────────────────────────────────────

function text(name, content, opts = {}) {
  return {
    type: "text", name, id: uid(),
    fill: opts.fill ?? "#1d1d1f",
    content,
    fontFamily: opts.fontFamily ?? "Inter",
    fontSize: opts.fontSize ?? 14,
    fontWeight: opts.fontWeight ?? 400,
    lineHeight: opts.lineHeight ?? 1.4,
    ...(opts.textAlign ? { textAlign: opts.textAlign } : {}),
    ...(opts.width ? { width: opts.width } : {}),
    ...(opts.textGrowth ? { textGrowth: opts.textGrowth } : {}),
    ...(opts.letterSpacing ? { letterSpacing: opts.letterSpacing } : {}),
  };
}

function rect(name, w, h, fill, opts = {}) {
  return {
    type: "rectangle", name, id: uid(),
    width: w, height: h,
    cornerRadius: opts.cornerRadius ?? 0,
    fill: fill ?? "transparent",
    ...(opts.stroke ? { stroke: opts.stroke, strokeWidth: opts.strokeWidth ?? 1 } : {}),
  };
}

function path(name, geometry, fill, opts = {}) {
  return {
    type: "path", name, id: uid(),
    geometry,
    fill: fill ?? "transparent",
    ...(opts.stroke ? { stroke: opts.stroke, strokeWidth: opts.strokeWidth ?? 1 } : {}),
    ...(opts.cornerRadius ? { cornerRadius: opts.cornerRadius } : {}),
  };
}

function frame(name, w, h, fill = "transparent", opts = {}) {
  return {
    type: "frame", name, id: uid(),
    width: w, height: h, fill,
    cornerRadius: opts.cornerRadius ?? 0,
    layout: opts.layout ?? "none",
    ...(opts.gap ? { gap: opts.gap } : {}),
    ...(opts.padding ? { padding: Array.isArray(opts.padding) ? opts.padding.join(" ") : opts.padding } : {}),
    ...(opts.alignItems ? { alignItems: opts.alignItems } : {}),
    ...(opts.justifyContent ? { justifyContent: opts.justifyContent } : {}),
    ...(opts.clipsContent !== undefined ? { clipsContent: opts.clipsContent } : {}),
    ...(opts.stroke ? { stroke: opts.stroke, strokeWidth: opts.strokeWidth ?? 1 } : {}),
    children: opts.children ?? [],
  };
}

function group(name, children, opts = {}) {
  return {
    type: "group", name, id: uid(),
    children,
    ...(opts.width ? { width: opts.width } : {}),
    ...(opts.height ? { height: opts.height } : {}),
  };
}

// ── Reusable sub-assemblies ──────────────────────────────────────────

function priceTagIcon(size, fill = "var(--brand-purple)") {
  const s = size;
  const holeSize = s * 0.18;
  return group("Tag Icon", [
    rect("Tag Body", s, s * 0.85, fill, { cornerRadius: s * 0.2 }),
    rect("Tag Hole", holeSize, holeSize, "#0b0b10", {
      cornerRadius: holeSize / 2,
      ...(fill === "var(--brand-purple)" ? {} : { top: s * 0.12, right: s * 0.12 }),
    }),
  ], { width: s, height: s });
}

function pillButton(label, w, h, bg, fg, opts = {}) {
  return frame(`Button: ${label}`, w, h, bg, {
    cornerRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    stroke: opts.stroke,
    strokeWidth: opts.strokeWidth,
    children: [
      text(`btn-label`, label, {
        fill: fg, fontSize: opts.fontSize ?? 16, fontWeight: 600,
        textAlign: "center", textGrowth: "fixed-width", width: w - 32,
      }),
    ],
  });
}

function inputField(label, placeholder, w = 480, opts = {}) {
  return frame(`Field: ${label}`, w, 72, "transparent", {
    layout: "vertical",
    gap: 6,
    children: [
      text(`Label`, label, { fill: "var(--text-dark)", fontSize: 14, fontWeight: 500, width: w }),
      frame(`Input`, w, 44, "var(--bg-white)", {
        cornerRadius: 10,
        stroke: "var(--border)",
        strokeWidth: 1,
        alignItems: "center",
        padding: [0, 14],
        children: [
          text(`Placeholder`, placeholder, {
            fill: opts.value ? "var(--text-dark)" : "var(--text-gray)",
            fontSize: 14, width: w - 28,
            textGrowth: "fixed-width",
          }),
        ],
      }),
    ],
  });
}

function dropdownField(label, placeholder, options, w = 480) {
  return frame(`Field: ${label}`, w, 72, "transparent", {
    layout: "vertical",
    gap: 6,
    children: [
      text(`Label`, label, { fill: "var(--text-dark)", fontSize: 14, fontWeight: 500, width: w }),
      frame(`Input`, w, 44, "var(--bg-white)", {
        cornerRadius: 10,
        stroke: "var(--border)",
        strokeWidth: 1,
        alignItems: "center",
        justifyContent: "space-between",
        padding: [0, 14],
        children: [
          text(`Placeholder`, placeholder, { fill: "var(--text-gray)", fontSize: 14, width: w - 56, textGrowth: "fixed-width" }),
          text(`Chevron`, "▼", { fill: "var(--text-muted)", fontSize: 10, textGrowth: "fixed-width", width: 12 }),
        ],
      }),
    ],
  });
}

function chip(label, selected = false) {
  const bg = selected ? "var(--brand-purple)" : "var(--bg-white)";
  const fg = selected ? "#ffffff" : "var(--text-dark)";
  const stroke = selected ? "var(--brand-purple)" : "var(--border)";
  return frame(`Chip: ${label}`, 0, 32, bg, {
    cornerRadius: 9999,
    stroke, strokeWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: [0, 14],
    children: [
      text(`label`, label, { fill: fg, fontSize: 13, fontWeight: 500, textGrowth: "fixed-width" }),
    ],
  });
}

function checkbox(label, checked = false) {
  const boxSize = 20;
  return frame(`Checkbox: ${label}`, 0, 28, "transparent", {
    alignItems: "center",
    gap: 10,
    children: [
      rect(`Box`, boxSize, boxSize, checked ? "var(--brand-purple)" : "var(--bg-white)", {
        cornerRadius: 4,
        stroke: checked ? "var(--brand-purple)" : "var(--border)",
        strokeWidth: 1.5,
      }),
      text(`label`, label, { fill: "var(--text-dark)", fontSize: 14, width: 300, textGrowth: "fixed-width" }),
    ],
  });
}

function accordionItem(question, answer, isLast = false) {
  return frame(`Accordion: ${question}`, 720, 56, "transparent", {
    layout: "vertical",
    children: [
      rect(`Divider`, 720, 1, isLast ? "transparent" : "var(--border)"),
      frame(`Question Row`, 720, 56, "transparent", {
        alignItems: "center",
        justifyContent: "space-between",
        children: [
          text(`Question`, question, { fill: "var(--text-dark)", fontSize: 16, fontWeight: 500, width: 640, textGrowth: "fixed-width" }),
          text(`Plus`, "+", { fill: "var(--brand-purple)", fontSize: 20, fontWeight: 600, width: 24, textAlign: "center" }),
        ],
      }),
    ],
  });
}

function navBar() {
  return frame("Nav Bar", 1200, 60, "transparent", {
    layout: "horizontal",
    alignItems: "center",
    justifyContent: "space-between",
    children: [
      frame("Logo", 140, 36, "transparent", {
        layout: "horizontal", gap: 10, alignItems: "center",
        children: [
          rect("Tag Mark", 28, 28, "var(--brand-purple)", { cornerRadius: 6 }),
          text("Soldbay", "Soldbay", { fill: "#ffffff", fontSize: 20, fontWeight: 700, fontFamily: "Bricolage Grotesque", width: 90, textGrowth: "fixed-width" }),
        ],
      }),
      frame("Nav Links", 500, 36, "transparent", {
        layout: "horizontal", gap: 32, alignItems: "center", justifyContent: "flex-end",
        children: [
          text("Buyers", "Buyers", { fill: "#9e9ea0", fontSize: 14, fontWeight: 500, width: 50, textGrowth: "fixed-width" }),
          text("Sellers", "Sellers", { fill: "#9e9ea0", fontSize: 14, fontWeight: 500, width: 50, textGrowth: "fixed-width" }),
          text("FAQ", "FAQ", { fill: "#9e9ea0", fontSize: 14, fontWeight: 500, width: 30, textGrowth: "fixed-width" }),
          pillButton("Join Waitlist", 130, 38, "var(--brand-red)", "#ffffff", { fontSize: 13 }),
        ],
      }),
    ],
  });
}

function sectionHeading(title, subtitle = "", width = 1200) {
  return frame("Section Heading", width, subtitle ? 90 : 56, "transparent", {
    layout: "vertical",
    alignItems: "center",
    gap: 8,
    children: [
      text("Title", title, { fill: "var(--text-dark)", fontSize: 36, fontWeight: 700, fontFamily: "Bricolage Grotesque", textAlign: "center", width }),
      ...(subtitle ? [text("Subtitle", subtitle, { fill: "var(--text-muted)", fontSize: 16, textAlign: "center", width })] : []),
    ],
  });
}

// ── Section: Hero ────────────────────────────────────────────────────

function heroSection() {
  return frame("Hero Section", 1440, 820, "#0b0b10", {
    clipsContent: true,
    layout: "vertical",
    alignItems: "center",
    padding: [20, 0, 0, 0],
    children: [
      // Grid overlay (subtle dot texture using small rects)
      rect("Grid Overlay", 1440, 820, "transparent", { id: "grid-overlay" }),
      // Radial glow
      rect("Radial Glow", 800, 600, "transparent", { id: "radial-glow" }),
      // Dome bottom shape (white arc blending into next section)
      rect("Dome Bottom", 1440, 120, "#ffffff", { cornerRadius: [0, 0, 60, 60], id: "dome-bottom" }),
      // Nav
      navBar(),
      // Center content
      frame("Hero Content", 800, 600, "transparent", {
        layout: "vertical",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        children: [
          // "Launching soon" tag-shaped badge
          frame("Launching Badge", 180, 36, "var(--brand-purple)", {
            cornerRadius: 9999,
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            children: [
              rect("Tag Mini", 14, 14, "transparent", { cornerRadius: 3, id: "tag-mini" }),
              text("Badge Text", "Launching soon", { fill: "#ffffff", fontSize: 12, fontWeight: 600, textGrowth: "fixed-width", width: 110, letterSpacing: "0.05em" }),
            ],
          }),
          // Headline with mixed opacity
          text("Headline White", "Student marketplace", {
            fill: "#ffffff", fontSize: 68, fontWeight: 700, fontFamily: "Bricolage Grotesque",
            textAlign: "center", width: 750, lineHeight: 1.1,
          }),
          text("Headline Muted", "Coming to your campus.", {
            fill: "#6e6e73", fontSize: 68, fontWeight: 700, fontFamily: "Bricolage Grotesque",
            textAlign: "center", width: 750, lineHeight: 1.1,
          }),
          // Subtitle
          text("Subtitle", "The easiest way to buy and sell textbooks, gadgets, food, and services with real students on your campus.", {
            fill: "#9e9ea0", fontSize: 18, fontWeight: 400, textAlign: "center", width: 560, lineHeight: 1.5,
          }),
          // CTA buttons
          frame("CTA Row", 440, 56, "transparent", {
            layout: "horizontal", gap: 16, alignItems: "center", justifyContent: "center",
            children: [
              pillButton("Join as a Buyer", 210, 54, "var(--brand-red)", "#ffffff", { fontSize: 16 }),
              pillButton("Become a Seller", 210, 54, "transparent", "#ffffff", { stroke: "#ffffff40", strokeWidth: 1.5, fontSize: 16 }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ── Section: How It Works ────────────────────────────────────────────

function howItWorksSection() {
  const steps = [
    { num: "01", title: "Join the waitlist", desc: "Sign up as a buyer or seller in under a minute. No fees, no commitments." },
    { num: "02", title: "Get notified at launch", desc: "We'll email you the moment your campus goes live. Be first in." },
    { num: "03", title: "Start buying or selling", desc: "Browse listings or post your own. Campus commerce, made simple." },
  ];

  const stepCards = steps.map((s, i) =>
    frame(`Step ${i + 1}`, 360, 280, "var(--bg-white)", {
      cornerRadius: 24,
      stroke: "var(--border)",
      strokeWidth: 1,
      layout: "vertical",
      gap: 16,
      padding: [32, 28],
      children: [
        frame("Header Row", 0, 40, "transparent", {
          layout: "horizontal", gap: 12, alignItems: "center",
          children: [
            rect("Tag Marker", 36, 36, "var(--brand-purple)", { cornerRadius: 10 }),
            text("Step Num", s.num, { fill: "var(--brand-purple)", fontSize: 28, fontWeight: 700, fontFamily: "Bricolage Grotesque", width: 50, textGrowth: "fixed-width" }),
          ],
        }),
        text("Step Title", s.title, { fill: "var(--text-dark)", fontSize: 20, fontWeight: 600, fontFamily: "Bricolage Grotesque", width: 300 }),
        text("Step Desc", s.desc, { fill: "var(--text-muted)", fontSize: 14, width: 300, lineHeight: 1.6 }),
      ],
    })
  );

  return frame("How It Works Section", 1440, 580, "#ffffff", {
    layout: "vertical",
    alignItems: "center",
    padding: [80, 0, 80, 0],
    children: [
      sectionHeading("How it works", "Three simple steps to get started on Soldbay."),
      frame("Steps Row", 1200, 320, "transparent", {
        layout: "horizontal", gap: 40, alignItems: "flex-start", justifyContent: "center",
        children: stepCards,
      }),
    ],
  });
}

// ── Section: Social Proof ────────────────────────────────────────────

function socialProofSection() {
  return frame("Social Proof Section", 1440, 360, "#f5f5f7", {
    layout: "vertical",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    children: [
      text("Count", "2,847+", {
        fill: "var(--brand-purple)", fontSize: 72, fontWeight: 700, fontFamily: "Bricolage Grotesque",
        textAlign: "center", width: 600, lineHeight: 1,
      }),
      text("Label", "students already joined", {
        fill: "var(--text-dark)", fontSize: 24, fontWeight: 600, fontFamily: "Bricolage Grotesque",
        textAlign: "center", width: 500,
      }),
      text("Subtitle", "From universities across Nigeria — waiting for Soldbay to launch on their campus.", {
        fill: "var(--text-muted)", fontSize: 16, textAlign: "center", width: 500,
      }),
    ],
  });
}

// ── Section: FAQ ─────────────────────────────────────────────────────

function faqSection() {
  const items = [
    { q: "Is it free to use?", a: "Yes! Soldbay is completely free to join. There are no listing fees, subscription costs, or hidden charges." },
    { q: "How do payments work?", a: "Payments are handled securely in-app. We're integrating Paystack for seamless Nigerian bank transfers, card payments, and USSD." },
    { q: "Is delivery available?", a: "Delivery depends on the seller. Many students offer campus drop-off or safe meet-ups. We're working on a campus delivery network for launch." },
    { q: "Can I meet on campus to exchange?", a: "Absolutely. We encourage safe, public meet-ups on campus. Always meet in a well-lit area and bring a friend if possible." },
    { q: "How do you prevent scams?", a: "All users are verified with their student email. Buyers and sellers rate each other after every transaction, and our team reviews flagged listings." },
  ];

  return frame("FAQ Section", 1440, 640, "#ffffff", {
    layout: "vertical",
    alignItems: "center",
    padding: [80, 0, 80, 0],
    children: [
      sectionHeading("Frequently asked questions"),
      frame("Accordion List", 720, 420, "transparent", {
        layout: "vertical",
        children: items.map((item, i) => accordionItem(item.q, item.a, i === items.length - 1)),
      }),
    ],
  });
}

// ── Section: Footer ──────────────────────────────────────────────────

function footerSection() {
  return frame("Footer", 1440, 280, "#0b0b10", {
    layout: "vertical",
    alignItems: "center",
    padding: [60, 120, 40, 120],
    children: [
      frame("Footer Content", 1200, 160, "transparent", {
        layout: "horizontal",
        justifyContent: "space-between",
        children: [
          // Left: Brand
          frame("Footer Brand", 300, 120, "transparent", {
            layout: "vertical",
            gap: 12,
            children: [
              frame("Logo Row", 140, 32, "transparent", {
                layout: "horizontal", gap: 10, alignItems: "center",
                children: [
                  rect("Tag Mark", 24, 24, "var(--brand-purple)", { cornerRadius: 5 }),
                  text("Soldbay", "Soldbay", { fill: "#ffffff", fontSize: 18, fontWeight: 700, fontFamily: "Bricolage Grotesque", width: 100, textGrowth: "fixed-width" }),
                ],
              }),
              text("Tagline", "The student marketplace.", { fill: "#6e6e73", fontSize: 14, width: 240 }),
              text("Copyright", "© 2025 Soldbay. All rights reserved.", { fill: "#6e6e73", fontSize: 12, width: 240 }),
            ],
          }),
          // Right: Links
          frame("Footer Links", 400, 120, "transparent", {
            layout: "horizontal",
            gap: 60,
            children: [
              frame("Col 1", 120, 120, "transparent", {
                layout: "vertical", gap: 12,
                children: [
                  text("H1", "For Students", { fill: "#ffffff", fontSize: 14, fontWeight: 600, width: 120 }),
                  text("L1", "Join as Buyer", { fill: "#6e6e73", fontSize: 13, width: 120 }),
                  text("L2", "Become a Seller", { fill: "#6e6e73", fontSize: 13, width: 120 }),
                ],
              }),
              frame("Col 2", 120, 120, "transparent", {
                layout: "vertical", gap: 12,
                children: [
                  text("H2", "Company", { fill: "#ffffff", fontSize: 14, fontWeight: 600, width: 120 }),
                  text("L3", "Privacy Policy", { fill: "#6e6e73", fontSize: 13, width: 120 }),
                  text("L4", "Terms of Service", { fill: "#6e6e73", fontSize: 13, width: 120 }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ── Screen: Landing Page ─────────────────────────────────────────────

function landingPage() {
  return frame("Landing Page", 1440, 2700, "var(--bg-white)", {
    clipsContent: true,
    layout: "vertical",
    children: [
      heroSection(),
      howItWorksSection(),
      socialProofSection(),
      faqSection(),
      footerSection(),
    ],
  });
}

// ── Screen: Buyer Waitlist Form ──────────────────────────────────────

function buyerWaitlistForm() {
  return frame("Buyer Waitlist", 1440, 1200, "#0b0b10", {
    layout: "vertical",
    alignItems: "center",
    padding: [60, 120, 60, 120],
    children: [
      frame("Form Card", 600, 1040, "#ffffff", {
        cornerRadius: 24,
        layout: "vertical",
        gap: 20,
        padding: [48, 48],
        children: [
          text("Form Title", "Join as a Buyer", { fill: "var(--text-dark)", fontSize: 28, fontWeight: 700, fontFamily: "Bricolage Grotesque", width: 500 }),
          text("Form Subtitle", "Get notified when Soldbay launches on your campus.", { fill: "var(--text-muted)", fontSize: 14, width: 500 }),
          inputField("Full Name", "Enter your full name", 500),
          inputField("Email Address", "you@university.edu.ng", 500),
          dropdownField("University", "Select your university", ["Unilag", "UI", "OAU", "UNN", "ABU", "Other"], 500),
          dropdownField("Academic Level", "Select your level", ["100L", "200L", "300L", "400L", "500L", "Postgraduate"], 500),
          // Category chips
          frame("Categories Field", 500, 100, "transparent", {
            layout: "vertical", gap: 8,
            children: [
              text("Cat Label", "Interested Categories", { fill: "var(--text-dark)", fontSize: 14, fontWeight: 500, width: 500 }),
              frame("Chips Row", 500, 68, "transparent", {
                layout: "horizontal", gap: 8, alignItems: "flex-start",
                children: [
                  chip("Textbooks", true),
                  chip("Electronics"),
                  chip("Fashion"),
                  chip("Food & Drinks"),
                  chip("Services"),
                  chip("Housing"),
                ],
              }),
            ],
          }),
          // Poll question
          frame("Poll Field", 500, 200, "transparent", {
            layout: "vertical", gap: 10,
            children: [
              text("Poll Q", "What matters most to you as a buyer?", { fill: "var(--text-dark)", fontSize: 14, fontWeight: 500, width: 500 }),
              checkbox("Verified sellers"),
              checkbox("Secure payments"),
              checkbox("Campus delivery"),
              checkbox("In-app chat"),
              checkbox("Buyer protection"),
            ],
          }),
          pillButton("Join Waitlist →", 500, 52, "var(--brand-red)", "#ffffff", { fontSize: 16 }),
        ],
      }),
    ],
  });
}

// ── Screen: Seller Waitlist Form ─────────────────────────────────────

function sellerWaitlistForm() {
  return frame("Seller Waitlist", 1440, 1200, "#0b0b10", {
    layout: "vertical",
    alignItems: "center",
    padding: [60, 120, 60, 120],
    children: [
      frame("Form Card", 600, 1040, "#ffffff", {
        cornerRadius: 24,
        layout: "vertical",
        gap: 20,
        padding: [48, 48],
        children: [
          text("Form Title", "Become a Seller", { fill: "var(--text-dark)", fontSize: 28, fontWeight: 700, fontFamily: "Bricolage Grotesque", width: 500 }),
          text("Form Subtitle", "Start selling to students on your campus.", { fill: "var(--text-muted)", fontSize: 14, width: 500 }),
          inputField("Full Name", "Enter your full name", 500),
          inputField("Email Address", "you@university.edu.ng", 500),
          dropdownField("University", "Select your university", ["Unilag", "UI", "OAU", "UNN", "ABU", "Other"], 500),
          inputField("What do you sell?", "e.g. textbooks, gadgets, fashion, snacks", 500),
          dropdownField("How often would you sell?", "Select frequency", ["Daily", "Weekly", "Occasionally"], 500),
          // Poll question
          frame("Poll Field", 500, 200, "transparent", {
            layout: "vertical", gap: 10,
            children: [
              text("Poll Q", "What matters most to you as a seller?", { fill: "var(--text-dark)", fontSize: 14, fontWeight: 500, width: 500 }),
              checkbox("Easy listings"),
              checkbox("Fast payouts"),
              checkbox("Buyer reach"),
              checkbox("Secure payments"),
              checkbox("In-app chat"),
            ],
          }),
          pillButton("Join Waitlist →", 500, 52, "var(--brand-red)", "#ffffff", { fontSize: 16 }),
        ],
      }),
    ],
  });
}

// ── Screen: Success Screen ───────────────────────────────────────────

function successScreen() {
  return frame("Success Screen", 1440, 800, "#0b0b10", {
    layout: "vertical",
    alignItems: "center",
    justifyContent: "center",
    padding: [60, 120],
    children: [
      frame("Success Card", 520, 520, "#ffffff", {
        cornerRadius: 24,
        layout: "vertical",
        alignItems: "center",
        gap: 20,
        padding: [64, 48],
        children: [
          // Checkmark circle
          frame("Checkmark", 72, 72, "var(--success)", {
            cornerRadius: 36,
            alignItems: "center",
            justifyContent: "center",
            children: [text("✓", "✓", { fill: "#ffffff", fontSize: 32, fontWeight: 700, textGrowth: "fixed-width", width: 32, textAlign: "center" })],
          }),
          text("Title", "You're on the list!", { fill: "var(--text-dark)", fontSize: 32, fontWeight: 700, fontFamily: "Bricolage Grotesque", textAlign: "center", width: 400 }),
          text("Message", "We'll notify you when Soldbay launches on your campus. Hang tight — we'll be there soon.", { fill: "var(--text-muted)", fontSize: 16, textAlign: "center", width: 400, lineHeight: 1.6 }),
          rect("Divider", 400, 1, "var(--border)"),
          text("Share Prompt", "Tell your campus friends", { fill: "var(--text-dark)", fontSize: 14, fontWeight: 600, textAlign: "center", width: 400 }),
          frame("Share Row", 200, 40, "transparent", {
            layout: "horizontal", gap: 12, justifyContent: "center",
            children: [
              frame("Share WhatsApp", 40, 40, "var(--success)", { cornerRadius: 20 }),
              frame("Share Twitter", 40, 40, "var(--info)", { cornerRadius: 20 }),
              frame("Share Copy", 40, 40, "var(--brand-purple)", { cornerRadius: 20 }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ── Assemble Document ────────────────────────────────────────────────

const VARIABLES = {
  "--brand-purple": { type: "color", value: [{ value: "#5b3df0" }] },
  "--brand-blue": { type: "color", value: [{ value: "#4527c8" }] },
  "--brand-red": { type: "color", value: [{ value: "#e1261c" }] },
  "--bg-dark": { type: "color", value: [{ value: "#0b0b10" }] },
  "--bg-white": { type: "color", value: [{ value: "#ffffff" }] },
  "--text-white": { type: "color", value: [{ value: "#ffffff" }] },
  "--text-dark": { type: "color", value: [{ value: "#1d1d1f" }] },
  "--text-muted": { type: "color", value: [{ value: "#6e6e73" }] },
  "--text-gray": { type: "color", value: [{ value: "#9e9ea0" }] },
  "--border": { type: "color", value: [{ value: "#d2d2d7" }] },
  "--success": { type: "color", value: [{ value: "#16a34a" }] },
  "--info": { type: "color", value: [{ value: "#2563eb" }] },
  "--radius": { type: "number", value: [{ value: 10 }] },
};

const screens = [
  landingPage(),
  buyerWaitlistForm(),
  sellerWaitlistForm(),
  successScreen(),
];

const doc = {
  version: 1,
  fileToken: `sb${Math.random().toString(36).slice(2, 8)}`,
  variables: VARIABLES,
  children: screens,
};

const outPath = new URL("soldbay-landing.pen", import.meta.url);
writeFileSync(outPath, JSON.stringify(doc, null, 2));
console.log(`Written ${outPath.pathname}`);
console.log(`Screens: ${screens.length}`);
console.log(`Variables: ${Object.keys(VARIABLES).length}`);
