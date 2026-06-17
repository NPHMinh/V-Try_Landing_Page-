/**
 * analytics.ts - Dịch vụ Analytics tập trung cho V-Try Frontend
 *
 * Bao gồm:
 * - Microsoft Clarity (ghi màn hình & heatmap) - inject script vào DOM
 * - Mixpanel (tracking sự kiện & phễu chuyển đổi) - sử dụng mixpanel-browser
 *
 * ⚠️  MỌI SỰ KIỆN ĐỀU DÙNG MOCK DATA KHI CHƯA CÓ BACKEND.
 *     Tìm các comment "TODO: Replace with real data" để ráp nối data thật sau.
 *
 * CÁCH SỬ DỤNG:
 *   1. Gọi initAnalytics() trong main.tsx một lần duy nhất khi app khởi động.
 *   2. Import và gọi các hàm track* ở bất kỳ component nào cần theo dõi sự kiện.
 */

import mixpanel from "mixpanel-browser";

// ─── TYPES ───────────────────────────────────────────────────────────────────

/** Thông tin User - Điền từ Supabase Auth sau khi Backend hoàn thiện */
export interface UserProfile {
  /** TODO: Replace with real Supabase user.id */
  userId: string;
  /** TODO: Replace with real Supabase user.email */
  email?: string;
  /** TODO: Replace with real display name từ profile table */
  displayName?: string;
}

