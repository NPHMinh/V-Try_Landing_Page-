import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

interface SizeChartEntry {
  size: string;
  chestCm: [number, number];
  waistCm: [number, number];
  hipsCm?: [number, number];
  lengthCm?: number;
}

interface ProductSizing {
  id: string;
  name: string;
  fit: "slim-fit" | "regular" | "oversized";
  sizeChart: SizeChartEntry[];
}

interface SizeSuggestionRequest {
  productId?: string;
  measurements?: {
    heightCm?: number;
    weightKg?: number;
    chestCm?: number;
    waistCm?: number;
    hipsCm?: number;
  };
}

interface SizeSuggestion {
  recommended_size: string;
  fit_percentage: number;
  advice: string;
}

const SIZE_SUGGESTION_MODEL = "gemini-2.5-flash";

const PRODUCTS: ProductSizing[] = [
  {
    id: "black-jacket",
    name: "Black Jacket",
    fit: "regular",
    sizeChart: [
      { size: "28", waistCm: [71, 73], hipsCm: [86, 89], lengthCm: 102, chestCm: [0, 0] },
      { size: "30", waistCm: [76, 78], hipsCm: [91, 94], lengthCm: 103, chestCm: [0, 0] },
      { size: "32", waistCm: [81, 83], hipsCm: [96, 99], lengthCm: 104, chestCm: [0, 0] },
      { size: "34", waistCm: [86, 88], hipsCm: [101, 104], lengthCm: 105, chestCm: [0, 0] },
      { size: "36", waistCm: [91, 93], hipsCm: [106, 109], lengthCm: 106, chestCm: [0, 0] },
    ],
  },
  {
    id: "hoodie",
    name: "Black Hoodie",
    fit: "regular",
    sizeChart: [
      { size: "S", chestCm: [88, 96], waistCm: [76, 84], lengthCm: 68 },
      { size: "M", chestCm: [96, 104], waistCm: [84, 92], lengthCm: 70 },
      { size: "L", chestCm: [104, 112], waistCm: [92, 100], lengthCm: 72 },
      { size: "XL", chestCm: [112, 120], waistCm: [100, 108], lengthCm: 74 },
    ],
  },
  {
    id: "sweatshirt",
    name: "Sweatshirt",
    fit: "regular",
    sizeChart: [
      { size: "M", chestCm: [96, 104], waistCm: [84, 92], lengthCm: 70 },
      { size: "L", chestCm: [104, 112], waistCm: [92, 100], lengthCm: 72 },
      { size: "XL", chestCm: [112, 120], waistCm: [100, 108], lengthCm: 74 },
      { size: "XXL", chestCm: [120, 128], waistCm: [108, 116], lengthCm: 76 },
    ],
  },
  {
    id: "tank-top",
    name: "Tank Top",
    fit: "regular",
    sizeChart: [
      { size: "S", chestCm: [92, 100], waistCm: [80, 88], lengthCm: 66 },
      { size: "M", chestCm: [100, 108], waistCm: [88, 96], lengthCm: 68 },
      { size: "L", chestCm: [108, 116], waistCm: [96, 104], lengthCm: 70 },
      { size: "XL", chestCm: [116, 124], waistCm: [104, 112], lengthCm: 72 },
    ],
  },
];

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
let cachedGemini: GoogleGenAI | null = null;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

function getGemini() {
  if (cachedGemini) return cachedGemini;
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY or ANTHROPIC_API_KEY.");
  }
  cachedGemini = new GoogleGenAI({ apiKey });
  return cachedGemini;
}

function fallback(sizeChart: SizeChartEntry[]): SizeSuggestion {
  const mid = sizeChart[Math.floor(sizeChart.length / 2)];
  return {
    recommended_size: mid?.size ?? "M",
    fit_percentage: 70,
    advice: "Chua the dua ra goi y chinh xac luc nay. Hay thu lai sau hoac tham khao size chart.",
  };
}

function isValidSuggestion(value: unknown): value is SizeSuggestion {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.recommended_size === "string" &&
    typeof item.fit_percentage === "number" &&
    item.fit_percentage >= 0 &&
    item.fit_percentage <= 100 &&
    typeof item.advice === "string" &&
    item.advice.length <= 320
  );
}

function systemPrompt() {
  return `Ban la AI tu van size thoi trang chuyen nghiep. Nhiem vu cua ban la de xuat size phu hop nhat dua tren so do co the va size chart.

Quy tac:
- Chi de xuat cac size co trong size chart duoc cung cap.
- fit_percentage phan anh muc do phu hop thuc su, dua tren sai so giua so do nguoi dung va khoang size chart.
- Neu so do nam giua 2 size, chon size lon hon va ghi chu trong advice.
- Phom slim-fit recommend chat hon, oversized recommend rong hon.
- Advice viet bang tieng Viet co dau neu co the, ngan gon toi da 240 ky tu.`;
}

function userPrompt(product: ProductSizing, measurements: NonNullable<SizeSuggestionRequest["measurements"]>) {
  return `Thong so nguoi dung:
- Chieu cao: ${measurements.heightCm}cm
- Can nang: ${measurements.weightKg}kg
- Vong nguc: ${measurements.chestCm}cm
- Vong eo: ${measurements.waistCm}cm${measurements.hipsCm ? `\n- Vong mong: ${measurements.hipsCm}cm` : ""}

San pham: ${product.name}
Phom dang: ${product.fit}

Size chart san pham:
${JSON.stringify(product.sizeChart, null, 2)}

De xuat size phu hop nhat va giai thich ngan gon.`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ??
    req.socket.remoteAddress ??
    "unknown";

  if (isRateLimited(ip)) {
    res.status(429).json({ error: "Qua nhieu yeu cau. Vui long thu lai sau 1 phut." });
    return;
  }

  const body = req.body as SizeSuggestionRequest;
  const { productId, measurements } = body;
  if (!productId || !measurements) {
    res.status(400).json({ error: "Missing productId or measurements" });
    return;
  }

  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) {
    res.status(400).json({ error: "Product does not have sizing configuration." });
    return;
  }

  try {
    const gemini = getGemini();
    const response = await gemini.models.generateContent({
      model: SIZE_SUGGESTION_MODEL,
      contents: userPrompt(product, measurements),
      config: {
        systemInstruction: systemPrompt(),
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            recommended_size: { type: "STRING" },
            fit_percentage: { type: "NUMBER" },
            advice: { type: "STRING" },
          },
          required: ["recommended_size", "fit_percentage", "advice"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      res.status(200).json(fallback(product.sizeChart));
      return;
    }

    const parsed = JSON.parse(text) as unknown;
    if (!isValidSuggestion(parsed)) {
      res.status(200).json(fallback(product.sizeChart));
      return;
    }

    res.status(200).json(parsed);
  } catch (err) {
    console.error("[size-suggestion] Gemini error:", err);
    res.status(200).json(fallback(product.sizeChart));
  }
}
