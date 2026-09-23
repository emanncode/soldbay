---
name: soldbay-ace-principles
description: Linear Document - Ace
---

# Ace

**Core principle**

Every screen should instantly tell users what screen they're on and what to expect from it, from the very first glance — before scrolling. People skim a new screen fast; the structure and information at the top (toolbar or not) should do the work of orienting them immediately.

# Structure

* List every feature, workflow, and nice-to-have. Don't cut anything off at this stage.
* Imagine how someone else might actually use the app: when and where, how it fits into their routine, what might get in their way, what might actually draw them in.
* Only after that: clean things up — remove what isn't essential, rename things, group what belongs together.

# Navigation

* **What deserves a tab?** Tabs are for navigation, not actions. Labels and icons should instantly tell users where they can go (for Apple platforms, check SF Symbols for icons).
* **Toolbar** should instantly answer where the user is and what they can do here — title plus screen-specific actions, using symbols/icons.

# Content

* Organize using progressive disclosure, especially on a home/feed/browse screen — link out from an adaptive layout rather than dumping everything at once.
* **Grid vs. list**: grids suit content where images carry the information (discovery-style browsing); lists suit content that prioritizes function over image, even on a discovery screen, when images aren't essential.
* **Grouping strategies**: by theme, by time (recent/current), by progress (pick up where the user left off — people rarely finish everything in one sitting), by pattern (surface relations the user didn't know to look for, like related items), and by collection (for screens with a large number of images/videos, group them rather than listing flat).
* Contents should be thoughtfully organized using familiar platform components — help people find what matters effortlessly, and make the space feel worth returning to.

# Visual design

* Visual design communicates the app's personality and shapes how people feel. Use hierarchy thoughtfully — what's most important should be larger or higher-contrast — across typography, imagery, and color, always in support of function.
* Design with flexibility: account for larger system text sizes, different languages, etc.
* Use text styles to build hierarchy and keep legibility strong across screen conditions. Text over high-contrast images needs a backing treatment (blur, gradient, or whatever fits).
* Don't over-simplify — stripping too much can make components feel lost relative to each other.
* Keep a cohesive visual style.
* **Color**: choose a palette and set rules for using it. Name colors semantically, by purpose, not appearance — colors should be dynamic and shift automatically with contrast settings, environment, and light/dark mode, without ever compromising legibility or comfort. Don't max out accent color usage — it can be used, but restraint matters.
* Can be taken further with UX writing, typography, and animation.

# Reference: Apple's type and color system

This is the actual foundation spec behind the "hierarchy," "semantic color," and "dynamic light/dark" principles above — not a suggestion, the reference to build from.

![](https://uploads.linear.app/782f462e-f3ab-4502-b987-d3307d9957e9/28f75286-ecde-4479-b621-9ed8b472f33e/3d47003f-1b12-4f3a-a16a-3225cedcce41?signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRoIjoiLzc4MmY0NjJlLWYzYWItNDUwMi1iOTg3LWQzMzA3ZDk5NTdlOS8yOGY3NTI4Ni1lY2RlLTQ0NzktYjYyMS05ZWQ4YjQ3MmYzM2UvM2Q0NzAwM2YtMWIxMi00ZjNhLWExNmEtMzIyNWNlZGNjZTQxIiwiaWF0IjoxNzg5ODUyMTA4LCJleHAiOjE3ODk4NTI0MDh9.voxd5ArtXM7LGwvURwDULvIJ9zxiVpMPzt02DCFMaZ0)

![](https://uploads.linear.app/782f462e-f3ab-4502-b987-d3307d9957e9/ace554cc-f313-4abf-8aab-3d9863ecffb5/cba4f28b-907e-4547-bfa3-71eb73875c94?signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRoIjoiLzc4MmY0NjJlLWYzYWItNDUwMi1iOTg3LWQzMzA3ZDk5NTdlOS9hY2U1NTRjYy1mMzEzLTRhYmYtOGFhYi0zZDk4NjNlY2ZmYjUvY2JhNGYyOGItOTA3ZS00NTQ3LWJmYTMtNzFlYjczODc1Yzk0IiwiaWF0IjoxNzg5ODUyMTA4LCJleHAiOjE3ODk4NTI0MDh9.ib5_H9HMOgFTyZa7KDEsAPQnRidfa9EchNKLIB-QQ0k)

Semantic naming in practice (why "danger/warning/success/info" beats "red/yellow/green/blue"):

![](https://uploads.linear.app/782f462e-f3ab-4502-b987-d3307d9957e9/1a0255cd-9b2d-4f58-bcd2-73cff9d5bca4/68842c7a-5c05-430b-ab42-beb8beb86994?signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRoIjoiLzc4MmY0NjJlLWYzYWItNDUwMi1iOTg3LWQzMzA3ZDk5NTdlOS8xYTAyNTVjZC05YjJkLTRmNTgtYmNkMi03M2NmZjlkNWJjYTQvNjg4NDJjN2EtNWMwNS00MzBiLWFiNDItYmViOGJlYjg2OTk0IiwiaWF0IjoxNzg5ODUyMTA4LCJleHAiOjE3ODk4NTI0MDh9.VoojvTw_iVDHFIgRqaBxOA6Mmk-tcKr5nRYLubMN328)

# Finding real references (process — reusable across any project)

Never invent a palette or type pairing purely from judgment. Before locking a design system for any project, go find 1-2 real references and adapt them. Tools for this:

**For color palettes:**

* Coolors — trending, curated palettes
* Adobe Color — extract a theme directly from a reference image
* mymind — mindfully curated palette collections
* [lapa.ninja](<http://lapa.ninja>) — browse real shipped landing pages/apps filtered by color

![](https://uploads.linear.app/782f462e-f3ab-4502-b987-d3307d9957e9/c39d9dd6-d98f-46b6-a13a-ca39ee64a10c/37c43ff5-1c42-444c-b817-821d8eed3b43?signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRoIjoiLzc4MmY0NjJlLWYzYWItNDUwMi1iOTg3LWQzMzA3ZDk5NTdlOS9jMzlkOWRkNi1kOThmLTQ2YjYtYTEzYS1jYTM5ZWU2NGExMGMvMzdjNDNmZjUtMWM0Mi00NDRjLWI4MTctODIxZDhlZWQzYjQzIiwiaWF0IjoxNzg5ODUyMTA4LCJleHAiOjE3ODk4NTI0MDh9.Ekry9njcFrIvjlkPzbfCxrIbau2Pm4uED2wvSt7qfGg)

![](https://uploads.linear.app/782f462e-f3ab-4502-b987-d3307d9957e9/f8dd2065-728d-44c3-80c4-612b7661bae4/dc332ecf-b78e-4de1-ad1f-b23693f37f30?signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRoIjoiLzc4MmY0NjJlLWYzYWItNDUwMi1iOTg3LWQzMzA3ZDk5NTdlOS9mOGRkMjA2NS03MjhkLTQ0YzMtODBjNC02MTJiNzY2MWJhZTQvZGMzMzJlY2YtYjc4ZS00ZGUxLWFkMWYtYjIzNjkzZjM3ZjMwIiwiaWF0IjoxNzg5ODUyMTA4LCJleHAiOjE3ODk4NTI0MDh9.JUfHgt0oZQnBMe2WZFyFZkdG6kiiDjHTDhJnvi-Ch2A)

![](https://uploads.linear.app/782f462e-f3ab-4502-b987-d3307d9957e9/1c1d68f2-008e-42ec-bddb-3251c58d2457/43b0d56c-a33f-44c9-9a12-559c9a15feb7?signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRoIjoiLzc4MmY0NjJlLWYzYWItNDUwMi1iOTg3LWQzMzA3ZDk5NTdlOS8xYzFkNjhmMi0wMDhlLTQyZWMtYmRkYi0zMjUxYzU4ZDI0NTcvNDNiMGQ1NmMtYTMzZi00NGM5LTlhMTItNTU5YzlhMTVmZWI3IiwiaWF0IjoxNzg5ODUyMTA4LCJleHAiOjE3ODk4NTI0MDh9.LAB4SCITFnhPxbx9m-oE2cluiCarpben1BNlCuPpr5I)

**For type pairings:**

* [commercialtype.com](<http://commercialtype.com>) — professional type foundry catalog, browse by category
* [fontpair.co](<http://fontpair.co>) — pre-tested pairings across categories
* VJ Type — distinctive display/statement typefaces

![](https://uploads.linear.app/782f462e-f3ab-4502-b987-d3307d9957e9/aea9edc5-ed95-4c91-8cbc-a0602b543220/7b926cc2-d92b-4c54-baab-6675ce8c06bd?signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRoIjoiLzc4MmY0NjJlLWYzYWItNDUwMi1iOTg3LWQzMzA3ZDk5NTdlOS9hZWE5ZWRjNS1lZDk1LTRjOTEtOGNiYy1hMDYwMmI1NDMyMjAvN2I5MjZjYzItZDkyYi00YzU0LWJhYWItNjY3NWNlOGMwNmJkIiwiaWF0IjoxNzg5ODUyMTA4LCJleHAiOjE3ODk4NTI0MDh9.nYt90mLfNKN_ydHsltNwF-LmbfyrFXrGjIjw7GmP7g0)

![](https://uploads.linear.app/782f462e-f3ab-4502-b987-d3307d9957e9/d86db3d6-4ec2-4d2b-8353-e51de54799fd/d9889a1c-cf3c-4789-a687-51a04550d738?signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRoIjoiLzc4MmY0NjJlLWYzYWItNDUwMi1iOTg3LWQzMzA3ZDk5NTdlOS9kODZkYjNkNi00ZWMyLTRkMmItODM1My1lNTFkZTU0Nzk5ZmQvZDk4ODlhMWMtY2YzYy00Nzg5LWE2ODctNTFhMDQ1NTBkNzM4IiwiaWF0IjoxNzg5ODUyMTA4LCJleHAiOjE3ODk4NTI0MDh9.vU9eKX0ho3hOYZXSqctuUAAC3312XJEsCePzzRDeXLU)

![](https://uploads.linear.app/782f462e-f3ab-4502-b987-d3307d9957e9/cd8a07e4-b143-4ddb-b063-5b7f43578fcd/bf820441-5c36-47b2-825a-04fa269f2b9e?signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRoIjoiLzc4MmY0NjJlLWYzYWItNDUwMi1iOTg3LWQzMzA3ZDk5NTdlOS9jZDhhMDdlNC1iMTQzLTRkZGItYjA2My01YjdmNDM1NzhmY2QvYmY4MjA0NDEtNWMzNi00N2IyLTgyNWEtMDRmYTI2OWYyYjllIiwiaWF0IjoxNzg5ODUyMTA4LCJleHAiOjE3ODk4NTI0MDh9.13vfHhULPRMKP7zMiUIWruqIbydZ-FVGyBiNyUVwm0Y)

**Checklist for whatever palette/pairing gets picked:**

![](https://uploads.linear.app/782f462e-f3ab-4502-b987-d3307d9957e9/5dca7408-2fd2-48d4-9864-005a5be5f937/44c76236-fd23-40ad-917d-9fbbf163398d?signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRoIjoiLzc4MmY0NjJlLWYzYWItNDUwMi1iOTg3LWQzMzA3ZDk5NTdlOS81ZGNhNzQwOC0yZmQyLTQ4ZDQtOTg2NC0wMDVhNWJlNWY5MzcvNDRjNzYyMzYtZmQyMy00MGFkLTkxN2QtOWZiYmYxNjMzOThkIiwiaWF0IjoxNzg5ODUyMTA4LCJleHAiOjE3ODk4NTI0MDh9.QczIRJ_aac88BwhccH_Z_sT43qR_E4YocfKeHHdc5M0)

This section is deliberately generic — no project-specific palette or type choice belongs here. Whatever gets picked for a given project (Soldbay or otherwise) goes into that project's own Design System Reference doc, built on top of this process and the Apple type/color foundation above.

# Accessibility & color rules (non-negotiable, every project)

These apply regardless of how vibrant or restrained a palette is — they're the floor, not a style choice.

* **Color proportion — 60/30/10**: 60% primary/neutral (backgrounds, base surfaces), 30% secondary (supporting UI), 10% accent (the one color that should pop — CTAs, key highlights). This is what keeps an energetic accent color from becoming visual noise.
* **Contrast ratio — WCAG minimums**: at least 4.5:1 for normal text, 3:1 for large text (24px+/bold 19px+) and for UI component boundaries (buttons, input borders, icons carrying meaning). Check every text-on-background and icon-on-background pairing actually used, not just the palette in isolation.
* **Color blindness**: never let color alone carry meaning. Every semantic color (success/warning/error/info) needs a second signal too — icon, label, shape, or pattern — so someone with protanopia, deuteranopia, or tritanopia isn't lost. Test the palette against a color-blindness simulator before locking it in, not after.
* **Check under real conditions**: verify legibility in both light and dark mode, and under harsh lighting (outdoor sun glare, low-light rooms) — a palette that only looks right in a design tool at 100% brightness isn't validated yet.

These rules apply to any project this doc is reused for — they don't get relaxed for a specific brand's personality.
