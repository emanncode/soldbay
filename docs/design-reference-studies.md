# Soldbay Visual Reference Studies — Stage 04, Step 03 onward

**Status:** The approved MVP visual direction is calm and scannable, image-led with consistent listing comparison facts, and selectively editorial. The former territory, foundation-option, and synthetic buyer-feed visuals have been cleared from the active Pencil canvas by the owner; no palette, typeface, shape, icon, or component appearance is approved. Candidate principles are being consolidated in [`visual-principles.md`](visual-principles.md). The five source-faithful studies remain as the reference base; Soldbay screens remain open.
**Product authority:** [`architecture.md`](architecture.md), current AllOnSoldBay product workflows/IA, and [`screen-architecture.md`](screen-architecture.md).
**Method authority:** The shared `design-methodology` skill and its `DESIGN_PLAYBOOK.md`.
**Artifact boundary:** Keep research notes, decisions, and screen specifications in Markdown. Use `design/soldbay-design-documentation.pen` for visual reference reconstructions and later design artifacts, not explanatory text boards.

## What is already settled

- The PSS and current IA define Soldbay behavior, permissions, transaction rules, and role boundaries. Visual reference products must not redefine those rules.
- The Step 08 screen-inventory baseline is approved as a coverage map. It does not approve layouts, tab labels, or final screen compositions.
- `docs/component-architecture.md` records the conceptual component inventory and behavior requirements. Its former visual specimens were rejected; component appearance remains open.
- The former Grounded Market territory and Step 04 visual foundation set are historical only. Do not use their colors, typography, shapes, motion values, or composition as current direction.
- Student interviews were scrapped and were not conducted. A visual reference study is not user research or validation.
- The owner has rejected Jiji and Jumia as visual references because their UI/visual feel does not meet the quality bar. Do not use their screens, branding, or overall look to guide Soldbay's theme or components.
- The owner wants broad, iterative exploration across multiple accessible sources. Pixlpin is one useful source, not the authority or sole source; one screen or one product cannot settle Soldbay's taste or theme.
- The owner approved a high-level MVP direction synthesized from the five references: calm, scannable, image-led, product-first, with selective editorial emphasis. This direction does not approve any source screen, palette, typeface, shape, component styling, or full app theme treatment.
- Local popularity is not a selection requirement. A lesser-known product or source remains eligible when its screen is visually useful and clearly evidenced.
- The owner wants a consistent device screen silhouette in mobile studies. Current studies use the same rounded screen mask for comparison; this is a presentation convention, not a claim that every iPhone has an identical physical corner radius. Real screen curvature varies by device, and the mask is not an in-app component.

## Required sequence

1. **Specify the Soldbay task first.** For each inventory item, document its user, goal, entry/context, information, actions, permissions, important states, next/return route, and constraints from the PSS.
2. **Find real examples for that task or component across sources.** Search one pattern at a time using task names and useful synonyms. Visual quality is a gate: category similarity alone does not make a product a useful visual reference. Exclude Jiji and Jumia from visual research. Use whichever accessible sources provide useful evidence: Pixlpin, UIguana, Mobbin's free plan, other free libraries, task-based web search, official product material, and live apps. Do not make one platform or product the default authority.
3. **Record what was actually seen.** For every source, record product, exact screen/task, platform, source URL, viewport when known, access date, direct observations, access limits, and any unverified details. When a library is only a discovery index, follow its attribution/source link where possible and record the original source. Do not infer interaction, animation, or success from a static image, or assume a reference library grants reuse rights.
4. **Make a source-faithful visual study in Pencil.** Recreate one selected real screen as closely as the available evidence allows, including visible OS status indicators, safe areas, app viewport, and bottom system area/home indicator. Label it as a reference study with its source; do not present it as Soldbay UI. Do not invent hidden states or details absent from the source.
5. **Critique and compare references.** Record what demonstrates craft, what does not fit Soldbay, which principles could transfer, and what must be rejected because of the PSS, audience/context, accessibility, or brand constraints. Do not copy the full screen into Soldbay.
6. **Define visual principles before foundations.** Build taste through sourced study and critique; write practical principles tied to Soldbay tasks; review and approve those principles; then derive a product-wide theme and concrete color, type, spacing, shape, imagery, and icon foundations. The high-level direction is approved, but detailed visual rules and foundations are not. If the owner is not satisfied, continue discovery or revise the principles. Do not promote historical values or study artifacts to current tokens.
7. **Derive the component system from the flow.** Map recurring controls, content structures, and states from the approved screen inventory and PSS, informed by selected reference principles and platform guidance. Record behavior/specifications in Markdown and make visual component studies in Pencil only after the theme is approved.
8. **Compose Soldbay screens after the gates.** Build product screens from the approved task specifications, theme, and component system. Use source examples as bounded references, not as a substitute for Soldbay workflows or product screens.