/** Thông tin sản phẩm - Điền từ API/Supabase sau khi Backend hoàn thiện */
export interface ProductInfo {
  /** TODO: Replace with real product ID từ database */
  productId: string;
  /** TODO: Replace with real product name */
  productName: string;
  /** TODO: Replace with real product category */
  category?: string;
  /** TODO: Replace with real price từ database */
  price?: number;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

/**
 * Mock User hiện tại - Thay bằng data từ Supabase Auth sau này
 * TODO: Replace with real user from useSupabaseAuth() hook or context
 */
const MOCK_USER: UserProfile = {
  userId: "mock-user-demo-001",
  email: "demo@vtry.vn",
  displayName: "Demo User",
};

/**
 * Mock sản phẩm mặc định - Thay bằng data từ API sản phẩm sau này
 * TODO: Replace with real product data fetched from Supabase
 */
const MOCK_DEFAULT_PRODUCT: ProductInfo = {
  productId: "mock-product-tshirt-001",
  productName: "V-TRY T-SHIRT",
  category: "Tops",
  price: 89,
};

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN as string | undefined;
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID as string | undefined;
const IS_DEV = import.meta.env.DEV;

// ─── INTERNAL HELPERS ─────────────────────────────────────────────────────────

/** Log sự kiện ra console khi ở môi trường Development */
function debugLog(eventName: string, properties?: Record<string, unknown>) {
  if (IS_DEV) {
    console.log(
      `%c[Analytics] 📊 ${eventName}`,
      "color: #FF6F61; font-weight: bold;",
      properties ?? {}
    );
  }
}

/** Inject script Microsoft Clarity vào DOM */
function injectClarityScript(clarityId: string) {
  if (document.getElementById("ms-clarity-script")) return; // Tránh inject 2 lần

  const script = document.createElement("script");
  script.id = "ms-clarity-script";
  script.type = "text/javascript";
  script.innerHTML = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${clarityId}");
  `;
  document.head.appendChild(script);

  debugLog("Clarity Initialized", { clarityId });
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

/**
 * Khởi tạo tất cả analytics services.
 * Gọi hàm này một lần duy nhất trong main.tsx trước khi render App.
 */
export function initAnalytics(): void {
  // 1. Khởi tạo Microsoft Clarity
  if (CLARITY_ID) {
    injectClarityScript(CLARITY_ID);
  } else {
    debugLog("Clarity SKIPPED - VITE_CLARITY_ID not set");
  }

  // 2. Khởi tạo Mixpanel
  if (MIXPANEL_TOKEN) {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: IS_DEV,
      track_pageview: true,          // Tự động track page view
      persistence: "localStorage",
      ignore_dnt: false,
    });

    // Identify mock user ngay khi init
    // TODO: Thay MOCK_USER bằng user thật từ Supabase Auth session
    identifyUser(MOCK_USER);

    debugLog("Mixpanel Initialized", { token: MIXPANEL_TOKEN.slice(0, 8) + "..." });
  } else {
    debugLog("Mixpanel SKIPPED - VITE_MIXPANEL_TOKEN not set");
  }
}

/**
 * Gắn thông tin định danh người dùng vào Mixpanel.
 * TODO: Gọi hàm này sau khi user đăng nhập thành công qua Supabase Auth.
 *
 * @example
 * // Sau khi backend hoàn thiện:
 * const { data: { user } } = await supabase.auth.getUser();
 * identifyUser({ userId: user.id, email: user.email, displayName: user.user_metadata.name });
 */
export function identifyUser(user: UserProfile): void {
  if (!MIXPANEL_TOKEN) return;

  mixpanel.identify(user.userId);
  mixpanel.people.set({
    $email: user.email,
    $name: user.displayName,
    // TODO: Thêm các thuộc tính user khác từ Supabase profile table
  });

  debugLog("User Identified", { ...user });
}

/**
 * Reset thông tin người dùng (khi đăng xuất).
 * TODO: Gọi hàm này khi user đăng xuất qua supabase.auth.signOut().
 */
export function resetUser(): void {
  if (!MIXPANEL_TOKEN) return;
  mixpanel.reset();
  debugLog("User Reset (Logged Out)");
}

/**
 * Hàm tracking sự kiện tổng quát.
 * Tự động thêm mock user info và log ra console ở môi trường dev.
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  const enrichedProps = {
    // Metadata chung cho mọi sự kiện
    app_version: "1.0.0",
    platform: "web",
    timestamp: new Date().toISOString(),
    // TODO: Thay mock_user_id bằng real userId từ Supabase Auth
    user_id: MOCK_USER.userId,
    ...properties,
  };

  debugLog(eventName, enrichedProps);

  if (MIXPANEL_TOKEN) {
    mixpanel.track(eventName, enrichedProps);
  }
}

// ─── DOMAIN-SPECIFIC TRACKING FUNCTIONS ─────────────────────────────────────
// Các hàm dưới đây là các wrapper có cấu trúc rõ ràng cho từng loại sự kiện.
// Ưu tiên dùng các hàm này thay vì gọi trackEvent trực tiếp.

/**
 * Track khi người dùng click nút "Try On In 3D" (Virtual Dressing Room).
 */
export function trackVirtualTryOn(options: {
  /** TODO: Replace with real product data from API */
  product?: Partial<ProductInfo>;
  color?: string;
  size?: string;
  action: "try_on" | "take_off";
}): void {
  const product = { ...MOCK_DEFAULT_PRODUCT, ...options.product };
  trackEvent("Virtual Try-On Clicked", {
    product_id: product.productId,
    product_name: product.productName,
    product_category: product.category,
    product_price: product.price,
    selected_color: options.color ?? "unknown",
    selected_size: options.size ?? "M",
    action: options.action,
    // TODO: Thêm trường 'is_authenticated' từ Supabase Auth session
    is_authenticated: false, // Mock: luôn là guest
  });
}

/**
 * Track khi người dùng thay đổi màu sắc quần áo trong Dressing Room.
 */
export function trackColorChange(options: {
  colorName: string;
  colorHex: string;
  /** TODO: Replace with real product data */
  product?: Partial<ProductInfo>;
}): void {
  const product = { ...MOCK_DEFAULT_PRODUCT, ...options.product };
  trackEvent("Color Selected", {
    product_id: product.productId,
    product_name: product.productName,
    color_name: options.colorName,
    color_hex: options.colorHex,
  });
}

/**
 * Track khi người dùng thay đổi size quần áo trong Dressing Room.
 */
export function trackSizeChange(options: {
  size: string;
  /** TODO: Replace with real product data */
  product?: Partial<ProductInfo>;
}): void {
  const product = { ...MOCK_DEFAULT_PRODUCT, ...options.product };
  trackEvent("Size Selected", {
    product_id: product.productId,
    product_name: product.productName,
    selected_size: options.size,
  });
}

/**
 * Track khi người dùng submit form gợi ý size (Size Suggestion AI).
 */
export function trackSizeSuggestionSubmit(options: {
  productId: string;
  productName: string;
  measurements: {
    heightCm: number;
    weightKg: number;
    chestCm?: number;
    waistCm?: number;
    hipsCm?: number;
  };
}): void {
  trackEvent("Size Suggestion Submitted", {
    product_id: options.productId,
    product_name: options.productName,
    height_cm: options.measurements.heightCm,
    weight_kg: options.measurements.weightKg,
    chest_cm: options.measurements.chestCm,
    waist_cm: options.measurements.waistCm,
    hips_cm: options.measurements.hipsCm,
    // TODO: Thêm 'user_id' thật từ Supabase Auth
  });
}

/**
 * Track khi AI gợi ý size hoàn thành (và kết quả).
 */
export function trackSizeSuggestionResult(options: {
  productId: string;
  productName: string;
  suggestedSize: string;
  confidence?: number;
}): void {
  trackEvent("Size Suggestion Result Received", {
    product_id: options.productId,
    product_name: options.productName,
    suggested_size: options.suggestedSize,
    confidence: options.confidence,
  });
}

/**
 * Track khi người dùng chọn áo trên trang Virtual Style Check (camera AR).
 */
export function trackStyleCheckGarmentSelect(options: {
  garmentId: string;
  garmentName: string;
}): void {
  trackEvent("Style Check Garment Selected", {
    garment_id: options.garmentId,
    garment_name: options.garmentName,
  });
}

/**
 * Track khi người dùng trigger AI Try-On trên Style Check (chụp ảnh AR).
 */
export function trackStyleCheckAITryOn(options: {
  garmentId: string;
  garmentName: string;
  trigger: "gesture" | "button";
}): void {
  trackEvent("Style Check AI Try-On Triggered", {
    garment_id: options.garmentId,
    garment_name: options.garmentName,
    trigger_method: options.trigger,
  });
}

/**
 * Track khi người dùng click "Add to Cart".
 */
export function trackAddToCart(options: {
  /** TODO: Replace with real product data from API/Supabase */
  product?: Partial<ProductInfo>;
  size?: string;
  color?: string;
  quantity?: number;
}): void {
  const product = { ...MOCK_DEFAULT_PRODUCT, ...options.product };
  trackEvent("Add to Cart", {
    product_id: product.productId,
    product_name: product.productName,
    product_category: product.category,
    product_price: product.price,
    selected_size: options.size ?? "M",
    selected_color: options.color,
    quantity: options.quantity ?? 1,
    // TODO: Thêm 'cart_id' hay 'session_id' từ Supabase sau này
  });
}
