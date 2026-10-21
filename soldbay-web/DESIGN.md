# Soldbay Buyer Design System & Screen Architecture

> ## HISTORICAL — do not use as an active design specification
>
> This older buyer design reference predates the current Soldbay product and design
> decisions. Use the AllOnSoldBay Linear project's Feature/Workflow Inventory,
> Design System Reference, and the three locked prototype HTML files as specified
> by the Workflow & Continuation Guide. In particular, neither this file's green/
> coral palette nor its later teal/Manrope summary is authoritative.
>
> This file is kept for historical reference. Current web/Admin/Ops design rules
> are in the Linear project documents. The deployed web theme in `src/app/globals.css`
> still contains the superseded olive palette; the design has not yet been applied
> to that surface. `design/handoff_manifest.md` is also historical unless confirmed
> against the current Linear Admin/Ops documents.
>
> Anything below this line describes the old product framing (cart, delivery, wishlist,
> discount badges) which the escrow/pickup model has also superseded.

---

> **[Historical]** Source of truth for all Soldbay Buyer UI across Mobile App (React Native / Expo), Web, and Pen.dev Canvas (`design/starter.pen`).

---

## 1. Brand Identity & New Color System (Green / White / Warm Neutral)

Soldbay has transitioned completely to a fresh, clean modern luxury marketplace aesthetic featuring **Deep Forest Green (`#3b7e68` / `#2e7d60`)**, **Pure White (`#ffffff`)**, **Warm Off-White (`#fcfbf9`)**, and **Warm Coral / Terracotta accents (`#df4a32`)**.

### Color Tokens

| Role                      | Token / Name                     | Hex Code              | Usage                                                                                 |
| ------------------------- | -------------------------------- | --------------------- | ------------------------------------------------------------------------------------- |
| **Primary Brand**         | `primary` / Green                | `#3b7e68`             | Primary action buttons (_Next_, _Show Now_, _Pay Now_), checkmarks, active indicators |
| **Primary Dark**          | `primary-dark`                   | `#285b4b`             | Pressed button states, dark green badges                                              |
| **Primary Light / Tint**  | `primary-light` / `primary-tint` | `#eaf4f0` / `#edf7f3` | Icon circles, badge backgrounds, selected filter pills                                |
| **Accent Action / Coral** | `accent` / Coral Red             | `#df4a32` / `#e25841` | Wishlist hearts, discount tags (`-30%`, `-50%`), cart badge count, active tab         |
| **Card Accent Orange**    | `card-orange` / Terracotta       | `#c85a2b`             | Payment card (Mastercard), warm accent banners                                        |
| **Background Base**       | `background` / Warm Off-White    | `#fcfbf9` / `#f8f7f5` | Main app background canvas                                                            |
| **Surface Pure White**    | `surface` / `card`               | `#ffffff`             | Product cards, search bar, sheets, header cards                                       |
| **Warm Top Gradient**     | `bg-warm-top`                    | `#f7efe4`             | Subtle warm champagne gradient header on Discovery Home                               |
| **Text Primary**          | `text-primary`                   | `#111827`             | Headings, product titles, bold prices                                                 |
| **Text Secondary**        | `text-secondary`                 | `#6b7280`             | Subtitles, descriptions, ratings review counts, metadata                              |
| **Text Tertiary**         | `text-tertiary`                  | `#9ca3af`             | Placeholders, inactive tab icons                                                      |
| **Borders & Dividers**    | `border` / `card-border`         | `#eeebe5` / `#f0ede6` | Card outlines, input borders, item separators                                         |
| **Star Rating**           | `star-yellow`                    | `#f59e0b`             | Product review stars                                                                  |
| **Status Pending**        | `pending-bg` / `pending-text`    | `#fff4ed` / `#ea580c` | Order status pills (_Pending Pickup / In Transit_)                                    |
| **Status Delivered**      | `success`                        | `#10b981`             | Completed orders, verified tags, cash on delivery                                     |

---

## 2. Typography & Scale

| Role                    | Font Family           | Weights                                                 | Usage                                                      |
| ----------------------- | --------------------- | ------------------------------------------------------- | ---------------------------------------------------------- |
| **Display / Headlines** | `Bricolage Grotesque` | 600 (Semibold), 700 (Bold)                              | Main screen titles, hero titles, product names, price tags |
| **Body / UI Elements**  | `Inter`               | 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) | Subtitles, buttons, input fields, badges, stepper controls |

### Scale Rules (8pt Grid Enforced)

- **Display XL (26–28pt)**: Onboarding & Welcome titles (_"Explore Fashion Categories"_, _"Let's Get Started"_)
- **Display L (20–22pt)**: Screen titles (_"My Orders"_, _"My Profile"_, _"Product Detail"_)
- **Heading M (16–18pt)**: Category title (_"Shop by Category"_), Price in details (`$50.00`), Cart sheet total
- **Body M (12–14pt)**: Product card titles, button labels, list items, search inputs
- **Body S / Caption (10–11pt)**: Rating reviews, seller handles, tag labels, status pills

---

## 3. Screen Structure & Canvas Map (`design/starter.pen`)

All 10 screens are organized in 2 rows of 5 screens:

