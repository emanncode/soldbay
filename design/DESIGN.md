# Soldbay Buyer Design System & Screen Architecture

> **Source of truth** for all Soldbay Buyer UI across Mobile App (React Native / Expo), Web, and Pen.dev Canvas (`design/starter.pen`).

---

## 1. Brand Identity & New Color System (Green / White / Warm Neutral)

Soldbay has transitioned completely to a fresh, clean modern luxury marketplace aesthetic featuring **Deep Forest Green (`#3b7e68` / `#2e7d60`)**, **Pure White (`#ffffff`)**, **Warm Off-White (`#fcfbf9`)**, and **Warm Coral / Terracotta accents (`#df4a32`)**.

### Color Tokens

| Role | Token / Name | Hex Code | Usage |
|---|---|---|---|
| **Primary Brand** | `primary` / Green | `#3b7e68` | Primary action buttons (*Next*, *Show Now*, *Pay Now*), checkmarks, active indicators |
| **Primary Dark** | `primary-dark` | `#285b4b` | Pressed button states, dark green badges |
| **Primary Light / Tint** | `primary-light` / `primary-tint` | `#eaf4f0` / `#edf7f3` | Icon circles, badge backgrounds, selected filter pills |
| **Accent Action / Coral** | `accent` / Coral Red | `#df4a32` / `#e25841` | Wishlist hearts, discount tags (`-30%`, `-50%`), cart badge count, active tab |
| **Card Accent Orange** | `card-orange` / Terracotta | `#c85a2b` | Payment card (Mastercard), warm accent banners |
| **Background Base** | `background` / Warm Off-White | `#fcfbf9` / `#f8f7f5` | Main app background canvas |
| **Surface Pure White** | `surface` / `card` | `#ffffff` | Product cards, search bar, sheets, header cards |
| **Warm Top Gradient** | `bg-warm-top` | `#f7efe4` | Subtle warm champagne gradient header on Discovery Home |
| **Text Primary** | `text-primary` | `#111827` | Headings, product titles, bold prices |
| **Text Secondary** | `text-secondary` | `#6b7280` | Subtitles, descriptions, ratings review counts, metadata |
| **Text Tertiary** | `text-tertiary` | `#9ca3af` | Placeholders, inactive tab icons |
| **Borders & Dividers** | `border` / `card-border` | `#eeebe5` / `#f0ede6` | Card outlines, input borders, item separators |
| **Star Rating** | `star-yellow` | `#f59e0b` | Product review stars |
| **Status Pending** | `pending-bg` / `pending-text` | `#fff4ed` / `#ea580c` | Order status pills (*Pending Pickup / In Transit*) |
| **Status Delivered** | `success` | `#10b981` | Completed orders, verified tags, cash on delivery |

---

## 2. Typography & Scale

| Role | Font Family | Weights | Usage |
|---|---|---|---|
| **Display / Headlines** | `Bricolage Grotesque` | 600 (Semibold), 700 (Bold) | Main screen titles, hero titles, product names, price tags |
| **Body / UI Elements** | `Inter` | 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) | Subtitles, buttons, input fields, badges, stepper controls |

### Scale Rules (8pt Grid Enforced)
- **Display XL (26–28pt)**: Onboarding & Welcome titles (*"Explore Fashion Categories"*, *"Let's Get Started"*)
- **Display L (20–22pt)**: Screen titles (*"My Orders"*, *"My Profile"*, *"Product Detail"*)
- **Heading M (16–18pt)**: Category title (*"Shop by Category"*), Price in details (`$50.00`), Cart sheet total
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
- Centered headline: *"Explore Fashion Categories"*.
- Subtitle: *"Enjoy a hassle free shopping experience with secure payment options and quick delivery. Shop confidently"*.
- Pill Button: Deep Green (`#3b7e68`) *"Next"*.

#### 2. Welcome — Let's Get Started (`x: 430, y: 0`)
- Top back button + headline *"Let's Get Started"*.
- Shopper illustration box with *"🛍️ Soldbay Fashion"* badge.
- Action Buttons: Deep Green *"Sign In with Email"* + Outline *"Create New Account"*.

