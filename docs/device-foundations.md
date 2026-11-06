# Soldbay Cross-Platform Device Foundations — Stage 04, Step 05

**Status:** Approved by the owner on 2026-11-06. This defines design behavior, not an implementation or final device-support commitment.
**Prepared:** 2026-11-06
**Approved visual foundations:** `docs/design-foundations.md` (owner-approved 2026-11-06).
**Product authority:** `docs/architecture.md`. This document defines presentation behavior only and does not alter product workflows.
**Research basis:** Current official Apple Human Interface Guidelines and Android Developers guidance, linked in Sources.

## Purpose and evidence boundary

Define how the approved Grounded Market foundations should adapt across iOS, Android, compact/expanded mobile windows, accessibility settings, operating-system chrome, and interruptions. These are design rules and proposed test viewports, not verified OS support, implementation choices, or a promise of a specific device matrix. The app framework and minimum supported OS versions are not selected here.

## Platform boundary and system chrome

| Concern | iOS | Android | Soldbay design rule |
| --- | --- | --- | --- |
| Status bar | OS owns time, cellular/network, Wi-Fi, battery, and status presentation. | OS owns status icons and status-bar region. | Never draw imitation status icons in app content. Let system appearance follow the active screen background and contrast. |
| Top safe area | Respect the system safe area, including status region, Dynamic Island/camera areas, and any visible bars. | Respect status-bar and display-cutout insets. | Backgrounds may extend behind system chrome where intentional; text, controls, and critical information stay clear of insets. |
| Bottom navigation region | Home indicator and system gesture area belong to iOS. | Gesture navigation or three-button navigation belongs to Android. | Do not draw a fake home indicator or Android navigation bar. Keep primary actions above system gesture/navigation insets. |
| App navigation | Use app-owned navigation patterns consistent with iOS conventions. | Use app-owned navigation patterns consistent with Android conventions. | Navigation bars/toolbars are app UI, visually distinct from OS-owned status/navigation chrome. Exact component decisions belong in Step 06. |
| Keyboard | OS keyboard and safe-area changes are dynamic. | IME/keyboard insets and resize/pan behavior vary by window and configuration. | Keep the active field and essential submit/continue action visible; scroll content as needed. Never hard-code keyboard height. |
| Cutouts and edge-to-edge | Safe-area guides adapt to device geometry. | Insets include system bars, gesture regions, and display cutouts; edge-to-edge is part of current platform guidance. | Treat insets as runtime inputs. Never assume a single notch, status-bar, or bottom-bar height. |

In design presentations, show OS chrome as labeled context outside the app’s component inventory. A device status-bar mock may be used only as a neutral viewport frame; battery/network glyphs must not be recreated as Soldbay icons. Real screenshots and implementation later need OS-provided chrome.

## Device and viewport matrix

The following are reference design canvases, not physical pixel specifications or canonical Apple/Android device dimensions. They are a proposed sampling set to expose layout failures; they are not claims about device support or exact platform breakpoints. Map them to selected platform logical units and test against the usable window after system insets, not only the physical display rectangle.

| Context | Proposed design-test viewport | What it should expose |
| --- | --- | --- |
| Compact phone | 320 × 640 | Narrow content, wrapped prices/titles, stacked actions, keyboard overlap, safe-area pressure |
| Common phone | 390 × 844 | Primary buyer/seller flow composition and typical portrait content density |
| Large phone | 430 × 932 | Avoid over-stretching cards and forms; preserve readable measure and reachable actions |
| Tablet / split window | 768 × 1024 and a narrower split-window width | Adaptive columns/panes only when space allows; graceful return to a single column |
| Admin desktop | 1280 × 800 and 1440 × 900 | Current Admin/Ops IA desktop workflows, table density, persistent navigation |
| Admin mobile fallback | 390 × 844 | Full-capability mobile fallback from current Admin/Ops IA; prioritize task completion over desktop table mimicry |

Exact OS simulator/device presets and app store support floors are deferred until the implementation technology and release targets are chosen. When creating device mockups, the frame bezel remains presentation only; the app content viewport uses the declared logical dimensions and safe areas.

## Pencil file structure

- `design/soldbay-design-documentation.pen` is the canonical documentation canvas. It holds foundations, the shared component specification, flow maps, responsive rules, and decision boards.
- `design/soldbay-ios.pen` is reserved for actual iOS screens after the shared visual UI kit and component specifications are complete and Step 08 begins.
- `design/soldbay-android.pen` will contain actual Android screens on the same schedule.

The two screen files are platform workspaces, not single-device layouts. Each must exercise compact, common, large-phone, and relevant expanded-window contexts under this Step 05 matrix. Shared tokens and task requirements remain canonical in the documentation canvas; iOS and Android files may diverge only where platform conventions require it.

## Responsive and adaptive rules

