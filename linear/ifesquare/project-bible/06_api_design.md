# 06. API Design

All endpoints are built using Next.js Route Handlers and return JSON responses.

---

## Authentication Endpoints

### 1. `POST /api/auth/signup`
Creates a new User account and optional Seller Profile.
* **Input**:
  ```json
  {
    "email": "student@unilag.edu.ng",
    "password": "securepassword123",
    "name": "John Doe",
    "role": "BUYER",  // "BUYER" or "SELLER"
    "phone": "+2348012345678", // optional
    "universityId": "cuid_here", // optional
    "level": "300", // optional
    "businessName": "John's Books", // optional (for sellers)
    "bio": "Selling textbooks" // optional (for sellers)
  }
  ```
* **Output (HTTP 201)**:
  ```json
  {
    "id": "user_cuid",
    "email": "student@unilag.edu.ng",
    "role": "BUYER",
    "profileId": "profile_cuid" // only if role is SELLER
  }
  ```
* **Errors**:
  * `400 Bad Request`: Email/name/password missing or password under 8 chars.
  * `404 Not Found`: Provided `universityId` not in database.
  * `409 Conflict`: "A user with this email already exists."

### 2. `POST /api/auth/mobile-login`
Authenticates a user from the mobile app and returns a signed stateless JWT token.
* **Input**:
  ```json
  {
    "email": "student@unilag.edu.ng",
    "password": "securepassword123"
  }
  ```
* **Output (HTTP 200)**:
  ```json
  {
    "token": "ey...", // Bearer token
    "user": {
      "id": "user_cuid",
      "email": "student@unilag.edu.ng",
      "name": "John Doe",
      "role": "BUYER"
    }
  }
  ```
* **Errors**:
  * `401 Unauthorized`: "Invalid email or password" (protects against email enumeration).

---

## User Profile Endpoints

### 3. `GET /api/users/me`
Retrieves the currently authenticated user's profile.
* **Headers**: `Authorization: Bearer <token>` (mobile) or Cookie Session (web)
* **Output (HTTP 200)**:
  ```json
  {
    "id": "user_cuid",
    "email": "student@unilag.edu.ng",
    "name": "John Doe",
    "role": "BUYER",
    "universityId": "uni_cuid",
    "level": "300"
  }
  ```
* **Errors**:
  * `401 Unauthorized`: Missing or invalid credentials.
  * `404 Not Found`: "User not found."

### 4. `PATCH /api/users/me`
Updates user profile settings.
* **Headers**: `Authorization: Bearer <token>` or Cookie Session
* **Input**:
  ```json
  {
    "universityId": "new_uni_cuid", // optional
    "level": "400" // optional
  }
  ```
* **Output (HTTP 200)**: Updated user object.
* **Errors**:
  * `400 Bad Request`: Validation errors or "No valid fields to update."
  * `401 Unauthorized`: Missing/invalid token.
  * `404 Not Found`: "University not found."

---

## Marketplace Listings Endpoints

### 5. `GET /api/listings`
Fetches a paginated feed of active listings with search and category filters.
* **Params**:
  * `category` (string, optional category slug)
  * `search` (string, optional search query)
  * `cursor` (string, optional listing ID for pagination)
  * `limit` (number, optional, max 100, default 20)
* **Output (HTTP 200)**:
  ```json
  {
    "items": [
      {
        "id": "listing_cuid",
        "sellerId": "seller_cuid",
        "categoryId": "cat_cuid",
        "title": "Calculus Textbook",
        "description": "Like new condition.",
        "price": "5000.00",
        "images": ["url1", "url2"],
        "stock": 1,
        "status": "ACTIVE",
        "createdAt": "2026-07-31T12:00:00Z",
        "seller": {
          "username": "johndoe",
          "businessName": "John's Bookstore"
        },
        "category": {
          "name": "Textbooks",
          "slug": "textbooks"
        }
      }
    ],
    "nextCursor": "next_listing_cuid_or_null",
    "hasMore": true
  }
  ```

### 6. `POST /api/listings`
Creates a new listing.
* **Headers**: `Authorization: Bearer <token>` or Cookie Session
* **Input**:
  ```json
  {
    "sellerId": "seller_cuid",
    "categoryId": "cat_cuid", // or "categorySlug": "textbooks"
    "title": "Calculus Textbook",
    "description": "Like new condition.",
    "price": 5000.00,
    "images": ["url1"], // optional
    "stock": 1 // optional (defaults to 1)
  }
  ```
