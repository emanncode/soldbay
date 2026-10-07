---
name: soldbay-workflow
description: Information about Workflow & Continuation Guide for Soldbay
---
Durable process doc — read this first, before anything else on Soldbay. It is a map to the other docs plus the rules that have already cost time when missed. Everything referenced lives in this Linear project (AllOnSoldBay, team EmannCode).

## What Soldbay is (one line)

A single-campus, single-unit, student-to-student marketplace app for Nigerian universities — buy-now only (no cart), escrow-held payments, PIN-based in-person handoff as the core trust mechanism. Every account starts as a buyer; selling is a verified upgrade.

## Current phase (as of 30-09-26)

**Design phase: complete and locked** for all 15 mobile MVP screens (light + dark), the component library, and 5 of 6 Admin/Ops screens. **One reopened item:** Admin/Ops Seller Verification (it shows both Student ID and Portal at once; the locked model is choose-one) — correction prompt is in "Admin/Ops — Screen Design Prompts".

**Now: real-code integration.** Locked decisions:

* Both repos' UI was cleared to a blank slate; backend (Prisma + Postgres) untouched.
* Build order: (1) React Native component library in `soldbay-app` → (2) app screens → (3) `soldbay-web` component library (shadcn/ui) → (4) Admin/Ops screens. Mobile fully done before web.
* Styling: NativeWind for the RN app, shadcn/ui for web.
* Pace: one component per chat/reply, no batching unless explicitly agreed.
* Dark mode: system-default only, no manual toggle (so NativeWind `darkMode: "media"`).
* **Verification method:** a component only counts as done after its actual `.tsx` file is diffed line-by-line against the real prototype HTML (`all-screens.html` / `all-screens-dark.html` / `component-library.html`) — never against a build-tool's own summary of its work.
* **Accessibility audit, locked 30-09-26:** a Python contrast/color-vision script re-tuned the semantic (success/warning/error/info) colors for both light and dark mode, and added two new tokens (`accentIcon`, `borderDarkSolid`) plus a new usage rule for full-strength solid borders. Full detail and the new hex values are in the Design System Reference. **Not yet applied to code or the HTML files** — see step 2 below.

## NEXT STEPS — do these in order

**1. Security fix (do this first, before anything else, not code-related):**
   a. Rotate the Linear API key in Linear's API settings — a plaintext key was found and used from `~/fetch_linear.js` on the local machine and is no longer safe to treat as private.
   b. Run `git log --all --full-history -- fetch_linear.js linear_project.json linear_docs.md linear_recent.json` in both repos. If any of those show up, they need removing from git history (not just the working tree) since they contain the key and/or full internal docs — `git filter-repo` or BFG Repo-Cleaner, not a plain `git rm`.

**2. Apply the 30-09-26 semantic-color update everywhere it needs to land** (values are in the Design System Reference's token table — apply from there, don't re-derive):
   a. `src/theme/tokens.js` — update `success`/`warning`/`error`/`info` and `darkSuccess`/`darkWarning`/`darkError`/`darkInfo` to the new hex values; add the two new tokens `accentIcon` (`#BE5F27`) and `borderDarkSolid` (`#5C8A8A`); `borderLightSolid` can just reference the existing `borderLight` value (`#008080`), no new hex needed.
   b. The three prototype HTML files' `:root` CSS variables for the four semantic colors (light and dark) — these are locked artifacts, so this edit itself needs to happen deliberately, not via an unattended script, and should be a clean, reviewable diff.
   c. Any status pill anywhere (HTML or `.tsx`) that doesn't yet pair its color with an icon needs one added — this is a hard accessibility requirement per the audit, not optional.

**3. Apply the 3 code fixes already identified and verified against the real HTML** (exact diffs are in the Component Inventory's CODE BUILD STATUS section — apply from there, don't re-derive):
   a. `TabBar.tsx` — inactive icon/text color: `borderLight` → `secondaryText` (light mode only; dark mode's `borderDark` is already correct).
   b. `SearchBar.tsx` — same fix, same reason: `borderLight` → `secondaryText` for the icon color in light mode.
   c. `ProductCard.tsx` — dark-mode border opacity: `border-borderDark/10` → `border-borderDark/24`.
   Do NOT touch anything else in these three files or in `ScreenHeader.tsx` — everything else in all four is confirmed correct against the real HTML.

**4. After steps 2 and 3, mark Tab bar, Screen header, Search bar, and Product card** `[X]` **in the Component Inventory's CODE BUILD STATUS section** (update the doc directly, don't leave the status only in chat).

**5. Next component to build (new, not a fix): Order/transaction card.** Follow the same process as every prior component: check the real HTML/CSS for it first (`.order-card` or equivalent in the three prototype files), search for real references if anything about its layout is still open, build it — using the updated semantic colors from step 2 for its four status states — then verify the finished file against the HTML before marking it done.

