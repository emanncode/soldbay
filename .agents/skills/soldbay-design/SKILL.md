---
name: soldbay-design
description: Master design rules, accessibility, and UI generation config for the Soldbay project. Use this when designing UI screens or components for Soldbay.
---

# Soldbay UI Design Skill

This skill dictates how to design and build UI for the Soldbay project. It serves as the persistent agent configuration for generating, reviewing, and extending Soldbay's UI components and screens.

## Core Directives

1. **Token Source of Truth**:
   - ALWAYS use `soldbay-design-system.html` as the ONLY source for design tokens (colors, typography, spacing, radius, elevation).
   - **Never** invent new colors, sizes, or spacing on the fly.
2. **Search Real References First**:
   - Before writing or executing any visual-design prompt, search for real human-made references (e.g., Depop, Vinted, Jiji, Jumia).
   - Pick 1-2 real structural/behavioral references and adapt them. Never generate purely from judgment.
3. **Design Execution in design.pen**:
   - DO NOT use image generation tools to create static image visuals.
   - Mobile components and screens must be assembled by writing/modifying code directly in the opened `design.pen` environment where the components are ready.
4. **Agent Extensions Allowed**:
   - You are encouraged to flag your own reasonable extensions or bonus patterns explicitly (e.g., adding an Action Bar composite or a chat-header pattern if it adds value) rather than silently deviating from a prompt.

## Accessibility & Semantic Color Discipline (from Ace Doc)

- **60/30/10 Proportion**: Maintain balanced color proportion across screens.
- **WCAG Contrast**:
  - Ensure AA/AAA contrast minimums depending on role.
  - Body text must meet AAA. Accents can meet AA-large.
- **Color-Blindness**: Test and ensure color-blindness accessibility.
- **Never rely on color alone**: Color must never be the only indicator of state or meaning.
- **Semantic-color discipline**:
  - **Toast/Banner**: Full-strength semantic fill + white text.
  - **Inline/Embedded context box**: 12% tint of semantic color + colored text.
  - **Brand Accent**: Never repurpose a brand accent color (e.g., `#F47A32`) as a semantic or status color.

## Self-Check / Validation Before Review

When generating screens or components, self-check against:

- The exact prompt requirements (e.g., from the "Screen Design Prompts — Next 10" backlog).
- The Design System Reference (`soldbay-design-system.html`).
- The Accessibility and Semantic Color rules listed above.
- Screen Flow (IA) constraints (e.g., ensuring no non-MVP features like cart or social SSO are added).

## Continuation Workflow

When continuing design work:

1. Check the **Feature/Workflow Inventory** (finalized MVP triage).
2. Follow the **Screen Flow (IA)** and **Screen Build Order (Re-Sequenced)**.
3. Use the **Remaining Component Prompts — Backlog** for explicit component design prompts.
4. Use the **Screen Design Prompts — Next 10 (Ready for Agy)** for explicit screen generation prompts.
5. Lock decisions into Linear (or local tracking docs) once made.

_(Reference Linear Documents: `bd758cd51524`, `6dd4a0b360e7`, `e9d3cf4b4e09`)_