* **Output (HTTP 201)**:
  ```json
  {
    "id": "new_listing_cuid"
  }
  ```
* **Errors**:
  * `400 Bad Request`: Validation errors (missing fields, negative price).
  * `404 Not Found`: "Seller profile not found" or "Category not found."

### 7. `GET /api/listings/[id]`
Retrieves full details of a specific listing.
* **Output (HTTP 200)**: Complete Listing model including seller user name, seller business name, category name, and university details.
* **Errors**:
  * `404 Not Found`: "Listing not found."

### 8. `DELETE /api/listings/[id]`
Deletes a listing from the marketplace.
* **Headers**: `Authorization: Bearer <token>` or Cookie Session
* **Output (HTTP 200)**:
  ```json
  {
    "ok": true
  }
  ```
* **Errors**:
  * `401 Unauthorized`: Missing or invalid credentials.
  * `403 Forbidden`: "You can only delete your own listings."
  * `404 Not Found`: "Listing not found."

---

## Seller Endpoints

### 9. `GET /api/sellers/me`
Retrieves profile settings, wallet balance, and listing history for the authenticated seller.
* **Headers**: `Authorization: Bearer <token>` (Seller role) or Cookie Session
* **Output (HTTP 200)**:
  ```json
  {
    "sellerProfileId": "profile_cuid",
    "username": "johndoe",
    "name": "John Doe",
    "walletBalance": "25000.00",
    "verified": true,
    "verifiedAt": "2026-07-31T10:00:00Z",
    "idImageUrl": "http...",
    "listings": [...]
  }
  ```
* **Errors**:
  * `401 Unauthorized`: Not authenticated or not in the `SELLER` role.
  * `404 Not Found`: "Seller profile not found."

### 10. `POST /api/sellers`
Creates a brand new seller profile (alternative endpoint).
* **Input**: Name, email, universityId, level, phone, businessName, bio.
* **Output (HTTP 201)**: `{ "id": "user_id", "profileId": "profile_id" }`
* **Errors**:
  * `400 Bad Request`: Validation failures.
  * `409 Conflict`: "A user with this email already exists."

### 11. `POST /api/sellers/verify`
Uploads a student ID card and submits the seller profile for admin verification.
* **Headers**: `Authorization: Bearer <token>` or Cookie Session
* **Input**: `Multipart/form-data` containing `image` file
* **Output (HTTP 200)**:
  ```json
  {
    "ok": true,
    "idImageUrl": "https://vercel-blob-url/seller-ids/..."
  }
  ```
* **Errors**:
  * `400 Bad Request`: Missing image, file size > 5MB, or invalid mime type.
  * `401 Unauthorized`: User is not signed in or not a `SELLER`.
  * `404 Not Found`: "Seller profile not found."

---

## Miscellaneous Endpoints

### 12. `GET /api/categories`
Retrieves all listing categories sorted alphabetically.
* **Output (HTTP 200)**: Array of Category objects. Cached for 1 hour (`revalidate = 3600`).

### 13. `GET /api/universities`
Retrieves all registered universities.
* **Output (HTTP 200)**: Array of University objects.

### 14. `POST /api/upload/listing-image`
Uploads a listing image file to Vercel Blob storage.
* **Headers**: `Authorization: Bearer <token>` or Cookie Session
* **Input**: `Multipart/form-data` containing `image` file (under 5MB)
* **Output (HTTP 200)**:
  ```json
  {
    "url": "https://vercel-blob-url/listing-images/..."
  }
  ```
* **Errors**:
  * `400 Bad Request`: Empty image, invalid type, or oversized file.
  * `401 Unauthorized`: Not authenticated as a `SELLER`.

### 15. `POST /api/questions`
Submits a query to the campus administration mailbox.
* **Input**: `{ "name": "...", "email": "...", "question": "..." }`
* **Output (HTTP 201)**: `{ "id": "question_id" }`

### 16. `GET /api/waitlist` & `POST /api/waitlist`
* **GET**: Returns waitlist signup count `{ "count": 250 }`.
* **POST**: Submits waitlist signup data (Buyer / Seller role, interest tags, frequency, survey questions).