**6. In parallel, whenever convenient (not blocking the component work):**
   a. Check `docs/soldbay-design-system.md` and `src/theme/colors.ts` for the stale olive palette — still unconfirmed either way.
   b. Send the Admin/Ops Seller Verification correction prompt to Agy (already written, in "Admin/Ops — Screen Design Prompts") — this is the one remaining open design item. Note it will also need the new semantic colors if/when it's touched again.
   c. Decide the web landing + logo palette question (re-theme to Orange & Teal, or keep olive/cream as a deliberate separate marketing look) — a decision only Emann can make, not something to default on.

## UPDATE (reported, not yet verified)

Emann reports further local work has happened on the component-build phase since the 30-09-26 status above — exact scope unconfirmed from this session (no files were shared here). **Do not mark anything in NEXT STEPS or the Component Inventory's CODE BUILD STATUS as done based on this note alone.** Next session with access to the actual files (`soldbay-app` source and/or the three prototype HTML files) should open them directly, diff against this doc's NEXT STEPS list, and update statuses from that — per Rule 4 below.

## Which doc answers what (read in this order)

 1. **Project Overview** — what/why, surfaces, stack.
 2. **Feature/Workflow Inventory** — final MVP/Later/Cut scope. Not re-litigated elsewhere.
 3. **Screen Flow (IA)** + **Signup/Auth Rework** — mobile flows; the buyer-first model and the choose-one seller verification.
 4. **Screen Build Order (Re-Sequenced)** — screen order (design all `[X]`; code in progress, see Component Inventory).
 5. **Design System Reference** — locked tokens, the token → code map, the full 5-pattern screen-header audit, AND the accessibility-audit-driven semantic color update (30-09-26). Authoritative.
 6. **Component Inventory & Build Order** — design-locked component list AND the CODE BUILD STATUS section (what actually exists in code, verified or not, with exact fixes needed).
 7. **Admin/Ops Screen Flow (IA)** + **Admin/Ops — Screen Design Prompts** — the web admin surface.
 8. **MVP Scope & Decisions** — early scoping rationale (layout sharing, re-signup retention, messaging); the Inventory wins on conflicts.
 9. **Competitive Context & Differentiation** — research background.
10. **Daily Log (Web/Landing Build)** — HISTORICAL log of the olive-palette landing/web/logo work. Its palette is superseded; never take tokens from it.

## Rules that exist because they were missed

1. **Repo files are not a source of truth for design tokens.** `docs/soldbay-design-system.md`, `soldbay-app/tailwind.config.js` (replaced 28-09-26), `soldbay-app/src/theme/colors.ts`, `soldbay-web/src/app/globals.css`, and the shipped logo/icon assets were all generated from the OLD olive/tan/Manrope system. A build report saying "config is populated with the design tokens" is not evidence — open the file and diff it against the Design System Reference token map.
2. **Olive/tan/cream/Manrope must never appear in new code.** The superseded values are listed in the Design System Reference.
3. **Every code component is checked against four things before it counts as done:** tokens only (no hex literals), light + dark variants present, Sora type utilities only, Phosphor Regular inactive / Fill active. Track it in the Component Inventory's code-status section, not in chat.
4. **Verify claims against files, not summaries — including your own tool's summaries.** A general "make RN match the HTML" instruction, executed unattended across both the code and the three locked prototype HTML files, produced a self-report of "flawless 1-to-1 match" that was wrong on real, specific points (dark-mode text color, an icon, a border-radius). It also edited the locked HTML files directly with no corresponding Linear update. The fix isn't "don't trust build agents" — it's: after any batch of changes, re-open the actual files (both the code and, if touched, the HTML) and diff them against Linear yourself, per component, rather than accepting a summary of what was supposedly done.
5. **The three prototype HTML files (**`all-screens.html`**,** `all-screens-dark.html`**,** `component-library.html`**) are locked artifacts, not scratch files.** A change to them needs a corresponding Linear update in the same session — same rule as code.
6. **Cross-check any new doc or prompt against the most recent locked doc on the same topic** (e.g. the Admin verification error came from reusing older wording instead of the Signup/Auth Rework doc).
7. **A "universal" rule inferred from 2-3 examples is not verified — check every instance before writing it down as locked.** The wayfinding rule was wrong for exactly this reason (checked 3 of 22 screens, wrote a blanket rule); the corrected version in the Design System Reference is a full 22-screen audit with 5 actual patterns.
8. **A claimed result (a script output, a test run) gets run/re-checked, not just read, before it's locked.** The 30-09-26 accessibility audit was verified by actually re-running the submitted Python script and confirming its numbers, not just trusting the pasted summary of it — same principle as rule 4, applied to a quantitative claim instead of a "the code matches the design" claim.