```
Row 1 (y = 0):
[1] Onboarding (x: 0)  |  [2] Welcome / Get Started (x: 430)  |  [3] Home Feed (x: 860)  |  [4] Catalog & Filter (x: 1290)  |  [5] Product Detail (x: 1720)

Row 2 (y = 900):
[6] Cart (x: 0)        |  [7] Payment & Checkout (x: 430)     |  [8] Order Details (x: 860)  |  [9] My Orders List (x: 1290)  |  [10] Profile & Account (x: 1720)
```

### Screen Specifications

#### 1. Onboarding — Explore Categories (`x: 0, y: 0`)

- Soft green hero illustration box with shopping bag mark & tag badge.
- Centered headline: _"Explore Fashion Categories"_.
- Subtitle: _"Enjoy a hassle free shopping experience with secure payment options and quick delivery. Shop confidently"_.
- Pill Button: Deep Green (`#3b7e68`) _"Next"_.

#### 2. Welcome — Let's Get Started (`x: 430, y: 0`)

- Top back button + headline _"Let's Get Started"_.
- Shopper illustration box with _"🛍️ Soldbay Fashion"_ badge.
- Action Buttons: Deep Green _"Sign In with Email"_ + Outline _"Create New Account"_.

#### 3. Buyer — Home & Discovery (`x: 860, y: 0`)

- Header: User greeting (_"Hello, Let's shop!"_), Red wishlist heart, Red cart count badge (`2`).
- Search Bar: White rounded pill with search icon, microphone, and camera scan tools.
- Hero Promo Banner: Warm beige card (_"New Collection"_, _"Discount 50% for the first transaction"_, Green _"Show Now"_ button).
- Value Props Bar: _Cash on Delivery_ (Green), _Free Delivery Free Returns_ (Coral), _Lowest Price_ (Yellow).
- Shop by Category: 2 Featured tiles (_Coats & Jackets_, _Men's Fashion_) + 3 square tiles (_Shirts_, _Watches_, _Shoes_).
- Bottom Tab Bar: White dock with active Coral Home icon.

#### 4. Buyer — Catalog & Filter (`x: 1290, y: 0`)

- Header: Back button, _"Man Dress"_, Search, Red cart badge (`3`).
- Filter Bar: _Sort By ▾_, _Category ▾_, _Size ▾_, _Filter ⚙_.
- 2-Column Product Grid: Product cards with wishlist hearts, discount badge (`-30%`), strikethrough prices, ratings (`★ 4.2`).

#### 5. Buyer — Product Detail (`x: 1720, y: 0`)

- Large hero product image card with model photo placeholder.
- Variation selector: 2 thumbnail swatches + _"Variations ‹"_ + Heart icon.
- Title: _"Men Cotton Jacket"_, Price `$50.00`, Rating `★★★★☆ 999+ ›`, _"Size: XS ›"_ pill.
- Seller Card: _"FP / Fervorpixel"_, _"📍 USA"_, Green chat message button.
- Easy Shipping Box: Free standard shipping, 5-7 days delivery, 14-day free returns.

#### 6. Buyer — Cart & Checkout Summary (`x: 0, y: 900`)

- Header: Back arrow, _"Cart"_, Search.
- Promo Banner: Deep Green card (_"30% OFF - Use code FV563# at checkout"_) with orange side accent tab.
- Cart Items: Product thumbnail, title, price, size pill, and stepper `[−] 1 [+]`.
- Bottom Sheet: Subtotal (`$100.00`) and Green _"Proceed to Checkout"_ button.

#### 7. Buyer — Payment & Checkout (`x: 430, y: 900`)

- Horizontal Payment Cards: _+ (Add Card)_ circle tile, Mastercard Card (Terracotta `#c85a2b`, `•••• 2048`, active checkmark box), Visa Card (Deep Green `#3b7e68`, `•••• 1981`).
- Order Summary Card: Total Items Qty (2), Subtotal ($100.00), Discount ($00.00), Regular Shipping ($15.00), Total ($100.00).
- Action CTA: Full-width Deep Green _"Pay Now"_ pill button.

#### 8. Buyer — Order Details (`x: 860, y: 900`)

- General Info Card: Order ID (`#26531`), Date (`05 May 2024 - 06 : 30 PM`), Delivery (_Cash On Delivery_ in Green), Status (_Pending_ in Peach pill).
- Order Info: Ordered items list with size, quantity, and price breakdown.
- Delivery Routing: From Store (_House 25, Road 5, New York_) to Destination (_3676 Harley Vincent Drive_).
- Store Info: Fervorpixel avatar and green chat button.

#### 9. Buyer — My Orders List (`x: 1290, y: 900`)

- Tabs: _Active (1)_ (Green pill), _Completed (12)_.
- Active Order: Order #26531, 2 items, $100.00, _"🟡 In Transit"_, Green _"Track Order"_ button.
- Completed Order: Order #24109, 1 item, $38.00, _"✓ Delivered"_, _"Buy Again"_ button.

#### 10. Buyer — Profile & Account (`x: 1720, y: 900`)

- User Profile: Alexander Wright, Stanford University.
- Metrics Bar: 14 Orders | 4 Saved | $340 Saved.
- Settings Menu: Campus Delivery Address, Saved Cards & Payment, Switch to Seller Dashboard.

---
