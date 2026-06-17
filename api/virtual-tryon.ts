import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Client, handle_file } from "@gradio/client";

interface VirtualTryOnBody {
  personImageBase64?: string;
  garmentId?: string;
  garmentDescription?: string;
  garmentImageBase64?: string;
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 2) return false;
  entry.count++;
  return true;
}

function base64ToBlob(base64: string, type: string) {
  const bytes = Uint8Array.from(Buffer.from(base64, "base64"));
  return new Blob([bytes], { type });
}

async function runPredict(personBlob: Blob, garmentBlob: Blob) {
  const client = await Client.connect("Kwai-Kolors/Kolors-Virtual-Try-On", {
    events: ["log", "status"],
  });

  const result = await client.predict(2, [
    handle_file(personBlob),
    handle_file(garmentBlob),
    42,
    true,
  ]);

  const data = result.data as unknown[];
  const outputImage = data?.[0] as string | { url?: string; path?: string } | undefined;
  if (!outputImage) throw new Error("Kolors Virtual Try-On returned no output image");

  if (typeof outputImage === "string") return outputImage;
  if (outputImage.url) return outputImage.url;
  if (outputImage.path) return outputImage.path;
  throw new Error("Unexpected output format from Kolors Virtual Try-On");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ fallback: true, error: "Method not allowed" });
    return;
  }

  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ??
    req.socket.remoteAddress ??
    "unknown";

  if (!checkRateLimit(ip)) {
    res.status(429).json({
      fallback: true,
      error: "Đang xử lý ảnh trước, vui lòng chờ 1 phút.",
    });
    return;
  }

  const body = req.body as VirtualTryOnBody;
  const { personImageBase64, garmentId, garmentImageBase64 } = body;

  if (!personImageBase64 || !garmentId || !garmentImageBase64) {
    res.status(400).json({
      fallback: true,
      error: "Thiếu ảnh người hoặc ảnh áo để tạo AI Try-On.",
    });
    return;
  }

  const personBlob = base64ToBlob(personImageBase64, "image/jpeg");
  const garmentBlob = base64ToBlob(garmentImageBase64, "image/jpeg");

  try {
    let imageUrl: string | undefined;
    let lastErr: unknown;
    const maxAttempts = 2;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        imageUrl = await runPredict(personBlob, garmentBlob);
        break;
      } catch (err) {
        lastErr = err;
        const msg = err instanceof Error ? err.message : String(err);
        const retryable =
          msg.includes("Session not found") ||
          msg.includes("terminated") ||
          msg.includes("socket") ||
          msg.includes("UND_ERR");
        if (!retryable || attempt === maxAttempts) throw err;
      }
    }

    if (!imageUrl) throw lastErr;

    let resultUrl = imageUrl;
    if (imageUrl.startsWith("http")) {
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) {
        throw new Error(`Failed to fetch result image: ${imgRes.status}`);
      }
      const imgBuf = await imgRes.arrayBuffer();
      const imgB64 = Buffer.from(imgBuf).toString("base64");
      const mimeType = imgRes.headers.get("content-type") ?? "image/png";
      resultUrl = `data:${mimeType};base64,${imgB64}`;
    }

    res.status(200).json({ resultUrl, fallback: false });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[virtual-tryon] Kolors error:", msg);
    res.status(503).json({
      fallback: true,
      error:
        "AI Try-On tạm thời không khả dụng, có thể Hugging Face Spaces đang bận. Thử lại sau ít phút.",
    });
  }
}