## Doc hygiene

* Outdated or duplicate docs get renamed with a `DELETE —` prefix in the title; Emann deletes them. Claude does not delete Linear docs.
* Docs that are kept but partly stale get an explicit status line at the top saying what is current and what is superseded.
* Genuinely new decisions are written into the relevant doc (Design System Reference for tokens, the IA docs for flows) immediately, not left in chat.

## Continuation message for a new chat

"Continuing Soldbay work — real-code integration into soldbay-app (React Native/Expo + NativeWind). Check memory for context, then check the AllOnSoldBay Linear project (EmannCode team) and read the Workflow & Continuation Guide first — the 'NEXT STEPS' section says exactly what to do and in what order — then the Design System Reference's 'READ THIS FIRST — before writing any code' section."

## Design-phase workflow (for any remaining design touch-ups, e.g. the reopened Verification screen)

1. Claude writes a design prompt for one component/screen, referencing the locked Design System Reference and the real prototype HTML for every token.
2. Real references get searched first — pick 1–2 real ones, adapt, never invent purely from judgment.
3. Emann runs the prompt through Agy.
4. Claude reviews the returned files against the prompt, the locked tokens, and accessibility rules — by opening the actual returned file, not by reading a summary of it; corrections go back as targeted follow-ups with exact before/after code.
5. Once correct it is marked locked in the relevant doc.

## VERIFIED 03-10-26 — actual files reviewed, not a summary

Emann shared the real files (`tokens.js`, `ProductCard.tsx`, `SearchBar.tsx`, `TabBar.tsx`, `OrderCard.tsx`, plus current `all-screens.html`/`all-screens-dark.html`/`component-library.html`). Diffed line-by-line per Rule 4.

**Confirmed correct — mark these done:**

* `tokens.js` — exact match to the locked 30-09-26 table, both new tokens correct.
* `TabBar.tsx` and `SearchBar.tsx` — both fixes verified correct against the real `.nav-item`/`.search-bar i` CSS rules.
* `ProductCard.tsx` — code itself is correct (`/24` dark border).
* `OrderCard.tsx` (new component, step 5) — built correctly. Dark-mode status-pill text color (`darkBg` not white) is actually *required*, not a stylistic choice — computed contrast of white-on-`darkSuccess` is \~1.3:1, a severe fail; the Design System doc's claim that all four dark semantic colors "pass 4.5:1 with white" is wrong and needs correcting there. OrderCard.tsx's semantic color mapping (pending_pickup→info, awaiting_handoff→warning, completed→success, disputed→error) is correct and matches the original locked spec.

**New issues found (not previously known, found by diffing — none of these are Emann's or the code's fault, they're drift in the reference HTML files):**

1. `all-screens-dark.html`'s `.product-card` border is still hardcoded `rgba(103,184,179,0.1)` at the CSS source — should be `/0.24` to match both the Design System doc and the now-correct `ProductCard.tsx`. The code is right; the "source of truth" HTML is stale.
2. 7 leftover hardcoded `rgba()` inline tints across all three HTML files still use pre-30-09-26 semantic hex values even though the `:root` vars were correctly updated: `all-screens.html` lines 380 (`rgba(107,78,0,...)`, old warning) and 2442 (`rgba(20,83,45,...)`, old success); `all-screens-dark.html` lines 1649 (`rgba(248,113,113,...)`, old darkError) and 2483 (`rgba(74,222,128,...)`, old darkSuccess); `component-library.html` lines 392 (old warning), 1384 and 2133 (old darkError, twice). Each needs updating to the new corresponding hex (see Design System Reference token table).
3. `component-library.html`'s own "Order/Transaction Card" reference (around line 1086-1131, and its dark-mode duplicate) has two bugs: "Pending pickup" uses class `status-warning` instead of `status-info` (a working `.status-info` class exists, unused), and "Awaiting handoff" uses a hardcoded off-palette `background:#d97706` instead of any token at all. **Fix the HTML to match the code, not the other way around** — `OrderCard.tsx` already has the correct mapping.
4. Minor hygiene, not a bug: `all-screens-dark.html`'s `.status-pill` rule has a redundant dead `color: white` line after a `color: #031f21 !important` — the `!important` wins so it renders correctly, but the dead line should be deleted for clarity.

**NEXT STEPS update:** steps 2a and 3(a-c) from the 30-09-26 list above are DONE (verified, not just reported). Still open: step 2b (apply semantic colors to the HTML files) is partially done — `:root` vars are correct but see issue #2 above for the leftover stale inline values. Order/transaction card (step 5) is built and correct in code; its HTML reference needs the fix in issue #3 first so the two stay in sync.
