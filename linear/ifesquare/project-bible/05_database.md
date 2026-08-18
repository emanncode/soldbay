# 05. Database Schema

The database is built on PostgreSQL, hosted on Neon, and managed with Prisma ORM. 

---

## Enums

### `Role` (Waitlist scope)
* `BUYER`
* `SELLER`

### `SellFrequency` (Waitlist seller frequency)
* `DAILY`
* `WEEKLY`
* `OCCASIONALLY`

### `UserRole` (Application scope)
* `BUYER`
* `SELLER`
* `ADMIN`

---

## Data Models

### `WaitlistSignup`
Captures user interest prior to launch.
* **id**: `String` (Primary Key, CUID)
* **role**: `Role` (Enum)
* **name**: `String`
* **email**: `String` (Unique)
* **university**: `String`
* **level**: `String` (Nullable, buyer's year of study)
* **categories**: `String[]` (Interests or listing categories)
* **sellsWhat**: `String` (Nullable, description of seller merchandise)
* **frequency**: `SellFrequency` (Nullable, Enum)
* **pollAnswers**: `String[]` (Survey selections)
* **createdAt**: `DateTime` (Defaults to current timestamp)

### `SiteQuestion`
Public queries sent via contact forms.
* **id**: `String` (Primary Key, CUID)
* **name**: `String`
* **email**: `String`
* **question**: `String` (Message content)
* **createdAt**: `DateTime` (Defaults to current timestamp)

### `University`
Higher education campuses registered on Soldbay.
* **id**: `String` (Primary Key, CUID)
* **name**: `String` (Unique, e.g. "University of Lagos")
* **code**: `String` (Unique, e.g. "UNILAG")
* **users**: `User[]` (Relation: 1-to-Many Users)

### `User`
Main accounts database.
* **id**: `String` (Primary Key, CUID)
* **email**: `String` (Unique)
* **emailVerified**: `DateTime` (Nullable, verification timestamp)
* **password**: `String` (Nullable, bcrypt hashed string; required for credentials)
* **name**: `String`
* **phone**: `String` (Nullable)
* **role**: `UserRole` (Enum)
* **universityId**: `String` (Nullable, foreign key to University)
* **university**: `University` (Relation: Many-to-1 University, nullable)
* **level**: `String` (Nullable, academic level)
* **verified**: `Boolean` (Defaults to `false`)
* **createdAt**: `DateTime` (Defaults to current timestamp)
* **sellerProfile**: `SellerProfile` (Relation: 1-to-1 SellerProfile)
* **accounts**: `Account[]` (Relation: 1-to-Many Accounts for OAuth)
* **sessions**: `Session[]` (Relation: 1-to-Many NextAuth Sessions)

### `Account` (NextAuth OAuth credentials mapping)
* **id**: `String` (Primary Key, CUID)
* **userId**: `String` (Foreign key linking to User)
* **type**: `String`
* **provider**: `String`
* **providerAccountId**: `String`
* **refresh_token**: `String` (Nullable, text column)
* **access_token**: `String` (Nullable, text column)
* **expires_at**: `Int` (Nullable)
* **token_type**: `String` (Nullable)
* **scope**: `String` (Nullable)
* **id_token**: `String` (Nullable, text column)
* **session_state**: `String` (Nullable)
* **user**: `User` (Relation: Many-to-1 User, Cascade on delete)
* *Constraints*: Unique combination of `[provider, providerAccountId]`

### `Session` (NextAuth cookie-based sessions)
* **id**: `String` (Primary Key, CUID)
* **sessionToken**: `String` (Unique)
* **userId**: `String` (Foreign key linking to User)
* **expires**: `DateTime`
* **user**: `User` (Relation: Many-to-1 User, Cascade on delete)

### `VerificationToken` (NextAuth token confirmation)
* **identifier**: `String`
* **token**: `String` (Unique)
* **expires**: `DateTime`
* *Constraints*: Unique combination of `[identifier, token]`

### `SellerProfile`
Extended dashboard profile for users in the `SELLER` role.
* **id**: `String` (Primary Key, CUID)
* **userId**: `String` (Unique, Foreign key linking to User)
* **user**: `User` (Relation: 1-to-1 User)
* **username**: `String` (Unique slug, e.g. "samueljohnson")
* **businessName**: `String` (Nullable, optional business brand name)
* **bio**: `String` (Nullable)
* **walletBalance**: `Decimal` (Defaults to `0`, keeps track of sales)
* **idImageUrl**: `String` (Nullable, URL path pointing to verification image on Vercel Blob)
* **verifiedAt**: `DateTime` (Nullable, admin authorization timestamp)
* **listings**: `Listing[]` (Relation: 1-to-Many Listings)

### `Category`
Product categories.
* **id**: `String` (Primary Key, CUID)
* **name**: `String` (Unique, e.g., "Textbooks")
* **slug**: `String` (Unique, e.g., "textbooks")
* **commissionRate**: `Decimal` (Platform commission percentage for sales in this category)
* **listings**: `Listing[]` (Relation: 1-to-Many Listings)

### `Listing`
Product listings created by sellers.
* **id**: `String` (Primary Key, CUID)
* **sellerId**: `String` (Foreign key linking to SellerProfile)
* **seller**: `SellerProfile` (Relation: Many-to-1 SellerProfile)
* **categoryId**: `String` (Foreign key linking to Category)
* **category**: `Category` (Relation: Many-to-1 Category)
* **title**: `String`
* **description**: `String`
* **price**: `Decimal` (Sale price of the item)
* **images**: `String[]` (List of image URLs hosted on Vercel Blob)
* **stock**: `Int` (Defaults to `1`, number of items available)
* **status**: `String` (Defaults to `"ACTIVE"`; states: `"ACTIVE"`, `"SOLD"`, `"INACTIVE"`)
* **createdAt**: `DateTime` (Defaults to current timestamp)

---

## Indexes & Constraints

The following database indexes are implemented in `schema.prisma` for performance tuning:

### Listings Indexes
* **`@@index([sellerId])`**: Optimizes queries fetching listings belonging to a specific seller for dashboard rendering.
* **`@@index([status, createdAt(sort: Desc)])`**: Optimizes marketplace main feeds fetching active listings ordered by creation date.
* **`@@index([categoryId, status, createdAt(sort: Desc)])`**: Optimizes category-specific browsing screens searching active listings in desc order.

### Unique Constraints
* **User**: Email address uniqueness constraints.
* **WaitlistSignup**: Email address uniqueness constraints.
* **SellerProfile**: Username uniqueness and User ID binding.
* **University**: Unique name and unique abbreviation code.
* **Category**: Unique name and slug.
* **Account**: Unique provider combination `@@unique([provider, providerAccountId])`.
* **VerificationToken**: Unique key combination `@@unique([identifier, token])`.

---

## Policies & Triggers
* **Row-Level Security (RLS)**: Not natively managed by Prisma. If Prisma is directly accessing the database with root connection strings, application code routes (`src/middleware.ts` and API check-guards) must enforce user authentication permissions.
* **Cascade Delete**: Cascade deletions are configured for `Account` and `Session` models. If a `User` record is deleted, corresponding login sessions and accounts are automatically purged from the database.
