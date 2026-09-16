import type { Category, PublicListing, ListingDetail, ListingPage } from "./api";

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Textbooks", slug: "textbooks", commissionRate: "0.05" },
  { id: "cat-2", name: "Tech", slug: "tech", commissionRate: "0.05" },
  { id: "cat-3", name: "Fashion", slug: "fashion", commissionRate: "0.05" },
  { id: "cat-4", name: "Dorm", slug: "dorm", commissionRate: "0.05" },
];

export const MOCK_LISTINGS: PublicListing[] = [
  {
    id: "list-1",
    sellerId: "seller-1",
    categoryId: "cat-3",
    title: "Vintage Leather Crossbody Bag",
    description: "Premium brown leather crossbody bag. Excellent condition, genuine brass buckles, perfect for campus lectures and everyday essentials.",
    price: "15000",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    ],
    stock: 1,
    status: "AVAILABLE",
    createdAt: "2026-09-14T10:00:00Z",
    seller: {
      username: "kemi_adesanya",
      businessName: "Kemi Thrift Store",
    },
    category: {
      name: "Fashion",
      slug: "fashion",
    },
  },
  {
    id: "list-2",
    sellerId: "seller-2",
    categoryId: "cat-2",
    title: "Wireless Bluetooth Earbuds",
    description: "Noise-cancelling wireless earbuds with deep bass and 24-hour battery case. Used for only 3 weeks during revision.",
    price: "5500",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    ],
    stock: 3,
    status: "AVAILABLE",
    createdAt: "2026-09-14T11:30:00Z",
    seller: {
      username: "gadget_point",
      businessName: "Campus Gadgets Hub",
    },
    category: {
      name: "Tech",
      slug: "tech",
    },
  },
  {
    id: "list-3",
    sellerId: "seller-3",
    categoryId: "cat-1",
    title: "Engineering Mathematics Vol 1 & 2",
    description: "Standard K.A. Stroud Engineering Mathematics textbook. Clean pages, no torn leaves, essential for 100/200 level engineering students.",
    price: "4500",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    ],
    stock: 2,
    status: "AVAILABLE",
    createdAt: "2026-09-14T12:15:00Z",
    seller: {
      username: "aaua_books",
      businessName: "AAUA Book Nook",
    },
    category: {
      name: "Textbooks",
      slug: "textbooks",
    },
  },
  {
    id: "list-4",
    sellerId: "seller-4",
    categoryId: "cat-4",
    title: "Rechargeable Desk Study Lamp",
    description: "3-level touch brightness desk lamp with built-in rechargeable battery. Lasts through hostel power outages.",
    price: "3500",
    images: [], // Demonstrates no-photo placeholder state
    stock: 1,
    status: "AVAILABLE",
    createdAt: "2026-09-14T13:00:00Z",
    seller: {
      username: "ade_dorm_needs",
      businessName: "Ade & Sons Dorm Store",
    },
    category: {
      name: "Dorm",
      slug: "dorm",
    },
  },
  {
    id: "list-5",
    sellerId: "seller-2",
    categoryId: "cat-2",
    title: "Casio Scientific Calculator fx-991EX",
    description: "Original Casio fx-991EX ClassWiz calculator. Natural textbook display, approved for university matric exams.",
    price: "12000",
    images: [
      "https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    ],
    stock: 2,
    status: "AVAILABLE",
    createdAt: "2026-09-14T14:20:00Z",
    seller: {
      username: "gadget_point",
      businessName: "Campus Gadgets Hub",
    },
    category: {
      name: "Tech",
      slug: "tech",
    },
  },
  {
    id: "list-6",
    sellerId: "seller-4",
    categoryId: "cat-4",
    title: "Electric Kettle 1.8L Stainless Steel",
    description: "Fast-boiling stainless steel kettle with automatic shut-off. Perfect for quick noodles and morning coffee in the hostel.",
    price: "6000",
    images: [
      "https://images.unsplash.com/photo-1594213114663-dd9623e1f2a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    ],
    stock: 1,
    status: "AVAILABLE",
    createdAt: "2026-09-14T15:00:00Z",
    seller: {
      username: "ade_dorm_needs",
      businessName: "Ade & Sons Dorm Store",
    },
    category: {
      name: "Dorm",
      slug: "dorm",
    },
  },
  {
    id: "list-7",
    sellerId: "seller-1",
    categoryId: "cat-3",
    title: "Vintage Denim Jacket Oversized",
    description: "Classic blue denim jacket, oversized unisex fit, sturdy cotton denim with silver buttons.",
    price: "8500",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    ],
    stock: 0,
    status: "SOLD", // Demonstrates sold card desaturation state
    createdAt: "2026-09-14T16:00:00Z",
    seller: {
      username: "kemi_adesanya",
      businessName: "Kemi Thrift Store",
    },
    category: {
      name: "Fashion",
      slug: "fashion",
    },
  },
  {
    id: "list-8",
    sellerId: "seller-3",
    categoryId: "cat-1",
    title: "General Chemistry Principles & Structure",
    description: "CHM 101/102 course textbook. Includes end-of-chapter worked problems and summary notes.",
    price: "3000",
    images: [
      "https://images.unsplash.com/photo-1532012164546-f432f2e3edd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    ],
    stock: 1,
    status: "AVAILABLE",
    createdAt: "2026-09-14T16:45:00Z",
    seller: {
      username: "aaua_books",
      businessName: "AAUA Book Nook",
    },
    category: {
      name: "Textbooks",
      slug: "textbooks",
    },
  },
  {
    id: "list-9",
    sellerId: "seller-2",
    categoryId: "cat-2",
    title: "Laptop Cooling Pad & Dual Fan Stand",
    description: "USB powered cooling stand with quiet dual blue LED fans. Fits laptops up to 15.6 inches.",
    price: "7200",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    ],
    stock: 2,
    status: "AVAILABLE",
    createdAt: "2026-09-14T17:10:00Z",
    seller: {
      username: "gadget_point",
      businessName: "Campus Gadgets Hub",
    },
    category: {
      name: "Tech",
      slug: "tech",
    },
  },
  {
    id: "list-10",
    sellerId: "seller-4",
    categoryId: "cat-4",
    title: "Hostel Mattress Foam & Pillow Set",
    description: "Single student mattress foam in clean fabric cover with companion orthopedic pillow. Barely used 1 semester.",
    price: "18000",
    images: [
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    ],
    stock: 1,
    status: "AVAILABLE",
    createdAt: "2026-09-14T17:40:00Z",
    seller: {
      username: "ade_dorm_needs",
      businessName: "Ade & Sons Dorm Store",
    },
    category: {
      name: "Dorm",
      slug: "dorm",
    },
  },
  {
    id: "list-11",
    sellerId: "seller-1",
    categoryId: "cat-3",
    title: "White Canvas Sneakers Unisex (Size 42)",
    description: "Crisp white low-top canvas sneakers, rubber sole, comfortable for walking across campus faculty buildings.",
    price: "7000",
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    ],
    stock: 1,
    status: "AVAILABLE",
    createdAt: "2026-09-14T18:00:00Z",
    seller: {
      username: "kemi_adesanya",
      businessName: "Kemi Thrift Store",
    },
    category: {
      name: "Fashion",
      slug: "fashion",
    },
  },
  {
    id: "list-12",
    sellerId: "seller-3",
    categoryId: "cat-1",
    title: "Campbell Biology 11th Global Edition",
    description: "Comprehensive biology textbook for BIO 101/201 students. Full-color diagrams and glossary.",
    price: "6500",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    ],
    stock: 1,
    status: "AVAILABLE",
    createdAt: "2026-09-14T18:30:00Z",
    seller: {
      username: "aaua_books",
      businessName: "AAUA Book Nook",
    },
    category: {
      name: "Textbooks",
      slug: "textbooks",
    },
  },
];

