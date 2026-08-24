# Soldbay Buyer Design System & Screen Architecture

> **Source of truth** for all Soldbay Buyer UI across Mobile App (React Native / Expo), Web, and Pen.dev Canvas (`design/starter.pen`).

---

## 1. Brand Identity & Global Color System (Green / White / Warm Neutral)

**Deep Forest Green (`#3b7e68` / `#2e7d60`)** serves as the **Global Color Code** and foundational anchor for the entire Soldbay project. All other secondary colors, tints, surfaces, and functional accents are systematically derived from and balanced against this root identity.

Soldbay has transitioned completely to a fresh, clean modern luxury marketplace aesthetic featuring **Deep Forest Green (`#3b7e68` / `#2e7d60`)**, **Pure White (`#ffffff`)**, **Warm Off-White (`#fcfbf9`)**, and **Warm Coral / Terracotta accents (`#df4a32`)**.

### Color Tokens

| Role | Token / Name | Hex Code | Usage |
|---|---|---|---|
| **Global Primary Brand** | `primary` / Forest Green | `#3b7e68` | Primary global brand color, primary action CTAs (*Next*, *Show Now*, *Pay Now*, *Proceed to Checkout*), checkmarks, active indicators |
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

## 2. Typography & Font System

Soldbay enforces a strict, universal typography rule across the entire project:

* **Headers & Titles**: **`Bricolage Grotesque`** (Weights: 600 SemiBold, 700 Bold, 800 ExtraBold) — **Strict Rule**: *Anything* that is a header, title, screen headline, display banner, modal title, or section heading **MUST** use `Bricolage Grotesque`.
* **Paragraphs, Body & Non-Headers**: **`Inter`** (Weights: 400 Regular, 500 Medium, 600 SemiBold) — **Strict Rule**: *All* paragraphs, body copy, descriptions, input fields, button labels, chips, status pills, subtitles, captions, and other UI elements that are not headers **MUST** use `Inter`.

### Font Token Mapping

| Hierarchy Role | Font Family | Weights | Usage Scope |
|---|---|---|---|
| **All Headers / Display / Headings** | `Bricolage Grotesque` | 600 (SemiBold), 700 (Bold), 800 (ExtraBold) | Hero headlines, screen titles, category headers, card titles, section headings |
| **Paragraphs / Body / All Non-Headers** | `Inter` | 400 (Regular), 500 (Medium), 600 (SemiBold) | Paragraphs, descriptions, subtitles, buttons, form inputs, badge text, metadata, tooltips |

### Scale Rules (8pt Grid Enforced)
- **Display XL (26–28pt mobile / 56px web)**: `Bricolage Grotesque Bold` — Onboarding & Welcome titles (*"Explore Fashion Categories"*, *"Let's Get Started"*)
- **Display L (20–22pt mobile / 40px web)**: `Bricolage Grotesque Bold` — Screen titles (*"My Orders"*, *"My Profile"*, *"Product Detail"*)
- **Heading M (16–18pt mobile / 24px web)**: `Bricolage Grotesque SemiBold` — Category title (*"Shop by Category"*), Price in details (`$50.00`), Cart sheet total
- **Body L / Intro (18px web / 16pt mobile)**: `Inter Regular` — Paragraph leads, hero subtitles
- **Body M / Paragraph (14–16px / 12–14pt)**: `Inter Regular` — Paragraphs, product descriptions, button labels, list items, search inputs
- **Body S / Caption (10–12pt / 12–14px)**: `Inter Medium / Regular` — Rating reviews, seller handles, tag labels, status pills

---

## 3. Screen Structure & Canvas Map (`design/starter.pen`)

All 19 screens are systematically arranged on the Pen canvas across 4 rows:

