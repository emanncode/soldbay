# 02. Feature Specifications

## Authentication & Verification

### Credentials Registration & Login
* **Email & Password**: Support standard credentials-based signup and login. 
* **Password Security**: Passwords must be at least 8 characters and are securely hashed using `bcryptjs` with 12 rounds.
* **Email Uniqueness**: Prevent registration of duplicate email addresses with robust error handling (HTTP 409 Conflict).
* **NextAuth Session (Web)**: Web portal uses NextAuth.js (v5) cookie-based session management for browser authentication.
* **Token Authentication (Mobile)**: Mobile client retrieves a JWT token (`Authorization: Bearer <token>`) upon successful authentication to bypass session cookie limitations in native environments.

### Seller Verification Profile
* **Student Verification Form**: Sellers submit their university-specific registration form including name, matriculation number, and an upload of their Student ID card.
* **ID Card Uploads**: Student ID images are uploaded via multipart form data to Vercel Blob and stored in the database.
* **Verification Status**: New seller profiles remain unverified (`verifiedAt = null`) and listings cannot be created or viewed publicly until an admin approves the account.

---

## Waitlist (Pre-launch Phase)

* **Pre-Registration Flow**: Prospective users join the waitlist as either a Buyer or a Seller.
* **Data Capture**:
  * Shared: Full Name, Email (unique), University (selected from list).
  * Buyer specific: Level/Year of study (optional), interested categories.
  * Seller specific: Focus areas (categories of items they sell), frequency of selling (daily, weekly, occasionally).
* **Social Proof Counter**: Interactive dashboard displays the live count of signed-up users across all universities without disclosing personally identifiable information (PII).
* **Ask a Question**: Contact form allowing users to submit queries, automatically creating site question records in the database.

---

## Buyer Features

* **University Landing**: Filter marketplace listings dynamically based on the student's selected campus.
* **Category Navigation**: Browse items sorted into five primary categories: Textbooks, Gadgets, Food, Services, and Clothing.
* **Product Search**: Multi-word case-insensitive query searching against listing titles and descriptions.
* **Listing Details**: Detailed view containing product descriptions, price, item quantity (stock), multiple images, and seller profiles.
* **Secure Payment**: Paystack integration holding transaction funds in a secure escrow buffer.
* **Receipt Confirmation**: Interactive button allowing buyers to confirm item pickup, prompting immediate escrow release.

---

## Seller Features

* **Store Customization**: Define customized usernames (automatically slugified and checked for uniqueness), business names, and bios.
* **Listing Management**:
  * Create listings containing titles, descriptions, prices, stock levels, categories, and multiple images.
  * Image uploads are processed via a dedicated API endpoint (`/api/upload/listing-image`) and saved in public folders on Vercel Blob.
  * Delete listings, removing database records and public visibility.
* **Seller Wallet**: A decimal-based wallet system (`walletBalance`) tracks cleared earnings.
* **Seller Dashboard**: Visual interface to track active listings, stock, wallet balances, and account verification status.

---

## Escrow & Payout System

* **Payment Holding**: Buyer payments are captured via Paystack and locked in Soldbay's platform account.
* **Payout Workflow**:
  * Funds remain locked until the buyer triggers "Confirm Delivery" or the 48-hour delivery window closes without a dispute.
  * Once confirmed, the listing price (less category-based platform commission) is credited to the seller's `walletBalance`.
* **Dispute Processing**: Admin intervention halts payouts when a dispute is opened, allowing manual resolution and refund capability.
