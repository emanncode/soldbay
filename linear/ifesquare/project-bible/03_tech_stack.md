# 03. Tech Stack Reference

## Frontend / Web Application (soldbay-web)

* **Core Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
* **Runtime Library**: React 19
* **Styling Engine**: [Tailwind CSS v4](https://tailwindcss.com/)
* **CSS Postprocessing**: `@tailwindcss/postcss`
* **Components & Primitives**:
  * [Radix UI](https://www.radix-ui.com/) (primitives for accessible modals, dropdowns, accordions)
  * [shadcn/ui](https://ui.shadcn.com/) (custom styled components using the Radix Luma theme)
  * [lucide-react](https://lucide.dev/) (icon library)
* **Animation & Motion**:
  * [Framer Motion](https://www.framer.com/motion/) (shared transition configurations and page animations)
* **Fonts**:
  * *Bricolage Grotesque* (Display and Section Headings)
  * *Inter* (Body copy and UI labels)

---

## Mobile Application (soldbay-app)

* **Development Engine**: [Expo SDK 57](https://expo.dev/)
* **Native Framework**: React Native 0.86.0
* **Routing System**: [Expo Router v57.0.8](https://docs.expo.dev/router/introduction/) (declarative file-based router)
* **Styling Engine**: [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
* **Interoperability**: `react-native-css-interop`
* **Animations**: [React Native Reanimated v4.5.0](https://docs.swmansion.com/react-native-reanimated/) (high-performance UI animations)
* **Core Utilities**:
  * `expo-blur` (glassmorphism/blur overlays)
  * `expo-image` (performant image rendering and caching)
  * `expo-image-picker` (native device image selection for listings and IDs)
  * `expo-secure-store` (secure storage for auth tokens)
  * `expo-linear-gradient` (gradient rendering)
  * `@expo-google-fonts/bricolage-grotesque` & `@expo-google-fonts/inter`

---

## Backend & API Architecture (soldbay-web/api)

* **API Routers**: Next.js Route Handlers (App Router endpoints)
* **Database client**: [Prisma ORM v7.9.1](https://www.prisma.io/)
* **Database Driver**: `pg` (node-postgres)
* **Database Adapter**: `@prisma/adapter-pg`
* **Authentication**:
  * [NextAuth.js v5 (Beta)](https://authjs.dev/) (handles browser session cookies, credentials provider, NextAuth endpoints)
  * Custom JWT Signer: `jose` & `jsonwebtoken` (signs stateless JWT tokens for mobile bearer auth)
* **Storage Provider**: [@vercel/blob](https://vercel.com/docs/storage/vercel-blob) (saves listing images and seller student ID cards)
* **Security & Utilities**:
  * `bcryptjs` (password hashing)
  * `clsx` & `tailwind-merge` (conditional CSS class rendering)
  * `tw-animate-css` (Tailwind animation classes)

---

## Database

* **Database Engine**: PostgreSQL
* **Hosting Platform**: [Neon Database](https://neon.tech/) (serverless Postgres with connection pooling)

---

## Deployment & Hosting

* **Web & API Host**: [Vercel](https://vercel.com/) (automatic edge deployment, serverless functions, environment configuration)
* **Mobile Build Pipeline**: [Expo Application Services (EAS)](https://expo.dev/eas) (handles Android `.apk`/`.aab` and iOS App Store compilation and OTA updates)