/**
 * Simulates network delay (e.g. 200ms) for realistic UX and loading states
 */
function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Disconnected Mock API: getListings
 */
export async function getMockListings(params: {
  categorySlug?: string;
  search?: string;
  cursor?: string;
  limit?: number;
} = {}): Promise<ListingPage> {
  await delay(200);

  let filtered = [...MOCK_LISTINGS];

  // Category filter
  if (params.categorySlug && params.categorySlug !== "all") {
    filtered = filtered.filter(
      (item) => item.category?.slug.toLowerCase() === params.categorySlug?.toLowerCase()
    );
  }

  // Search filter
  if (params.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.seller?.businessName?.toLowerCase().includes(q) ||
        item.category?.name.toLowerCase().includes(q)
    );
  }

  const limit = params.limit || 16;
  const startIndex = params.cursor ? parseInt(params.cursor, 10) : 0;
  const sliced = filtered.slice(startIndex, startIndex + limit);
  const nextIndex = startIndex + limit;
  const hasMore = nextIndex < filtered.length;

  return {
    items: sliced,
    nextCursor: hasMore ? String(nextIndex) : null,
    hasMore,
  };
}

/**
 * Disconnected Mock API: getCategories
 */
export async function getMockCategories(): Promise<Category[]> {
  await delay(100);
  return MOCK_CATEGORIES;
}

/**
 * Disconnected Mock API: getListingById
 */
export async function getMockListingById(id: string): Promise<ListingDetail> {
  await delay(150);
  const found = MOCK_LISTINGS.find((item) => item.id === id) || MOCK_LISTINGS[0];

  return {
    ...found,
    seller: {
      ...found.seller,
      user: {
        name: found.seller.businessName || found.seller.username,
        university: {
          name: "Adekunle Ajasin University, Akungba-Akoko",
          code: "AAUA",
        },
      },
    },
  };
}
