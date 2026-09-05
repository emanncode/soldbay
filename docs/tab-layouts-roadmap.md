# Tab Layouts — Shared Shell (Done) → Full expo-router Nested Layouts (Roadmap)

Status: **Option 1 shipped** (shared shell components + tab hooks).
This file documents **Option 2 — full expo-router nested layouts** — which is
deliberately deferred. Re-read this when the shared-shell approach starts to
feel cramped (deep-link handling, per-tab navigator state, native back
behavior).

---

## What shipped (Option 1, current)

- `src/lib/tabs.tsx` — **single source of truth** for the buyer (5) and seller
  (6) tab sets: `BUYER_TABS`, `SELLER_TABS`, `tabsForMode(mode)`, and the
  `useModeTabs(mode)` hook that returns `{ tabs, handleTabPress }`.
- `src/components/tab-screen-shell.tsx` — the shared chrome (`TabScreenShell`):
  bordered compact header (or a custom `header` node) + children + `TabBar`.
- All tab screens now render <TabScreenShell> instead of vendoring their own
  copy of the tab arrays: `buyer/home`, `buyer/search`, `buyer/cart`,
  `buyer/wallet`, `seller/dashboard`, `seller/products`, `seller/wallet`,
  `profile/index`, `orders/index`.

What this means in practice:

- Tab order, icons, labels, and navigation targets live in one place; they
  cannot drift between screens.
- Adding a tab = one edit in `src/lib/tabs.tsx`.

Limitations of Option 1 (why Option 2 exists):

- Each screen still manages its own header layout via the `header` prop.
- Tab presses use `router.replace(...)`; there is no per-tab navigator stack,
  so a tab re-fires its screen's own load every time (no native "keep alive").
- Deep links land on the screen route, not on the tab layout — the "active
  tab" is a hardcoded prop, not derived from the route tree.

## Option 2 — Full expo-router nested layouts

### Goal

Move from "one screen per tab with a shared <TabBar>" to **expo-router groups
with a real tab layout**, so the tab bar, safe-area headers, and per-tab
navigation stack are owned by the router.

Expected target tree under `src/app`:

```text
src/app/
  (buyer)/
    _layout.tsx        # Stack or Tabs? see "Decision points"
    index.tsx          # buyer/home  (Feed)
    search.tsx
    cart.tsx
    wallet.tsx
  (seller)/
    _layout.tsx
    dashboard.tsx
    products.tsx
    wallet.tsx
  profile/
    index.tsx          # profile tab shared by both modes
  orders/
    index.tsx          # orders tab shared by both modes
```

### Route design

Use **two route groups** (`(buyer)` and `(seller)`) each holding a tab layout.
`profile` and `orders` stay top-level and are reachable from either group (via
`href="/(buyer)/../profile"` style links or by pressing the Profile/Orders tab
on a layout that renders them as siblings). Two candidate approaches — pick one:

1. **React Navigation bottom tabs per group** (`@react-navigation/bottom-tabs`)
   — the most standard approach. Each group's `_layout.tsx` defines a
   `<Tabs>` navigator with the tab screens as children. `profile`/`orders`
   become `Tabs` screens too by placing them inside the group layout (their
   file physically lives in a shared folder, re-exported into both groups).
2. **Single tab navigator + mode switch** — one `<Tabs>` layout at the root
   whose screens render mode-specific content based on the user's role. This
   avoids duplicating `profile`/`orders` but makes the tab set dynamic (react
   navigation warns when tab lists change shape), which is why approach 1 is
   preferred.

### What switches (migration steps)

1. Create `(buyer)/_layout.tsx` + `(seller)/_layout.tsx` using the chosen tab
   navigator. Move `buyer/home|search|cart|wallet`, and the seller screens,
   under their groups. Keep `profile/` and `orders/` shared. Update every
   `router.replace("/buyer/home")` style call to the new grouped hrefs
   (e.g. `/(buyer)/home`), or keep a compatibility shim.
2. Replace `useModeTabs`/`TabScreenShell` usage on each screen with the layout
   element: screens drop their own `TabScreenShell` + `activeTab` wiring
   entirely; the layout renders `TabBar` (or `Tabs` header) and the active
   state is derived from the route.
3. Keep `src/lib/tabs.tsx` as the **single source of truth for the tab-item
   metadata**: the layouts map over `tabsForMode(mode)` to construct
   screens/buttons, so icon/label/order still centralize in one file.
4. Safe-area + header: move the centered `TabScreenShell` header into the tab
   layout's `header` option (or a shared route group `(tabs)/_layout.tsx`)
   rather than each screen.
5. Add a root `_layout.tsx` gate (or keep `useProtectedRoute` calls) that
   prompts login for the protected groups.
6. Update deep-link handling: `app.json` `scheme` routes should target the
   grouped paths, and the "Post" action stays a `router.push` out of the tab
   navigator into `/seller/create-listing` (a stack screen).

### Decision points to resolve when implementing

- Tab **badge** (`badgeCount`) — the `TabItem` type already supports it; the
  layout must wire it (e.g. cart count, pending orders) via the tab
  navigator's `tabBarBadge`.
- **Orders as a tab target for both modes**: seller tabs include `orders`
  (replaces into `/orders`); buyer profile links to it. Decide whether the
  buyer tab bar should ever highlight `orders` (it currently highlights
  nothing — see existing behavior) or whether buyers should see the orders
  row only from Profile.
- Whether `profile` belongs inside both groups (duplicate screen module
  re-exported) or stays a top-level stack screen that the tab bar
  `router.replace`s into. Approach 1 above prefers re-exporting into the tab
  navigator.

### Acceptance criteria

- Tapping a tab never remounts/loses scroll of an already-visited tab.
- The active tab highlight is always derived from the current route — no
  hardcoded `activeTab` string per screen.
- Deep links like `soldbay://seller/dashboard` open in the correct group with
  the right tab highlighted.
- `src/lib/tabs.tsx` remains the only file edited to add/reorder a tab.