## Study record template

For each source, add a dated entry with:

- **Product / source / URL / access date:**
- **Screen or component / task:**
- **Platform / viewport / OS context:**
- **What was directly observed:**
- **Access and evidence limits:**
- **What works and why:**
- **What does not fit Soldbay:**
- **Principles to adapt or reject, and why:**
- **Pencil study frame name:**
- **Owner decision:** pending / accepted as a study / principles selected / rejected

Do not mark a reference as selected merely because it was reconstructed. Reference selection does not approve a Soldbay screen, establish user preference, or validate usability.

## Research log — 2026-11-08

### Rejected: Jiji Nigeria browse feed (Android)

- **Product / source / URL / access date:** Jiji Nigeria, official Google Play listing: [Jiji Nigeria: Buy&Sell Online](https://play.google.com/store/apps/details?id=ng.jiji.app); accessed 2026-11-08. The listing's second screenshot asset is a promotional composite headed “Browse over 2,000,000 ads.”
- **Screen or component / task:** Buyer browse-feed product-grid pattern.
- **Platform / viewport / OS context:** Android app screenshot embedded in a Google Play promo image. The source image is portrait; the embedded app viewport is shown much smaller inside the promo artwork. Status bar, safe areas, and bottom system area are not clearly evidenced.
- **What was directly observed:** A green app header; a search field; small view/filter or category controls; a “Recommended” sort label; and a two-column product grid with image-led cards and visible price text. Sample categories shown include a vehicle, laptop, and clothing.
- **Access and evidence limits:** The official screenshot is a marketing composite, not an unframed app capture. At the available rendered size, exact labels, spacing, typography, card content, and OS chrome cannot be read reliably. Static image only; interactions are unknown.
- **What works and why:** No visual qualities are being promoted from this rejected source.
- **What does not fit Soldbay:** The owner rejects Jiji's overall UI/visual feel; this image also comes from a broad national classifieds marketplace and does not evidence Soldbay's campus-scoped inventory or protected order and handoff flow.
- **Principles to adapt or reject, and why:** None selected. Do not reconstruct, adapt, or use this source as a visual precedent.
- **Pencil study frame name:** None. No frame created.
- **Owner decision:** Rejected on 2026-11-08. The owner considers Jiji's UI and visual feel too poor for Soldbay reference work. Do not use this screen as a visual precedent.

### Free-first, multi-source discovery

- **Pixlpin:** One strong free discovery source, not the sole source. Its [published library page](https://pixlpin.com/articles/free-design-library-real-app-screens) says browsing is free; a free account unlocks continued browsing and saving. In the browse-and-discover screen index, the first 80 results were visible before a free-account prompt. Verify access and page contents when a specific study begins because service terms and limits can change.
- **UIguana:** A second free-first source. [Its site](https://uiguana.com/) describes the library as free and organizes real app screenshots into flows; coverage is smaller than Pixlpin's, so use it when it contains a relevant pattern.
- **Mobbin:** Optional source when its [limited free plan](https://mobbin.com/blog/mobbin-vs-page-flows) exposes the needed screen. Do not make a paid plan necessary for this workflow.
- **Other discovery sources:** Explore additional free libraries as useful. Treat concept galleries and UI kits as style/craft inspiration only unless they clearly identify a real product, screen, and source.
- **Open-web search:** Search by task and pattern, then inspect the original product or creator source when available. Initial terms: `mobile marketplace browse feed product grid app screen`, `marketplace product detail mobile app screen`, `secondhand listing card app UI`, `offer negotiation chat marketplace app screen`, `buyer order tracking mobile app screen`, and `delivery handoff confirmation app screen`.
- **Quality check:** Reject promotional composites, generic UI-kit mockups, and examples whose actual interface cannot be inspected clearly. A source must show enough visual detail to reproduce only what is evidenced, including platform chrome where visible; otherwise log it as a lead and keep searching.
- **Iteration:** Keep multiple candidates open across products/platforms. If the owner rejects the current references or is not satisfied with an explored theme, record the rejection, update search terms if useful, and continue sourcing. A rejected direction is not a reason to defend it or stop exploration.

### Candidate: Airbnb home explore feed (iOS)

- **Product / source / URL / access date:** Airbnb screen listed in Pixlpin's [Browse and Discover screen library](https://pixlpin.com/apps/airbnb-dpfi?type=browse-and-discover&screen=01M4YWEFZKQPVCAC835FF3EXY3); accessed 2026-11-08. Pixlpin is the discovery source; the exact capture version/date and a direct Airbnb source link were not visible in the inspected view.
- **Screen or component / task:** Home browse feed with category switching and image-led listing cards.
- **Platform / viewport / OS context:** iPhone portrait screenshot. Visible iOS status indicators show 9:41 and cellular, Wi-Fi, and battery symbols; a home indicator is visible. Exact device and logical viewport are not identified.
- **What was directly observed:** A rounded search action; three icon-led categories (Homes, Experiences, Services); section headings with location context; two-column property image cards; favorite/guest-favorite badges; title, per-stay price and rating; a five-item bottom tab bar; and the black home indicator.
- **Access and evidence limits:** Static screenshot only. Taps, scrolling behavior, card transitions, and current product behavior are not established. Some small text is visible but not sufficiently clear to verify word-for-word. Treat this as a view of Airbnb captured by Pixlpin, not proof of Airbnb's current live UI. The screen-only study crop removes the Pixlpin page footer; the unmodified full capture is retained separately.
- **What works and why:** The image-led grid, repeated section rhythm, and separation between image, status marker, title, and price are candidate craft patterns for comparing browse-feed treatments.
- **What does not fit Soldbay:** This is a travel-stay discovery feed with per-night prices and destination context, not a campus resale marketplace. It does not demonstrate Soldbay's campus filtering, condition details, negotiability, or protected checkout/handoff.
- **Principles to adapt or reject, and why:** Candidate only: compare its browse hierarchy and card information grouping with other high-quality marketplace examples. Do not import Airbnb's category model, listing semantics, branding, or screen composition into Soldbay.
- **Pencil study frame name:** `REFERENCE STUDY — Airbnb Explore feed (source capture)` in `design/soldbay-design-documentation.pen`, shown at 393.33 × 850 with a 42 px clipped screen-corner mask for consistent presentation. The source-faithful 1180 × 2550 screen crop is `design/reference-captures/airbnb-explore-feed-pixlpin-screen-only-2026-11-08.webp`; the full original capture is `design/reference-captures/airbnb-explore-feed-pixlpin-2026-11-08.webp`.
- **Owner decision:** Pending; not selected or approved.

### Candidate: Pinterest home feed (iOS)

- **Product / source / URL / access date:** Pinterest screen from Banani's [Pinterest reference page](https://www.banani.co/references/apps/pinterest) and [Home screen entry](https://www.banani.co/references/screens/pinterest-home); accessed 2026-11-09. Banani labels the app set iOS and currently says the reference library is free to browse without sign-up; access terms can change.
- **Screen or component / task:** Home discovery feed with a masonry image stream.
- **Platform / viewport / OS context:** iOS portrait screen capture, placed in a 393.33 × 850 study viewport with the same 42 px clipped screen-corner mask used for Airbnb. The source capture's precise device and logical viewport are not identified.
- **What was directly observed:** iOS status bar; a horizontal topic row (`All`, `Tamagotchi`, `Draw`, and other short labels); a dense, staggered two-column image feed with varied card heights and overflow controls; five-item bottom navigation; and the home indicator.
- **Access and evidence limits:** Static library capture. The app version/date, device model, exact viewport, interactions, and ranking behavior are unknown. Treat it as a Pinterest screen presented by Banani, not proof of current live behavior.
- **What works and why:** Candidate for comparing image-led discovery, varied card rhythm, and how a dense feed handles visual contrast and scanning.
- **What does not fit Soldbay:** Pinterest is an inspiration and content-discovery product, not a campus marketplace. Its masonry layout may make price, condition, and negotiation cues harder to compare; that is a question to assess against Soldbay's task, not a conclusion from user testing.
- **Principles to adapt or reject, and why:** Candidate only. Compare its image-feed craft with marketplace examples that expose price and condition clearly. Do not import its content model, ranking, branding, or composition wholesale.
- **Pencil study frame name:** `REFERENCE STUDY — Pinterest Home feed (source capture)` in `design/soldbay-design-documentation.pen`, shown with the shared 42 px clipped screen-corner mask. The Banani-served screen image is retained at `design/reference-captures/pinterest-home-banani-2026-11-09.png`.
- **Owner decision:** Pending; not selected or approved.

### Additional visual-study candidates

These three sources were found to broaden the visual study beyond two image-led feeds. They are examples for craft and theme exploration, not product requirements or selected Soldbay directions. Their task models differ from campus resale, so only transferable visual qualities should be considered.

#### Things 3 — Today / home screen

- **Product / source / URL / access date:** Things 3 iOS home-screen entry in [Banani's free reference library](https://www.banani.co/references/screens/things-home); accessed 2026-11-09.
- **Screen or component / task:** Personal task-list overview; adjacent to Soldbay only as a study in information hierarchy and compact content.
- **Platform / viewport / OS context:** iOS portrait capture; exact device and logical viewport unknown.
- **What was directly observed:** A bright, restrained screen with a vertically organized task list, light dividers/check controls, small metadata, and one high-visibility add action.
- **Access and evidence limits:** Static screenshot; version and behavior are not established. Capture needs a local image asset before a Pencil study can be added.
- **What works and why:** Candidate for comparing quiet typography, spacing, and the balance between a long list and a single primary action.
- **What does not fit Soldbay:** The task-list content structure does not model product discovery, pricing, or marketplace trust.
- **Principles to adapt or reject, and why:** Consider the restraint and scan hierarchy; do not import task-list patterns or blue as a Soldbay color decision.
- **Pencil study frame name:** `REFERENCE STUDY — Things 3 Today (source capture)` in `design/soldbay-design-documentation.pen`, shown at 393.33 × 850 with the shared 42 px clipped mask. Source capture: `design/reference-captures/things-3-home-banani-2026-11-09.png`.
- **Owner decision:** Pending; not selected or approved.

#### Calm — home / browse screen

- **Product / source / URL / access date:** Calm [Home screen reference](https://www.banani.co/references/screens/calm-home) and [app reference library](https://www.banani.co/references/apps/calm); accessed 2026-11-09.
- **Screen or component / task:** Personalized wellness-content home/browse surface.
- **Platform / viewport / OS context:** iOS portrait; exact device and logical viewport unknown.
- **What was directly observed:** Mountain photography with a Calm wordmark; a promotional banner; personalized greeting; a mood check-in; recommended audio content; and five bottom navigation destinations. The capture has no visible status indicators or home indicator, so none were added.
- **Access and evidence limits:** Static capture; exact version and screenshot context are unknown. The source image is 1284 × 2778 and is shown in the same 393.33 × 850 study viewport with a clipped 42 px corner mask; no device chrome was invented.
- **What works and why:** Candidate for studying immersive imagery, restrained contrast, and a distinct emotional mood.
- **What does not fit Soldbay:** Wellness content does not model marketplace item comparison; a dark photographic mood may also reduce legibility for price-dense browsing if transferred without adaptation.
- **Principles to adapt or reject, and why:** Consider the deliberate image treatment and cohesive atmosphere; reject wellness-specific semantics and any palette that impairs transaction scanning.
- **Pencil study frame name:** `REFERENCE STUDY — Calm Home (source capture)` in `design/soldbay-design-documentation.pen`. Source capture: `design/reference-captures/calm-home-banani-2026-11-09.png`.
- **Owner decision:** Pending; not selected or approved.

#### Substack — home feed / inbox and notes

- **Product / source / URL / access date:** Substack [Home screen reference](https://www.banani.co/references/screens/substack-home) and [app reference library](https://www.banani.co/references/apps/substack); accessed 2026-11-09.
- **Screen or component / task:** Reader home feed with inbox recommendations and social notes.
- **Platform / viewport / OS context:** iOS portrait screenshot, shown at 393.33 × 850 with the shared 42 px clipped mask. Exact device and version are unknown.
- **What was directly observed:** Status indicators, an Inbox heading and recommendation carousel, large illustrated/pictured content cards, a Notes feed, an orange create action, and a three-item bottom navigation bar with home indicator.
- **Access and evidence limits:** Static screenshot. The Banani page calls it the Home Screen, though the visible top section is labeled Inbox; capture date, interactions, and current app behavior are unknown.
- **What works and why:** Candidate for comparing bold editorial content cards, strong type hierarchy, and how one accent color connects creation and feed actions.
- **What does not fit Soldbay:** Reader posts and subscriptions do not model product condition, price comparison, campus availability, or protected checkout.
- **Principles to adapt or reject, and why:** Consider the content hierarchy and controlled use of orange; do not import Substack's content model, branding, or screen composition.
- **Pencil study frame name:** `REFERENCE STUDY — Substack Home (source capture)` in `design/soldbay-design-documentation.pen`. Source capture: `design/reference-captures/substack-home-banani-2026-11-09.png`.
- **Owner decision:** Pending; not selected or approved.

## Historical public-foundation comparison — 2026-11-09

This records an earlier exploration that has since been cleared from the active Pencil canvas. Its examples were synthetic Soldbay buyer-feed studies informed by public system documentation, not source-faithful public-product screens. They are withdrawn and must not be treated as active directions or visual evidence.

| Public source | Publicly documented contribution | Soldbay fit and boundary |
| --- | --- | --- |
| [Material Design 3 — Color roles](https://m3.material.io/styles/color/roles) and [Applying typography](https://m3.material.io/styles/typography/applying-type) | Semantic roles for primary/secondary/tertiary, surfaces and on-colors; paired text/icon roles; type scale grouped by display, headline, title, label and body. | Useful for studying naming and consistent application of visual roles. Soldbay currently targets iPhone; do not inherit Material's component style or palette as its brand. |
| [Atlassian Design System — Foundations](https://atlassian.design/foundations), [Color](https://atlassian.design/foundations/color), and [Typography](https://atlassian.design/foundations/typography) | Public token-based color roles, neutrals for light/dark, distinct selected/focused states, contrast guidance, and a documented heading/body type scale with spacing guidance. | Useful for explicit semantic tokens, scan hierarchy and distinct selection/focus treatment. The system serves Atlassian products; its brand color, enterprise conventions and app patterns do not define Soldbay's identity or marketplace layout. |
| [Apple Human Interface Guidelines — Color](https://developer.apple.com/design/human-interface-guidelines/color), [Layout](https://developer.apple.com/design/human-interface-guidelines/layout), and [Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles) | Platform-specific guidance on consistent semantic color, accessible light/dark behavior, clear adaptable layouts, familiar organization and visual craft. | Useful as an iOS platform constraint, not as Soldbay's complete visual brand. Keep OS chrome and safe areas governed by `docs/device-foundations.md`. |

### Archived study details

- The earlier comparison used three conceptual BY-01 buyer-browse examples with the same campus, search, category labels, Recently Added cue, listing fields, and representative photography:
  1. Material 3 semantic color/type roles translated into a warm provisional treatment.
  2. Atlassian's neutral/token and scan-hierarchy principles translated into a compact treatment.
  3. A cross-source editorial study that reused the earlier provisional Option C values and applied Apple's platform clarity constraints plus semantic-role thinking from the public systems.
- These are Soldbay task adaptations, not faithful reconstructions of public-company screens or adoption of any complete design system. The first two are system-informed treatments; the third is an explicit hybrid, not a third public system.
- Those three frames were named `Study screen — Material 3 adapted`, `Study screen — Atlassian foundations adapted`, and `Study screen — Cross-source editorial synthesis` under `SECTION — Public foundation buyer-feed studies`. The owner later cleared these visual examples from the active canvas.
- The Material example uses Roboto and provisional warm values mapped to Material-style semantic roles. The Atlassian example shows neutral/token hierarchy and a blue action role; Inter is a canvas substitute for Atlassian Sans, so it is not a typeface-faithful reconstruction. The hybrid keeps Option C's provisional editorial treatment and draws on Apple HIG layout/color constraints plus the already studied Substack/Airbnb hierarchy and imagery.
- Any colors shown in the examples are provisional study values, not selected source tokens or an approved Soldbay palette. Where a source publishes semantic roles but not a single app palette, the example uses provisional values to demonstrate role mapping. The third study deliberately retains Option C's provisional warm palette so its screen-level effect can be compared; this does not select Option C.
- Data and listing photography are synthetic study content. Do not read the screenshots as a usability result, real inventory, or final screen specification.
- The examples retain the 390 × 844 common-phone canvas and device rounded viewport. OS-owned system chrome is presentation context only; no imitation status or home-indicator UI is part of Soldbay components.
- Do not restore or reuse those options as current candidates. The present work derives visual principles from real references and Soldbay's approved tasks before starting fresh foundations.

## Source access check — 2026-11-11

- **UIguana:** Excluded from this round at the owner's direction because it is not connecting. No evidence was collected from it.
- **Uiland:** Signed-in browsing exposed actual Etsy captures, despite most other screen tiles being subscription-locked. The observed screens and access limits are recorded below. This does not establish access to every Uiland screen or imply a subscription.
- **Pixlpin:** Signed-in browsing is available. The mobile-app library includes screen sets for multiple products; continue selecting individual screens only when their visual quality and task fit make them useful. Screen-specific capture date/version may be absent from library metadata.
- **Official Etsy help:** Public guidance describes purchase and order-status steps, but text guidance does not provide enough visual evidence for a source-faithful Pencil reconstruction. Use it only to understand what Etsy publicly documents, not as a Soldbay flow or a screen reference. [Purchase an item](https://help.etsy.com/hc/en-gb/articles/115013196707-How-to-Purchase-an-Item-On-Etsy), [order status](https://help.etsy.com/hc/en-us/articles/115015521948-What-s-the-Status-of-My-Order).
- Uiland's visible Download action showed a “Downloading…” notification, but no new capture appeared in the accessible local Downloads directory. No source capture was imported and no new Pencil study was created during this check. Do not fill source-image gaps with generated or unrelated imagery.

## Commerce and transaction reference check — 2026-11-11

These are source observations from signed-in screen-library pages. They are not Soldbay screen designs, workflow evidence, or usability validation. UIguana was excluded because it did not connect.

### Etsy — Product detail, first visible capture

- **Product / source / URL / access date:** Etsy iOS screen indexed by Uiland, [Product detail category](https://uiland.design/screens/etsy/screens/b7f3be79-8bfa-4917-a1a8-973e83ea5a0e/screen-type/product-detail); accessed 2026-11-11.
- **Platform and capture context:** Uiland presents the capture inside an iPhone frame. Device model, viewport dimensions, iOS version, and screenshot capture date are not supplied. The visible screen is marked `1 / 48`; it is tagged `Product Detail`, and the associated flow is “Viewing playful picks.”
- **What is visible:** A large product photograph dominates the upper screen. A compact top action row sits over the image. Beneath it, the page begins a product information area, while additional content is shown as skeleton/loading placeholders. A five-item bottom navigation is visible. Uiland also exposes a screen palette and element tags in its surrounding library interface; those library UI elements are not part of Etsy.
- **Access limits:** Only this capture was inspected. The product details area is in a loading/skeleton state, so its final content and lower layout cannot be inferred. Other screen tiles were subscription-locked. The UIland screen frame includes the source device shell; it is not the image asset for a clean screen-only reconstruction.
- **Candidate craft lesson and boundary:** Product imagery can carry visual recognition while persistent navigation remains separate. Do not infer that this exact image dominance, action overlay, skeleton state, or bottom navigation is appropriate for Soldbay. It does not show price or seller facts clearly enough to answer the comparison-principle question.
- **Pencil study:** Not created. Preserve as a verified source observation, not a completed visual reconstruction.

### Etsy — Checkout address step, capture 2 of 11

- **Product / source / URL / access date:** Etsy iOS screen indexed by Uiland, [Checkout category](https://uiland.design/screens/etsy/screens/b7f3be79-8bfa-4917-a1a8-973e83ea5a0e/screen-type/checkout?screen=1); accessed 2026-11-11.
- **Platform and capture context:** Uiland shows an iPhone frame, a `Checkout` header, and `2 / 11`. Device model, viewport dimensions, iOS version, and screenshot capture date are unknown. Uiland associates the screen set with the “Buying an item” flow.
- **What is visible:** A single-column address form has a step title (“Enter an address”), labels, required markers, an explicitly optional apartment/suite field and optional phone field, country selection, and a bottom `Continue` action. The screen is vertically dense but the labels remain in a consistent order.
- **Access limits:** Later captures are subscription-locked. The screen describes address entry only; it does not show item price, fees, payment summary, or the buyer's negotiated terms.
- **Candidate craft lesson and boundary:** Make required versus optional inputs explicit and keep the next action identifiable. This is a form-specific observation, not evidence about Soldbay's checkout totals or interaction behavior.
- **Pencil study:** Not created; the source is recorded as observation only until its source image can be retained for a faithful reconstruction.

## Open work

- Review the functional screen-specification draft in `docs/screen-specifications.md`; its screen content/routes are not yet owner-approved.
- Resolve the existing staff-route coverage gap in `docs/screen-architecture.md` before staff wireframes.
- Define and review Soldbay's candidate principles in [`visual-principles.md`](visual-principles.md); do not recreate the cleared candidate or synthetic buyer-feed sheets.
- Source-faithfully study relevant product-detail, negotiation/chat, checkout, and order-status screens only where the existing home/feed references do not answer the visual question.
- If the candidates do not express the approved direction well enough, continue sourcing beyond locally popular apps and beyond one library. The five studies are craft inputs, not five proposed Soldbay themes.
- Airbnb, Pinterest, Things 3, Calm, and Substack remain separate source studies; the owner has approved a high-level synthesis from them, not their screens or any one source's complete style.
- The prior foundation values remain historical only. No current palette, typeface, shape, imagery, or icon treatment is approved yet.
- Derive/review component appearance and detailed state specimens after the new theme is selected.

## Visual quality lens — discovery, not direction

The owner noted that the reference work should make qualities such as energetic, bold, minimal, and material-led easier to see and compare. These terms are prompts for observation, not a fixed checklist, requested theme, or approved preference. Add other useful qualities when the sources reveal them.

| Lens                 | Useful descriptive range                              | Evidence rule                                                                             |
| -------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Energy and mood      | quiet ↔ lively; calm ↔ high-energy; serious ↔ playful | A still image can suggest mood, but cannot establish motion or interaction.               |
| Emphasis             | understated ↔ bold; even hierarchy ↔ strongly focal   | Describe scale, contrast, weight, and placement that create emphasis.                     |
| Density and pace     | sparse ↔ information-rich; slow ↔ rapid visual rhythm | Relate density to the screen's task; do not treat either end as universally better.       |
| Expression           | minimal ↔ graphic/ornamental; functional ↔ editorial  | Name the visible choices (type, illustration, imagery, decoration) behind the impression. |
| Surface and material | flat/opaque ↔ layered/translucent/tactile             | Record material only where it is visible; static screenshots do not prove its behavior.   |

### First-pass tags for the five existing captures

These are descriptive readings of the captured screens only. They are not rankings, user preferences, selected principles, or proposed Soldbay directions.

| Reference      | Visible qualities worth comparing                                  |
| -------------- | ------------------------------------------------------------------ |
| Airbnb Explore | image-led, spacious, calm, repeated card rhythm                    |
| Pinterest Home | dense, image-rich, varied card rhythm, visually lively             |
| Things 3 Today | restrained, minimal, quiet hierarchy                               |
| Calm Home      | atmospheric, immersive imagery, restrained content hierarchy       |
| Substack Home  | bold editorial hierarchy, graphic content cards, strong accent use |

### Candidate contributions to Soldbay

The owner proposed looking for what can speak to Soldbay in each source, rather than expecting one app to represent the whole product. The following are context-aware candidates derived from the five captures; they are not approved design principles and must still be checked together for coherence.

| Reference | Candidate quality to carry into Soldbay | Boundary: what should remain specific to the source |
| --- | --- | --- |
| Airbnb Explore | Give listing photography a strong role, while keeping title, price, and supporting facts in a repeatable, scannable order. | Travel categories, destination framing, per-night pricing, and its exact card proportions do not describe campus resale. |
| Pinterest Home | Bring variety and visual energy to discovery through image treatment and feed rhythm. | A masonry layout can make prices and condition harder to compare; do not assume its feed structure fits marketplace decisions. |
| Things 3 Today | Use restraint, clear type hierarchy, and calm spacing so essential facts remain easy to scan. | Do not let minimalism remove useful listing, trust, or transaction information. |
| Calm Home | Make atmosphere intentional and use imagery with care, while keeping important transaction facts prominent. | A wellness-style immersive mood should not overwhelm mixed-quality seller photos or price/condition clarity. |
| Substack Home | Give the brand confident editorial emphasis in selected places, with clear section hierarchy and controlled accent use. | Do not let large editorial moments compete with product comparison, negotiation, or payment information. |

**Owner-approved MVP direction (2026-11-09):** a calm, scannable marketplace structure; image-led listings with consistent comparison fields; and a distinctive but controlled editorial voice. This is a high-level visual direction assembled from several references. It does not approve any source screen or set colors, typefaces, shapes, motion, materials, or component styling.

The five source-faithful captures give useful breadth for browsing hierarchy, image use, and editorial expression. They do not cover product detail, negotiation, checkout totals, or Soldbay's order confirmation pattern; those remain research gaps in [`visual-principles.md`](visual-principles.md). The Etsy screen checks above do not close those gaps.

**Free-source discovery note (checked 2026-11-09):** Pixlpin currently exposes real app screens, motion, and style/tag browsing, including minimal and dark-mode groupings. Its site says browsing is free, with a free account needed after a browsing limit and for saving; treat that as a changing access condition. Search terms can include `playful`, `energetic`, `bold`, `graphic`, `editorial`, `minimal`, `translucent`, and `glass`, but verify that each result is an actual product screen before using it as a reference. Motion examples can suggest movement vocabulary, but they do not replace a source-faithful screen study. UIguana remains another free-first library; its search listing exposes a free-account gate for the full screen sets.

### Material study note: Liquid Glass

[Apple's Human Interface Guidelines on materials](https://developer.apple.com/design/human-interface-guidelines/materials) describe Liquid Glass as a dynamic material for the functional layer, especially controls and navigation, and advise using it sparingly rather than across content surfaces. Treat it as a specific Apple platform material and behavior to inspect in source context, not as a synonym for a whole-product theme or as a default cross-platform style. The owner is interested in a possible Liquid Glass reconstruction in a later version or post-MVP launch phase; it is explicitly deferred from the current MVP direction. If studied later, capture a real Apple-platform screen and record OS/version and source; separately assess what, if anything, transfers to Soldbay's Android app.

The next design gate is owner review of the candidate principles in [`visual-principles.md`](visual-principles.md). After approval, use those principles to derive a new theme and foundations. The former synthetic buyer-feed studies were cleared from the active Pencil canvas and are not current references.