- Use available **window width and height** and system insets as inputs; do not infer layout only from device model or orientation.
- Mobile buyer/seller journeys default to one readable content column. Split content into columns only when the actual available width sustains comfortable text measure and target spacing.
- Keep product listings, product details, order steps, negotiation/chat, seller forms, and checkout vertically scrollable. Avoid horizontal scrolling for core tasks.
- On larger windows, use additional width for a supporting pane or more visible listing items only where that improves the current task; preserve the single-column path as the fallback.
- Reflow controls and labels when text scales, translations/long names expand, or the keyboard appears. No fixed card height may clip essential content.
- Use size classes/window categories for behavior decisions; exact numeric breakpoints and column transitions remain open until the device matrix is exercised in screen design and selected framework.
- Orientation changes, split-screen resizing, and app-window resizing must preserve entered form values and the user’s current task state.

## Touch, pointer, keyboard, and gestures

- Design common mobile controls for at least **44 × 44 pt on iOS** and **48 × 48 dp on Android**, using invisible hit-area expansion where visual controls are smaller and neighboring controls do not conflict. These match official platform guidance.
- Keep adequate separation between adjacent controls; do not place destructive and primary actions in ambiguous neighboring hit areas.
- Support platform back navigation and standard scrolling. Do not make a custom swipe/gesture the only way to perform a core action; provide a visible control as an alternative.
- Make focus, pressed, selected, disabled, loading, and error states legible in both themes. Keyboard focus must be visible for hardware keyboard/pointer use where supported.
- For forms and chat, use appropriate system keyboard types, preserve entered text across transient interruptions, and ensure focus does not hide validation or the next action.
- Respect system text enlargement. Layout must reflow instead of truncating primary actions or requiring horizontal scrolling. Apple recommends support for substantial text enlargement; validate at the largest practical accessibility setting during screen work.

## Network and interruption behavior

- Campus browse and product detail may show a clear offline/stale-data state; never imply a fresh availability or price check when the app has no connection.
- Before a money-moving or order-changing action, communicate whether the action is pending, confirmed, or failed. Prevent duplicate payment/order submissions while retrying.
- Preserve unsent form/chat text and safe local progress through app backgrounding, incoming calls, keyboard transitions, and transient network loss where technically feasible.
- Offline capability for order handoff confirmation is a product requirement in the PSS; its secure verification, replay protection, and synchronization design remain implementation and architecture work. An offline presentation alone does not establish that flow as technically safe.
- Show a recoverable pending state for operations whose server result is unknown. Reconcile with server/provider state before offering a retry that could duplicate an operation.

## Approved foundations applied here

Use the approved Step 04 semantic light/dark colors, Inter typography scale, 4/8/12/16/24/32 spacing, and restrained geometry. The system appearance preference controls light/dark mode; do not add an in-app theme toggle. Actual color pairings, text scaling, platform font rendering, and safe-area compositing must be checked against representative designed screens before handoff.

## Open implementation decisions

- Minimum iOS and Android versions, device classes, and simulator/device presets.
- Native versus cross-platform implementation and how logical units/tokens map into it.
- Exact responsive breakpoints and when any pane/navigation pattern changes.
- Framework-specific status-bar appearance, edge-to-edge, keyboard, inset, and gesture configuration.
- Whether tablet layouts need dedicated buyer/seller screens beyond adaptive phone layouts.
- Runtime verification for offline order confirmation and pending/reconciliation states.

These are intentionally explicit. This proposal does not establish unsupported platform capabilities or launch compatibility.

## Review checklist

- [x] Cover OS-owned status and navigation chrome, insets, cutouts, and keyboard avoidance without inventing app-owned replicas.
- [x] Define proposed responsive test canvases for phone, tablet/split window, desktop Admin/Ops, and mobile fallback.
- [x] Record Apple/Android touch target guidance and scalable text expectations.
- [x] Address low connectivity, interruptions, and unknown server outcomes at the design-behavior level.
- [x] Owner approved this Step 05 foundation and the three-file Pencil structure on 2026-11-06.
- [ ] Resolve release OS/device support and framework mapping after technology selection.
- [x] Apply these rules to Step 06 component-state specifications. Actual viewport and accessibility-setting checks remain part of later screen work.

## Sources

- Apple, [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) — safe areas, adaptive layout, size classes.
- Apple, [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) — Dynamic Type/text enlargement, touch targets, accessibility review.
- Apple, [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) — minimum button hit region guidance.
- Android, [Edge-to-edge design](https://developer.android.com/design/ui/mobile/guides/layout-and-content/edge-to-edge) — system bars, gesture/cutout insets, and content placement.
- Android, [System bars](https://developer.android.com/design/ui/mobile/guides/foundations/system-bars) — OS chrome and safe zones.
- Android, [Accessibility](https://developer.android.com/design/ui/mobile/guides/foundations/accessibility) — 48 dp target and scalable text.
- Android, [Grids and units](https://developer.android.com/design/ui/mobile/guides/layout-and-content/grids-and-units) and [Window size classes](https://developer.android.com/develop/ui/views/layout/use-window-size-classes) — dp/sp, adaptive layouts, and width-based classes.

**No app screens, icons, or implementation code were created in Step 05. This is an approved platform-foundations record; actual screens and platform validation remain later work.**
