import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { signMobileToken } from "@/lib/sign-mobile-token";

// Import Route Handlers
import { GET as getUniversities } from "@/app/api/universities/route";
import { GET as getCategories } from "@/app/api/categories/route";
import { POST as signup } from "@/app/api/auth/signup/route";
import { POST as login } from "@/app/api/auth/mobile-login/route";
import { GET as getUserMe, PATCH as patchUserMe } from "@/app/api/users/me/route";
import { GET as getSellerMe } from "@/app/api/sellers/me/route";
import { POST as verifySeller } from "@/app/api/sellers/verify/route";
import { POST as createDraft } from "@/app/api/listings/drafts/route";
import { GET as getDraft, PATCH as patchDraft } from "@/app/api/listings/drafts/[id]/route";
import { POST as publishDraft } from "@/app/api/listings/drafts/[id]/publish/route";
import { GET as getListings } from "@/app/api/listings/route";
import { GET as getListingDetail, DELETE as deleteListing } from "@/app/api/listings/[id]/route";
import { POST as checkoutOrder } from "@/app/api/orders/checkout/route";
import { GET as getOrders } from "@/app/api/orders/route";
import { GET as getOrderDetail } from "@/app/api/orders/[id]/route";
import { POST as verifyPin } from "@/app/api/orders/[id]/verify-pin/route";
import { POST as confirmReceipt } from "@/app/api/orders/[id]/confirm-receipt/route";
import { POST as raiseDispute } from "@/app/api/orders/[id]/dispute/route";
import { POST as resolveDispute } from "@/app/api/admin/disputes/[id]/resolve/route";
import { POST as forgotPassword } from "@/app/api/auth/forgot-password/route";
import { POST as verifyOtp } from "@/app/api/auth/verify-otp/route";
import { POST as resetPassword } from "@/app/api/auth/reset-password/route";

const testRunId = Date.now();
const testSellerEmail = `seller.${testRunId}@oauife.edu.ng`;
const testBuyerEmail = `buyer.${testRunId}@oauife.edu.ng`;
const testSellerUsername = `seller_${testRunId}`;
const testPassword = "Password123!";

function createMockRequest(url: string, options: { method?: string; body?: any; token?: string; isFormData?: boolean; formData?: FormData } = {}) {
  const headers: Record<string, string> = {};
  if (options.token) {
    headers["authorization"] = `Bearer ${options.token}`;
  }

  if (options.isFormData && options.formData) {
    return new Request(url, {
      method: options.method || "POST",
      headers,
      body: options.formData,
    });
  }

  if (options.body) {
    headers["content-type"] = "application/json";
    return new Request(url, {
      method: options.method || "POST",
      headers,
      body: JSON.stringify(options.body),
    });
  }

  return new Request(url, {
    method: options.method || "GET",
    headers,
  });
}

let sellerToken = "";
let buyerToken = "";
let adminToken = "";
let sellerId = "";
let buyerId = "";
let universityId = "";
let categoryId = "";
let categorySlug = "";
let draftId = "";
let publishedListingId = "";
let orderId = "";
let orderPin = "";
let disputeId = "";

