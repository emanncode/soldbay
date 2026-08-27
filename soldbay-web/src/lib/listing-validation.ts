export interface ListingValidationInput {
  title?: string | null;
  description?: string | null;
  price?: number | string | null;
  categoryId?: string | null;
  categorySlug?: string | null;
  images?: string[] | null;
  stock?: number | null;
}

export function validateListingCompleteness(input: ListingValidationInput): {
  valid: boolean;
  error?: string;
} {
  if (!input.title || typeof input.title !== "string" || !input.title.trim()) {
    return { valid: false, error: "Title is required." };
  }
  if (
    !input.description ||
    typeof input.description !== "string" ||
    !input.description.trim()
  ) {
    return { valid: false, error: "Description is required." };
  }
  if (
    input.price == null ||
    isNaN(Number(input.price)) ||
    Number(input.price) <= 0
  ) {
    return { valid: false, error: "Price must be a positive number." };
  }
  if (!input.categoryId && !input.categorySlug) {
    return { valid: false, error: "Category ID or slug is required." };
  }
  if (
    input.stock != null &&
    (typeof input.stock !== "number" || input.stock < 1)
  ) {
    return { valid: false, error: "Stock must be at least 1." };
  }
  return { valid: true };
}