#### 3. Buyer — Home & Discovery (`x: 860, y: 0`)
- Header: User greeting (*"Hello, Let's shop!"*), Red wishlist heart, Red cart count badge (`2`).
- Search Bar: White rounded pill with search icon, microphone, and camera scan tools.
- Hero Promo Banner: Warm beige card (*"New Collection"*, *"Discount 50% for the first transaction"*, Green *"Show Now"* button).
- Value Props Bar: *Cash on Delivery* (Green), *Free Delivery Free Returns* (Coral), *Lowest Price* (Yellow).
- Shop by Category: 2 Featured tiles (*Coats & Jackets*, *Men's Fashion*) + 3 square tiles (*Shirts*, *Watches*, *Shoes*).
- Bottom Tab Bar: White dock with active Coral Home icon.

#### 4. Buyer — Catalog & Filter (`x: 1290, y: 0`)
- Header: Back button, *"Man Dress"*, Search, Red cart badge (`3`).
- Filter Bar: *Sort By ▾*, *Category ▾*, *Size ▾*, *Filter ⚙*.
- 2-Column Product Grid: Product cards with wishlist hearts, discount badge (`-30%`), strikethrough prices, ratings (`★ 4.2`).

#### 5. Buyer — Product Detail (`x: 1720, y: 0`)
- Large hero product image card with model photo placeholder.
- Variation selector: 2 thumbnail swatches + *"Variations ‹"* + Heart icon.
- Title: *"Men Cotton Jacket"*, Price `$50.00`, Rating `★★★★☆ 999+ ›`, *"Size: XS ›"* pill.
- Seller Card: *"FP / Fervorpixel"*, *"📍 USA"*, Green chat message button.
- Easy Shipping Box: Free standard shipping, 5-7 days delivery, 14-day free returns.

#### 6. Buyer — Cart & Checkout Summary (`x: 0, y: 900`)
- Header: Back arrow, *"Cart"*, Search.
- Promo Banner: Deep Green card (*"30% OFF - Use code FV563# at checkout"*) with orange side accent tab.
- Cart Items: Product thumbnail, title, price, size pill, and stepper `[−] 1 [+]`.
- Bottom Sheet: Subtotal (`$100.00`) and Green *"Proceed to Checkout"* button.

#### 7. Buyer — Payment & Checkout (`x: 430, y: 900`)
- Horizontal Payment Cards: *+ (Add Card)* circle tile, Mastercard Card (Terracotta `#c85a2b`, `•••• 2048`, active checkmark box), Visa Card (Deep Green `#3b7e68`, `•••• 1981`).
- Order Summary Card: Total Items Qty (2), Subtotal ($100.00), Discount ($00.00), Regular Shipping ($15.00), Total ($100.00).
- Action CTA: Full-width Deep Green *"Pay Now"* pill button.

#### 8. Buyer — Order Details (`x: 860, y: 900`)
- General Info Card: Order ID (`#26531`), Date (`05 May 2024 - 06 : 30 PM`), Delivery (*Cash On Delivery* in Green), Status (*Pending* in Peach pill).
- Order Info: Ordered items list with size, quantity, and price breakdown.
- Delivery Routing: From Store (*House 25, Road 5, New York*) to Destination (*3676 Harley Vincent Drive*).
- Store Info: Fervorpixel avatar and green chat button.

#### 9. Buyer — My Orders List (`x: 1290, y: 900`)
- Tabs: *Active (1)* (Green pill), *Completed (12)*.
- Active Order: Order #26531, 2 items, $100.00, *"🟡 In Transit"*, Green *"Track Order"* button.
- Completed Order: Order #24109, 1 item, $38.00, *"✓ Delivered"*, *"Buy Again"* button.

#### 10. Buyer — Profile & Account (`x: 1720, y: 900`)
- User Profile: Alexander Wright, Stanford University.
- Metrics Bar: 14 Orders | 4 Saved | $340 Saved.
- Settings Menu: Campus Delivery Address, Saved Cards & Payment, Switch to Seller Dashboard.

---
