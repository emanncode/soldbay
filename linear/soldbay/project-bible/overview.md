# SoldBay — Project Overview & Architecture Guide

## 1. Project Mission & Identity
SoldBay is a student-to-student verified marketplace designed for university campuses across Nigeria and Africa. It provides a secure, streamlined platform where students can discover, buy, and sell campus essentials (textbooks, electronics, fashion, food, dorm items, and services).

## 2. Core Architectural Pillars

### A. Dual Role Architecture
- **Buyer Role**:
  - Open discovery experience.
  - University selection is optional (skippable).
  - Can browse campus listings and view detailed seller and product information.
- **Seller Role**:
  - Compulsory campus selection.
  - Compulsory student status verification via **Student Portal Home Page Screenshot** (not exam portal).
  - Unlocks Seller Dashboard, listing management, wallet balance, and payout requests upon admin approval.

### B. Tech Stack
- **Mobile Client**: React Native + Expo (v57+), Expo Router (file-based routing), Lucide / Ionicons icons, NativeWind / Tailwind CSS, custom dark-glass UI styling.
- **Web Backend & API**: Next.js (App Router API routes), PostgreSQL database, Prisma ORM, bcryptjs password hashing, JWT bearer token auth, Vercel Blob cloud storage for portal screenshots and listing images.

### C. Design System Standards
- **Typography**: `Bricolage Grotesque` for all titles/headers; `Inter` for all body copy, forms, pills, and subtitles.
- **Color Palette**: Deep Forest Green (`#3b7e68` / `#22c55e`), Coral/Terracotta accents (`#e1261c` / `#df4a32`), Dark Obsidian Canvas (`#0d0d0f` / `#18181b`).
- **Error & Dialog System**: Dedicated custom `ErrorBanner`, `ConfirmDialog`, and `ToastBanner` replacing native phone dialogs.
