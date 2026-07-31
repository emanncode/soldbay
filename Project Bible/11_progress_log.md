# 11. Progress Log

A living record of developer updates, completed items, system decisions, known issues, and next tasks.

---

## Log Entry: July 31, 2026

### What Was Completed
* **Waitlist Landing Web Page**: Completed the landing page and waitlist submission system (`soldbay-web`).
* **Prisma Schema Definitions**: Specified basic data models (`User`, `SellerProfile`, `Listing`, `University`, `Category`, `WaitlistSignup`, `SiteQuestion`) and configured the Postgres connection pool on Neon.
* **Web APIs**: Created endpoints for signups, waitlist submissions, categories, universities, and listing retrieval/creation.
* **Mobile Authentication Screens**: Designed basic Expo Native screens for login, registration, university configuration, and role selection in the mobile environment.
* **Project Bible System**: Initialized the full 11-part architectural documentation system under `Project Bible/`.

### What Changed
* **Session Cookies to Stateless JWT Tokens**: Upgraded authentication flows on the mobile client by creating the custom JWT generator (`/api/auth/mobile-login`) to avoid cookie tracking issues in native devices.
* **Theme Styling Standards**: Defined brand guidelines detailing role assignments for Purple (visual environment) and Red (actions).

### New Decisions
* **Verification ID Uploads**: Selected **Vercel Blob** as the storage provider for uploading student ID verification cards.
* **PostgreSQL Generation Target**: Configured Prisma schema outputs to write to local directory modules (`src/generated/prisma`) to maintain absolute type strictness across the Next.js routes.

### Known Bugs
* **Unverified Listings**: Currently, active listings GET queries do not filter by seller verification status. Any account in the database with a listing can post items regardless of validation status. (To be resolved in Version 2).
* **Matriculation Check Validation**: The matriculation card validator endpoint currently accepts any image file format without verifying the validity of the student details.

### Next Tasks
* Connect the mobile application's login and signup screens to the corresponding web endpoints.
* Establish routing guards inside `soldbay-app` checking user roles and redirecting to the corresponding workspace (Buyer Feed vs. Seller Dashboard).
* Configure the admin panel for reviewing uploaded seller student IDs.
