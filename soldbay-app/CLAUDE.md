@AGENTS.md

# Soldbay Mobile Project Notes

For current product and design decisions, use the AllOnSoldBay Linear project's
Workflow & Continuation Guide, Feature/Workflow Inventory, Component Inventory,
Screen Flow, Screen Build Order, and Design System Reference. Those documents
are authoritative for intended behavior; the checked-in code is authoritative
for what is currently implemented. Record gaps between the two explicitly.

## Current design constraints

- Palette: Orange & Teal. Semantic token values come from the Linear Design System
  Reference and are implemented in `src/theme/tokens.js` and
  `tailwind.config.js`. Do not copy values from historical local design docs.
- Typography: Sora for mobile UI; use the established Sora utilities.
- Icons: Phosphor (`phosphor-react-native`), regular when inactive and fill
  when active where the component spec calls for that treatment.
- Dark mode follows the operating-system appearance. Do not add a manual theme
  toggle unless Linear records a new product decision.
- Design components are verified against the actual prototype files named in
  the Linear docs, not inferred from another agent's implementation summary.

## Product model

Single-campus student marketplace, one listing per order, buy-now without a
cart. All accounts start as buyers; seller activation and verification follow
the current Linear decision. The repository currently retains older seller
approval gates, so check the relevant API and report that gap before changing
seller behavior. Do not imply that the code already implements the current
product decision.

The local documents `soldbay-web/DESIGN.md`, `docs/color-pairings.md`,
`docs/daily-log.md`, and `design/handoff_manifest.md` include historical or
superseded material. They are not active mobile design sources.