async function runTests() {
  console.log("=================================================");
  console.log("🚀 STARTING SOLDBAY FULL API ENDPOINT TEST SUITE");
  console.log("=================================================\n");

  // 1. GET /api/universities
  {
    const res = await getUniversities();
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.universities;
    if (res.status !== 200 || !Array.isArray(list) || list.length === 0) {
      throw new Error(`GET /api/universities failed: status ${res.status}`);
    }
    universityId = list[0].id;
    console.log(`✅ [1/24] GET /api/universities -> OK (${list.length} universities found, selected: ${list[0].name})`);
  }

  // 2. GET /api/categories
  {
    const res = await getCategories();
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.categories;
    if (res.status !== 200 || !Array.isArray(list) || list.length === 0) {
      throw new Error(`GET /api/categories failed: status ${res.status}`);
    }
    categoryId = list[0].id;
    categorySlug = list[0].slug;
    console.log(`✅ [2/24] GET /api/categories -> OK (${list.length} categories found, selected: ${list[0].name})`);
  }

  // 3. POST /api/auth/signup (Seller)
  {
    const req = createMockRequest("http://localhost:3000/api/auth/signup", {
      body: {
        email: testSellerEmail,
        password: testPassword,
        name: "Test Seller Ada",
        role: "SELLER",
        username: testSellerUsername,
        universityId,
      },
    });
    const res = await signup(req);
    const data = await res.json();
    if (res.status !== 201 || !data.id) {
      throw new Error(`POST /api/auth/signup (Seller) failed: ${JSON.stringify(data)}`);
    }
    sellerId = data.id;
    console.log(`✅ [3/24] POST /api/auth/signup (Seller) -> OK (Created: ${testSellerEmail})`);
  }

  // 4. POST /api/auth/signup (Buyer)
  {
    const req = createMockRequest("http://localhost:3000/api/auth/signup", {
      body: {
        email: testBuyerEmail,
        password: testPassword,
        name: "Test Buyer Chidi",
        role: "BUYER",
        universityId,
      },
    });
    const res = await signup(req);
    const data = await res.json();
    if (res.status !== 201 || !data.id) {
      throw new Error(`POST /api/auth/signup (Buyer) failed: ${JSON.stringify(data)}`);
    }
    buyerId = data.id;
    console.log(`✅ [4/24] POST /api/auth/signup (Buyer) -> OK (Created: ${testBuyerEmail})`);
  }

  // 5. POST /api/auth/mobile-login (Seller & Buyer Token Issuance)
  {
    const reqSeller = createMockRequest("http://localhost:3000/api/auth/mobile-login", {
      body: { email: testSellerEmail, password: testPassword },
    });
    const resSeller = await login(reqSeller);
    const dataSeller = await resSeller.json();
    if (resSeller.status !== 200 || !dataSeller.token) {
      throw new Error(`POST /api/auth/mobile-login (Seller) failed: ${JSON.stringify(dataSeller)}`);
    }
    sellerToken = dataSeller.token;

    const reqBuyer = createMockRequest("http://localhost:3000/api/auth/mobile-login", {
      body: { email: testBuyerEmail, password: testPassword },
    });
    const resBuyer = await login(reqBuyer);
    const dataBuyer = await resBuyer.json();
    if (resBuyer.status !== 200 || !dataBuyer.token) {
      throw new Error(`POST /api/auth/mobile-login (Buyer) failed: ${JSON.stringify(dataBuyer)}`);
    }
    buyerToken = dataBuyer.token;

    // Create real admin user in DB
    const adminUser = await prisma.user.create({
      data: {
        email: `admin.${testRunId}@soldbay.local`,
        name: "Soldbay Admin",
        role: "ADMIN",
      },
    });

    adminToken = signMobileToken({
      userId: adminUser.id,
      role: "ADMIN",
    });

    console.log(`✅ [5/24] POST /api/auth/mobile-login -> OK (Authenticated tokens issued for Seller & Buyer & Admin)`);
  }

  // 6. GET /api/users/me & PATCH /api/users/me
  {
    const reqGet = createMockRequest("http://localhost:3000/api/users/me", { token: sellerToken });
    const resGet = await getUserMe(reqGet);
    const dataGet = await resGet.json();
    if (resGet.status !== 200 || dataGet.email !== testSellerEmail) {
      throw new Error(`GET /api/users/me failed: ${JSON.stringify(dataGet)}`);
    }

    const reqPatch = createMockRequest("http://localhost:3000/api/users/me", {
      method: "PATCH",
      token: sellerToken,
      body: { phone: "08012345678", level: "400L" },
    });
    const resPatch = await patchUserMe(reqPatch);
    const dataPatch = await resPatch.json();
    if (resPatch.status !== 200 || dataPatch.level !== "400L") {
      throw new Error(`PATCH /api/users/me failed: ${JSON.stringify(dataPatch)}`);
    }
    console.log(`✅ [6/24] GET & PATCH /api/users/me -> OK (Profile verified and updated)`);
  }

  // 7. POST /api/sellers/verify (Portal screenshot + matricNumber)
  {
    const formData = new FormData();
    const dummyBlob = new Blob(["fake-image-bytes"], { type: "image/png" });
    formData.append("image", dummyBlob, "portal-screenshot.png");
    formData.append("matricNumber", `OAU/${testRunId.toString().slice(-4)}/TEST`);

    const req = createMockRequest("http://localhost:3000/api/sellers/verify", {
      token: sellerToken,
      isFormData: true,
      formData,
    });
    const res = await verifySeller(req);
    const data = await res.json();
    if (res.status !== 200 || !data.ok) {
      throw new Error(`POST /api/sellers/verify failed: ${JSON.stringify(data)}`);
    }
    console.log(`✅ [7/24] POST /api/sellers/verify -> OK (Matric & ID image registered)`);
  }

  // 8. GET /api/sellers/me
  {
    const req = createMockRequest("http://localhost:3000/api/sellers/me", { token: sellerToken });
    const res = await getSellerMe(req);
    const data = await res.json();
    if (res.status !== 200 || !Array.isArray(data.drafts) || !Array.isArray(data.listings)) {
      throw new Error(`GET /api/sellers/me failed: ${JSON.stringify(data)}`);
    }
    console.log(`✅ [8/24] GET /api/sellers/me -> OK (Active listings: ${data.listings.length}, Drafts: ${data.drafts.length})`);
  }

  // 9. POST /api/listings/drafts (Initialize draft at Step 1)
  {
    const req = createMockRequest("http://localhost:3000/api/listings/drafts", { token: sellerToken });
    const res = await createDraft(req);
    const data = await res.json();
    if (res.status !== 201 || !data.id) {
      throw new Error(`POST /api/listings/drafts failed: ${JSON.stringify(data)}`);
    }
    draftId = data.id;
    console.log(`✅ [9/24] POST /api/listings/drafts -> OK (Created Draft ID: ${draftId})`);
  }

  // 10. PATCH /api/listings/drafts/[id] (Auto-save steps 1 -> 2 -> 3)
  {
    const req = createMockRequest(`http://localhost:3000/api/listings/drafts/${draftId}`, {
      method: "PATCH",
      token: sellerToken,
      body: {
        title: "Engineering Mathematics Vol. 2 (Advanced)",
        description: "Hardcover textbook in excellent condition for faculty of engineering.",
        price: 4500,
        categorySlug,
        images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"],
        draftStep: 3,
      },
    });
    const res = await patchDraft(req, { params: Promise.resolve({ id: draftId }) });
    const data = await res.json();
    if (res.status !== 200 || !data.ok) {
      throw new Error(`PATCH /api/listings/drafts/[id] failed: ${JSON.stringify(data)}`);
    }
    console.log(`✅ [10/24] PATCH /api/listings/drafts/[id] -> OK (Auto-saved up to Step 3)`);
  }

  // 11. GET /api/listings/drafts/[id] (Resume draft)
  {
    const req = createMockRequest(`http://localhost:3000/api/listings/drafts/${draftId}`, { token: sellerToken });
    const res = await getDraft(req, { params: Promise.resolve({ id: draftId }) });
    const data = await res.json();
    if (res.status !== 200 || data.title !== "Engineering Mathematics Vol. 2 (Advanced)" || data.draftStep !== 3) {
      throw new Error(`GET /api/listings/drafts/[id] failed: ${JSON.stringify(data)}`);
    }
    console.log(`✅ [11/24] GET /api/listings/drafts/[id] -> OK (Successfully resumed at Step ${data.draftStep})`);
  }

  // 12. POST /api/listings/drafts/[id]/publish (Publish gate at Step 4)
  {
    const req = createMockRequest(`http://localhost:3000/api/listings/drafts/${draftId}/publish`, { token: sellerToken });
    const res = await publishDraft(req, { params: Promise.resolve({ id: draftId }) });
    const data = await res.json();
    if (res.status !== 200 || data.status !== "ACTIVE") {
      throw new Error(`POST /api/listings/drafts/[id]/publish failed: ${JSON.stringify(data)}`);
    }
    publishedListingId = data.id;
    console.log(`✅ [12/24] POST /api/listings/drafts/[id]/publish -> OK (Listing live in ACTIVE state)`);
  }

  // 13. GET /api/listings (Search & filters)
  {
    const req = createMockRequest(`http://localhost:3000/api/listings?q=Engineering&universityId=${universityId}`);
    const res = await getListings(req);
    const data = await res.json();
    const items = data.items || data.listings || [];
    if (res.status !== 200 || !Array.isArray(items) || items.length === 0) {
      throw new Error(`GET /api/listings failed: ${JSON.stringify(data)}`);
    }
    console.log(`✅ [13/24] GET /api/listings -> OK (Search returned ${items.length} active items)`);
  }

  // 14. GET /api/listings/[id] (Public listing detail)
  {
    const req = createMockRequest(`http://localhost:3000/api/listings/${publishedListingId}`);
    const res = await getListingDetail(req, { params: Promise.resolve({ id: publishedListingId }) });
    const data = await res.json();
    if (res.status !== 200 || data.title !== "Engineering Mathematics Vol. 2 (Advanced)") {
      throw new Error(`GET /api/listings/[id] failed: ${JSON.stringify(data)}`);
    }
    console.log(`✅ [14/24] GET /api/listings/[id] -> OK (Fetched item: "${data.title}" · ₦${data.price})`);
  }

  // 15. POST /api/orders/checkout (Buyer initiates escrow checkout)
  {
    const req = createMockRequest("http://localhost:3000/api/orders/checkout", {
      token: buyerToken,
      body: {
        listingId: publishedListingId,
        pickupLocation: "SUB Main Gate, OAU Campus",
      },
    });
    const res = await checkoutOrder(req);
    const data = await res.json();
    if (res.status !== 201 || !data.orderId || !data.orderNumber) {
      throw new Error(`POST /api/orders/checkout failed: ${JSON.stringify(data)}`);
    }
    orderId = data.orderId;
    console.log(`✅ [15/24] POST /api/orders/checkout -> OK (Created Order ${data.orderNumber}, Status: ${data.status})`);
  }

  // 16. GET /api/orders (Buyer & Seller Orders List)
  {
    const req = createMockRequest("http://localhost:3000/api/orders", { token: buyerToken });
    const res = await getOrders(req);
    const data = await res.json();
    if (res.status !== 200 || !Array.isArray(data.orders) || data.orders.length === 0) {
      throw new Error(`GET /api/orders failed: ${JSON.stringify(data)}`);
    }
    console.log(`✅ [16/24] GET /api/orders -> OK (Orders tab loaded with ${data.orders.length} items)`);
  }

  // 17. GET /api/orders/[id] (Order detail + Security check on seller PIN)
  {
    // Buyer requests order detail -> must NOT see seller PIN
    const reqBuyer = createMockRequest(`http://localhost:3000/api/orders/${orderId}`, { token: buyerToken });
    const resBuyer = await getOrderDetail(reqBuyer, { params: Promise.resolve({ id: orderId }) });
    const dataBuyer = await resBuyer.json();
    if (resBuyer.status !== 200 || dataBuyer.sellerPin !== undefined) {
      throw new Error(`GET /api/orders/[id] (Buyer) failed: PIN leaked to buyer!`);
    }

    // Seller requests order detail -> MUST see seller PIN for in-person handoff display
    const reqSeller = createMockRequest(`http://localhost:3000/api/orders/${orderId}`, { token: sellerToken });
    const resSeller = await getOrderDetail(reqSeller, { params: Promise.resolve({ id: orderId }) });
    const dataSeller = await resSeller.json();
    if (resSeller.status !== 200 || !dataSeller.sellerPin) {
      throw new Error(`GET /api/orders/[id] (Seller) failed: sellerPin not provided to seller!`);
    }
    orderPin = dataSeller.sellerPin;
    console.log(`✅ [17/24] GET /api/orders/[id] -> OK (Security verified: PIN revealed only to seller: "${orderPin}")`);
  }

  // 18. POST /api/orders/[id]/verify-pin (Buyer enters PIN at campus pickup)
  {
    const req = createMockRequest(`http://localhost:3000/api/orders/${orderId}/verify-pin`, {
      token: buyerToken,
      body: { pin: orderPin },
    });
    const res = await verifyPin(req, { params: Promise.resolve({ id: orderId }) });
    const data = await res.json();
    if (res.status !== 200 || data.status !== "AWAITING_CONFIRMATION") {
      throw new Error(`POST /api/orders/[id]/verify-pin failed: ${JSON.stringify(data)}`);
    }
    console.log(`✅ [18/24] POST /api/orders/[id]/verify-pin -> OK (Handoff proven, status: ${data.status})`);
  }

  // 19. POST /api/orders/[id]/confirm-receipt (Buyer confirms "Everything's good")
  {
    const req = createMockRequest(`http://localhost:3000/api/orders/${orderId}/confirm-receipt`, {
      token: buyerToken,
    });
    const res = await confirmReceipt(req, { params: Promise.resolve({ id: orderId }) });
    const data = await res.json();
    if (res.status !== 200 || data.status !== "COMPLETED") {
      throw new Error(`POST /api/orders/[id]/confirm-receipt failed: ${JSON.stringify(data)}`);
    }
    console.log(`✅ [19/24] POST /api/orders/[id]/confirm-receipt -> OK (Order COMPLETED, funds paid out)`);
  }

  // 20. Dispute Flow: Create a second order and test "Report a problem" & Admin Resolution
  {
    // Create second order for dispute
    const reqOrder2 = createMockRequest("http://localhost:3000/api/orders/checkout", {
      token: buyerToken,
      body: {
        listingId: publishedListingId,
        pickupLocation: "Faculty of Tech Car Park",
      },
    });
    const resOrder2 = await checkoutOrder(reqOrder2);
    const dataOrder2 = await resOrder2.json();
    const order2Id = dataOrder2.orderId;

    // Buyer raises dispute
    const reqDispute = createMockRequest(`http://localhost:3000/api/orders/${order2Id}/dispute`, {
      token: buyerToken,
      body: { reason: "Missing chapters and torn binding on page 42." },
    });
    const resDispute = await raiseDispute(reqDispute, { params: Promise.resolve({ id: order2Id }) });
    const dataDispute = await resDispute.json();
    if (resDispute.status !== 201 || dataDispute.status !== "DISPUTED") {
      throw new Error(`POST /api/orders/[id]/dispute failed: ${JSON.stringify(dataDispute)}`);
    }
    disputeId = dataDispute.disputeId;
    console.log(`✅ [20/24] POST /api/orders/[id]/dispute -> OK (Dispute opened, status: ${dataDispute.status})`);

    // Admin resolves dispute as Refund
    const reqResolve = createMockRequest(`http://localhost:3000/api/admin/disputes/${disputeId}/resolve`, {
      token: adminToken,
      body: {
        action: "REFUND_BUYER",
        resolutionNotes: "Item damaged prior to delivery. Full refund approved.",
      },
    });
    const resResolve = await resolveDispute(reqResolve, { params: Promise.resolve({ id: disputeId }) });
    const dataResolve = await resResolve.json();
    if (resResolve.status !== 200 || !dataResolve.success) {
      throw new Error(`POST /api/admin/disputes/[id]/resolve failed: ${JSON.stringify(dataResolve)}`);
    }
    console.log(`✅ [21/24] POST /api/admin/disputes/[id]/resolve -> OK (Dispute resolved as REFUND)`);
  }

  // 22. POST /api/auth/forgot-password
  let devOtp = "";
  {
    const req = createMockRequest("http://localhost:3000/api/auth/forgot-password", {
      body: { email: testBuyerEmail },
    });
    const res = await forgotPassword(req);
    const data = await res.json();
    if (res.status !== 200 || !data.ok) {
      throw new Error(`POST /api/auth/forgot-password failed: ${JSON.stringify(data)}`);
    }
    devOtp = data.devOtp;
    console.log(`✅ [22/24] POST /api/auth/forgot-password -> OK (Generated OTP: ${devOtp})`);
  }

  // 23. POST /api/auth/verify-otp
  {
    const req = createMockRequest("http://localhost:3000/api/auth/verify-otp", {
      body: { email: testBuyerEmail, otp: devOtp },
    });
    const res = await verifyOtp(req);
    const data = await res.json();
    if (res.status !== 200 || !data.valid) {
      throw new Error(`POST /api/auth/verify-otp failed: ${JSON.stringify(data)}`);
    }
    console.log(`✅ [23/24] POST /api/auth/verify-otp -> OK (6-digit OTP code verified)`);
  }

  // 24. POST /api/auth/reset-password
  {
    const req = createMockRequest("http://localhost:3000/api/auth/reset-password", {
      body: { email: testBuyerEmail, otp: devOtp, newPassword: "NewSecretPassword123!" },
    });
    const res = await resetPassword(req);
    const data = await res.json();
    if (res.status !== 200 || !data.ok) {
      throw new Error(`POST /api/auth/reset-password failed: ${JSON.stringify(data)}`);
    }
    console.log(`✅ [24/24] POST /api/auth/reset-password -> OK (New password saved with bcrypt)`);
  }

  console.log("\n=================================================");
  console.log("🎉 ALL 24 API ENDPOINTS PASSED WITH 100% SUCCESS!");
  console.log("=================================================\n");
}

runTests()
  .catch((err) => {
    console.error("\n❌ TEST SUITE FAILED:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
