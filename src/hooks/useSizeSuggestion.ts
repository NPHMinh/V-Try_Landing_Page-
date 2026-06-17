import { useState } from "react";

export interface SizeSuggestion {
  recommended_size: string;
  fit_percentage: number;
  advice: string;
}

export interface SizeSuggestionRequest {
  productId: string;
  measurements: {
    heightCm: number;
    weightKg: number;
    chestCm: number;
    waistCm: number;
    hipsCm?: number;
  };
}

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: SizeSuggestion }
  | { status: "error"; message: string };

function getLocalSuggestion(
  productId: string,
  measurements: { chestCm: number; waistCm: number; hipsCm?: number }
): SizeSuggestion {
  const charts: Record<string, { size: string; chest?: [number, number]; waist: [number, number] }[]> = {
    "black-jacket": [
      { size: "28", waist: [71, 73] },
      { size: "30", waist: [76, 78] },
      { size: "32", waist: [81, 83] },
      { size: "34", waist: [86, 88] },
      { size: "36", waist: [91, 93] },
    ],
    "hoodie": [
      { size: "S", chest: [88, 96], waist: [76, 84] },
      { size: "M", chest: [96, 104], waist: [84, 92] },
      { size: "L", chest: [104, 112], waist: [92, 100] },
      { size: "XL", chest: [112, 120], waist: [100, 108] },
    ],
    "sweatshirt": [
      { size: "M", chest: [96, 104], waist: [84, 92] },
      { size: "L", chest: [104, 112], waist: [92, 100] },
      { size: "XL", chest: [112, 120], waist: [100, 108] },
      { size: "XXL", chest: [120, 128], waist: [108, 116] },
    ],
    "tank-top": [
      { size: "S", chest: [92, 100], waist: [80, 88] },
      { size: "M", chest: [100, 108], waist: [88, 96] },
      { size: "L", chest: [108, 116], waist: [96, 104] },
      { size: "XL", chest: [116, 124], waist: [104, 112] },
    ],
  };

  const productChart = charts[productId] || charts["hoodie"];
  let bestSize = productChart[0];
  let minDiff = Infinity;

  for (const entry of productChart) {
    let diff = 0;
    const waistMid = (entry.waist[0] + entry.waist[1]) / 2;
    diff += Math.abs(measurements.waistCm - waistMid);

    if (entry.chest && measurements.chestCm) {
      const chestMid = (entry.chest[0] + entry.chest[1]) / 2;
      diff += Math.abs(measurements.chestCm - chestMid);
    }

    if (diff < minDiff) {
      minDiff = diff;
      bestSize = entry;
    }
  }

  return {
    recommended_size: bestSize.size,
    fit_percentage: Math.max(60, Math.min(98, Math.round(100 - minDiff * 1.5))),
    advice: `[Mô phỏng Offline] Đề xuất size ${bestSize.size} dựa trên thông số số đo của bạn. Hãy khởi chạy bằng Vercel CLI (vercel dev) để kích hoạt gợi ý thông minh từ AI Gemini.`,
  };
}

export function useSizeSuggestion() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function submit(req: SizeSuggestionRequest) {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/size-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });

      if (res.status === 404) {
        // Fallback to local matching logic if server endpoint is 404
        console.warn("/api/size-suggestion endpoint not found. Falling back to client-side local matching.");
        const fallbackData = getLocalSuggestion(req.productId, {
          chestCm: req.measurements.chestCm,
          waistCm: req.measurements.waistCm,
          hipsCm: req.measurements.hipsCm,
        });
        setState({ status: "success", data: fallbackData });
        return;
      }

      if (!res.ok) {
        let errorMsg = "Lỗi không xác định.";
        try {
          const json = await res.json();
          errorMsg = json.error ?? errorMsg;
        } catch {
          // Response is not JSON (e.g. HTML/text error page)
        }
        throw new Error(errorMsg);
      }

      const json = await res.json();
      setState({ status: "success", data: json as SizeSuggestion });
    } catch (err) {
      console.warn("Fetch failed, falling back to client-side local matching:", err);
      const fallbackData = getLocalSuggestion(req.productId, {
        chestCm: req.measurements.chestCm,
        waistCm: req.measurements.waistCm,
        hipsCm: req.measurements.hipsCm,
      });
      setState({ status: "success", data: fallbackData });
    }
  }

  function reset() {
    setState({ status: "idle" });
  }

  return { state, submit, reset };
}
