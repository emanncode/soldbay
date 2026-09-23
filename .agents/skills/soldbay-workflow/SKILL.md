---
name: soldbay-workflow
description: Defines the canonical workflow, build order, and source of truth navigation for Soldbay. Read this to understand how to continue work on the Soldbay project seamlessly.
---

# Soldbay Workflow & Continuation Guide

This skill maps what's been done, how it's been done, and how to continue working on Soldbay without needing everything re-explained from scratch.

## What Soldbay Is

A single-campus, single-unit, student-to-student marketplace app for Nigerian universities — buy-now only (no cart), escrow-held payments, PIN-based in-person handoff as the core trust mechanism.

## Source of Truth Hierarchy

When continuing work, consult the following sources in order:

1. **Feature/Workflow Inventory**: The ultimate MVP/Later/Cut triage. Scope is settled here.
2. **Screen Flow (IA)**: How screens connect (buyer, seller, shared flows).
3. **Design System Reference (`soldbay-design-system.html`)**: Colors, Typography, Spacing, Radius, Elevation. All locked.
4. **Component Inventory & Build Order**: What's built/locked vs. pending.
5. **Screen Build Order (Re-Sequenced)**: The current screen-level build order derived from MVP triage + Screen Flow. (Tiers 1-3 doc is superseded).
6. **Ace Design Principles**: 60/30/10 rules, WCAG contrast, semantic color naming, progressive disclosure.

## The Design & Build Workflow

1. **Design Execution**: DO NOT use image generation tools. Designs are built by writing/updating code directly inside the opened `design.pen` file where components are ready. Use `soldbay-design-system.html` for ALL tokens. Do not invent new colors/sizes.
2. **Reference Search**: Search for real shipped apps (Depop, Vinted, Jiji) for structural/behavioral references before starting the design.
3. **Agent Rendering**: Assemble the design inside `design.pen`. Evaluate and keep any reasonable bonus patterns if they are genuinely useful.
4. **Review & Correct**: Review the coded design against requirements, locked Design System tokens, and accessibility rules.
5. **Lock Decisions**: Mark `[X]` in the Component Inventory when done. Write any new decisions directly into the Design System Reference doc.
6. **No Image Generation**: Do not create or generate static images for design visuals. Always code the layout directly in `design.pen`.

## Why This Workflow?

- **Batching**: Batching related components into one Agy pass and reviewing them together is cheaper and faster.
- **Direct Reading**: Reading the Linear docs directly (or these skills) keeps sessions efficient without needing summaries.
- **Locking in Linear**: Locking decisions into Linear/docs immediately prevents context loss if a session drops.

## Screen Build Order

The current priority sequence for screen design passes:

**Tier 1 — Buyer core loop**

1. [x] Feed/Browse
2. [X] Search & Filters
3. Product Detail
4. Checkout
5. Pickup-Window Selection
6. Order Status + Handoff
7. Messaging/Chat
8. Rate & Review
9. Notifications

**Tier 2 — Onboarding, seller side, shared account screens**

- Signup/Auth
- Create/Edit Listing (seller)
- Seller Dashboard
- Profile/Settings
- Wallet/Ledger (seller)

**Tier 3 — Lower frequency**

- Dispute Flow

_(Reference Linear Documents: `bd758cd51524`, `6dd4a0b360e7`, `e9d3cf4b4e09`)_
