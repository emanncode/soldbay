# Soldbay Color System & Pairings

This document defines the complete Orange & Teal color palette used across the Soldbay project (app and web surfaces), along with their exact RGB/RGBA translations and the strict pairing rules to maintain accessible contrast in both Light and Dark modes.

## Color Reference Table

| Token Name         | Hex       | RGB                  | RGBA (100% opacity)        | Description / Role                                    |
| :----------------- | :-------- | :------------------- | :------------------------- | :---------------------------------------------------- |
| **primaryText**    | `#031F21` | `rgb(3, 31, 33)`     | `rgba(3, 31, 33, 1.0)`     | Light-mode primary body text                          |
| **secondaryText**  | `#063F42` | `rgb(6, 63, 66)`     | `rgba(6, 63, 66, 1.0)`     | Light-mode secondary text; Dark-mode elevated surface |
| **bgBase**         | `#FFFFFF` | `rgb(255, 255, 255)` | `rgba(255, 255, 255, 1.0)` | Light-mode base surface                               |
| **bgCard**         | `#FFD0A6` | `rgb(255, 208, 166)` | `rgba(255, 208, 166, 1.0)` | Light-mode cards, selected tab fills                  |
| **darkBg**         | `#031F21` | `rgb(3, 31, 33)`     | `rgba(3, 31, 33, 1.0)`     | Dark-mode base surface (matches primaryText)          |
| **darkBgStep**     | `#063F42` | `rgb(6, 63, 66)`     | `rgba(6, 63, 66, 1.0)`     | Dark-mode elevated surface (matches secondaryText)    |
| **darkText**       | `#FFFFFF` | `rgb(255, 255, 255)` | `rgba(255, 255, 255, 1.0)` | Dark-mode primary text                                |
| **borderLight**    | `#008080` | `rgb(0, 128, 128)`   | `rgba(0, 128, 128, 1.0)`   | Light-mode border (typically used at 10-20% opacity)  |
| **borderDark**     | `#67B8B3` | `rgb(103, 184, 179)` | `rgba(103, 184, 179, 1.0)` | Dark-mode border (24% opacity) and secondary text     |
| **accent**         | `#F47A32` | `rgb(244, 122, 50)`  | `rgba(244, 122, 50, 1.0)`  | Primary accent for buttons, badges, icons             |
| **discountFill**   | `#FFB980` | `rgb(255, 185, 128)` | `rgba(255, 185, 128, 1.0)` | Background fill for discount badges                   |
| **discountStroke** | `#F47A32` | `rgb(244, 122, 50)`  | `rgba(244, 122, 50, 1.0)`  | Border stroke for discount badges (matches accent)    |
| **success**        | `#14532D` | `rgb(20, 83, 45)`    | `rgba(20, 83, 45, 1.0)`    | Light-mode success (Completed)                        |
| **warning**        | `#6B4E00` | `rgb(107, 78, 0)`    | `rgba(107, 78, 0, 1.0)`    | Light-mode warning (Awaiting handoff)                 |
| **error**          | `#8B1A10` | `rgb(139, 26, 16)`   | `rgba(139, 26, 16, 1.0)`   | Light-mode error (Disputed)                           |
| **info**           | `#0D3B7A` | `rgb(13, 59, 122)`   | `rgba(13, 59, 122, 1.0)`   | Light-mode info (Pending pickup)                      |
| **darkSuccess**    | `#4ADE80` | `rgb(74, 222, 128)`  | `rgba(74, 222, 128, 1.0)`  | Dark-mode success (Completed)                         |
| **darkWarning**    | `#FACC15` | `rgb(250, 204, 21)`  | `rgba(250, 204, 21, 1.0)`  | Dark-mode warning (Awaiting handoff)                  |
| **darkError**      | `#F87171` | `rgb(248, 113, 113)` | `rgba(248, 113, 113, 1.0)` | Dark-mode error (Disputed)                            |
| **darkInfo**       | `#60A5FA` | `rgb(96, 165, 250)`  | `rgba(96, 165, 250, 1.0)`  | Dark-mode info (Pending pickup)                       |

---

## Approved Color Pairings & Contrast Rules

To ensure visual comfort and WCAG accessibility compliance, colors must only be combined in these specific pairings.

### 1. General Surfaces & Typography

| Background                             | Primary Text              | Secondary Text              | Borders                   |
| :------------------------------------- | :------------------------ | :-------------------------- | :------------------------ |
| **Light Base** (`bgBase` `#FFFFFF`)    | `primaryText` (`#031F21`) | `secondaryText` (`#063F42`) | `borderLight/10` to `/20` |
| **Dark Base** (`darkBg` `#031F21`)     | `darkText` (`#FFFFFF`)    | `borderDark` (`#67B8B3`)    | `borderDark/24`           |
| **Dark Step** (`darkBgStep` `#063F42`) | `darkText` (`#FFFFFF`)    | `borderDark` (`#67B8B3`)    | `borderDark/24`           |

### 2. Primary Accent & Badges

| Element Background                            | Text / Icon Color                            |
| :-------------------------------------------- | :------------------------------------------- |
| **Accent Button** (`accent` `#F47A32`)        | `bgBase` (`#FFFFFF`) or `darkBg` (`#031F21`) |
| **Discount Badge** (`discountFill` `#FFB980`) | `primaryText` (`#031F21`)                    |

### 3. Semantic Status Pills (Order States)

The background colors for Semantic states completely flip their luminance between Light and Dark mode. Therefore, the text color **must flip** as well to maintain contrast. White text on dark mode semantic colors (`#4ADE80`, `#FACC15`) is unreadable.

| Mode                       | Background                | Status    | Text Color                     |
| :------------------------- | :------------------------ | :-------- | :----------------------------- |
| **Light Mode** (Dark Fill) | `success` (`#14532D`)     | Completed | **White** (`bgBase` `#FFFFFF`) |
| **Light Mode** (Dark Fill) | `warning` (`#6B4E00`)     | Awaiting  | **White** (`bgBase` `#FFFFFF`) |
| **Light Mode** (Dark Fill) | `error` (`#8B1A10`)       | Disputed  | **White** (`bgBase` `#FFFFFF`) |
| **Light Mode** (Dark Fill) | `info` (`#0D3B7A`)        | Pending   | **White** (`bgBase` `#FFFFFF`) |
|                            |                           |           |                                |
| **Dark Mode** (Light Fill) | `darkSuccess` (`#4ADE80`) | Completed | **Dark** (`darkBg` `#031F21`)  |
| **Dark Mode** (Light Fill) | `darkWarning` (`#FACC15`) | Awaiting  | **Dark** (`darkBg` `#031F21`)  |
| **Dark Mode** (Light Fill) | `darkError` (`#F87171`)   | Disputed  | **Dark** (`darkBg` `#031F21`)  |
| **Dark Mode** (Light Fill) | `darkInfo` (`#60A5FA`)    | Pending   | **Dark** (`darkBg` `#031F21`)  |