```
Row 1 (y = 0): Buyer Core Flow
[1] Onboarding (x: 0)  |  [2] Welcome (x: 430)  |  [3] Home Feed (x: 860)  |  [4] Catalog & Filter (x: 1290)  |  [5] Product Detail (x: 1720)

Row 2 (y = 900): Commerce & Checkout
[6] Cart (x: 0)        |  [7] Payment & Checkout (x: 430)  |  [8] Order Details (x: 860)  |  [9] My Orders List (x: 1290)  |  [10] Profile (x: 1720)

Row 3 (y = 1800): Authentication & Onboarding
[11] Sign In (x: 0)    |  [12] Sign Up (x: 430)  |  [13] Select Role (x: 860)  |  [14] Choose University (x: 1290)  |  [15] Verify Student Portal (x: 1720)

Row 4 (y = 2700): Password Reset Flow
[16] Forgot Password (x: 0)  |  [17] Enter 6-Digit OTP (x: 430)  |  [18] Set New Password (x: 860)  |  [19] Reset Success (x: 1290)
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

### Row 3: Authentication & Onboarding Flow

#### 11. Auth — Sign In / Login (`x: 0, y: 1800`)
- Title: *"Welcome Back"*, Subtitle: *"Sign in to buy and sell verified campus items."*
- Form inputs: Email Address & Password with show/hide toggle.
- "Forgot password?" right-aligned link in Deep Green.
- Deep Green CTA: *"Sign In"*.
- Footer: *"Don't have an account? Create account"*.

#### 12. Auth — Sign Up / Register (`x: 430, y: 1800`)
- Title: *"Create Account"*, Subtitle: *"Join Soldbay to connect with students on campus."*
- Role Selector Pill: *Buyer* (Active Green) vs. *Seller*.
- Form inputs: Full Name, Email Address, Password, Confirm Password.
- Deep Green CTA: *"Create Account"*.
- Footer: *"Already have an account? Sign In"*.

#### 13. Auth — Select Role (Buyer vs Seller) (`x: 860, y: 1800`)
- Title: *"Choose your Role"*, Subtitle: *"How would you like to participate in Soldbay on your campus?"*
- Buyer Card (Selected): Active green border, shopping bag icon, title *"I want to Buy"*, subtitle detailing browsing, dorm essentials, and campus delivery.
- Seller Card: Orange storefront icon, title *"I want to Sell"*, badge *"Requires Portal Verification"*, subtitle detailing opening store, listing inventory, and payouts.
- Action CTA: *"Continue as Buyer"* / *"Continue as Seller"*.

#### 14. Onboarding — Choose University (Skippable for Buyer) (`x: 1290, y: 1800`)
- Top Nav: Header title *"University"*, right-action *"Skip ›"*.
- Title: *"Choose your University"*, Subtitle: *"Connect with verified students on campus, or skip to start shopping right away."*
- Search Bar: Rounded pill search input with search icon.
- University List: Filtered cards with Federal/State badges (OAU selected with green checkmark, UNILAG, UI, FUTA, UNIBEN).
- Action CTA: Green *"Confirm Campus"* button + Secondary *"Skip for now (Go to Buyer Home)"*.

#### 15. Seller — Verify Student Portal (`x: 1720, y: 1800`)
- Header: *"Seller Verification"*.
- Title: *"Verify Student Portal"*, Subtitle: *"Upload a screenshot of your Student Portal home page (not exam portal) showing your name & matric number."*
- Upload Zone Box: White card with green dashed border, cloud upload icon, and format tag (*"JPG, PNG, WebP or HEIC (max 10 MB)"*).
- Security Row: Shield checkmark icon with text *"Your portal screenshot is encrypted and never shared with buyers."*
- Action CTA: Deep Green *"Choose Screenshot"* / *"Submit for Review"*.

---

### Row 4: Password Reset Flow

#### 16. Auth — Forgot Password (`x: 0, y: 2700`)
- Title: *"Reset Password"*, Subtitle: *"Enter your registered email address and we will send you a 6-digit reset code."*
- Email input field + Green CTA *"Send Verification Code"*.

#### 17. Auth — Enter 6-Digit OTP (`x: 430, y: 2700`)
- Title: *"Enter 6-Digit Code"*, Subtitle: *"We sent a 6-digit verification code to alex@student.unilag.edu.ng"*.
- 6-box OTP digit grid with active border indicator.
- Resend link with countdown timer.
- Action CTA: *"Verify Code"*.

#### 18. Auth — Set New Password (`x: 860, y: 2700`)
- Title: *"Set New Password"*, Subtitle: *"Create a strong new password for your Soldbay account."*
- Form inputs: New Password and Confirm New Password with eye toggles.
- Action CTA: *"Save New Password"*.

#### 19. Auth — Reset Success (`x: 1290, y: 2700`)
- Large glowing green checkmark circle.
- Title: *"Password Changed!"*, Subtitle: *"Your password has been successfully updated. You can now sign in with your new credentials."*
- Action CTA: *"Back to Sign In"*.
