import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import type { SizeSuggestion } from "../../hooks/useSizeSuggestion";

interface SizeChartEntry {
  size: string;
  chestCm?: [number, number];
  waistCm: [number, number];
  hipsCm?: [number, number];
  lengthCm?: number;
}

const PRODUCT_SIZE_CHARTS: Record<string, SizeChartEntry[]> = {
  "black-jacket": [
    { size: "28", waistCm: [71, 73], hipsCm: [86, 89], lengthCm: 102 },
    { size: "30", waistCm: [76, 78], hipsCm: [91, 94], lengthCm: 103 },
    { size: "32", waistCm: [81, 83], hipsCm: [96, 99], lengthCm: 104 },
    { size: "34", waistCm: [86, 88], hipsCm: [101, 104], lengthCm: 105 },
    { size: "36", waistCm: [91, 93], hipsCm: [106, 109], lengthCm: 106 },
  ],
  "hoodie": [
    { size: "S", chestCm: [88, 96], waistCm: [76, 84], lengthCm: 68 },
    { size: "M", chestCm: [96, 104], waistCm: [84, 92], lengthCm: 70 },
    { size: "L", chestCm: [104, 112], waistCm: [92, 100], lengthCm: 72 },
    { size: "XL", chestCm: [112, 120], waistCm: [100, 108], lengthCm: 74 },
  ],
  "sweatshirt": [
    { size: "M", chestCm: [96, 104], waistCm: [84, 92], lengthCm: 70 },
    { size: "L", chestCm: [104, 112], waistCm: [92, 100], lengthCm: 72 },
    { size: "XL", chestCm: [112, 120], waistCm: [100, 108], lengthCm: 74 },
    { size: "XXL", chestCm: [120, 128], waistCm: [108, 116], lengthCm: 76 },
  ],
  "tank-top": [
    { size: "S", chestCm: [92, 100], waistCm: [80, 88], lengthCm: 66 },
    { size: "M", chestCm: [100, 108], waistCm: [88, 96], lengthCm: 68 },
    { size: "L", chestCm: [108, 116], waistCm: [96, 104], lengthCm: 70 },
    { size: "XL", chestCm: [116, 124], waistCm: [104, 112], lengthCm: 72 },
  ],
};

interface Props {
  data: SizeSuggestion | null;
  productId: string;
  onReset: () => void;
  bodyParams: {
    height: number;
    weight: number;
    chest: number;
    waist: number;
    hips: number;
  };
  onApplyBodyParams?: (params: {
    height: number;
    weight: number;
    chest: number;
    waist: number;
    hips: number;
  }) => void;
  onSelectSize?: (size: string) => void;
}

export default function SizeSuggestionResult({
  data,
  productId,
  onReset,
  bodyParams,
  onApplyBodyParams,
  onSelectSize,
}: Props) {
  if (!data) return null;

  const bar = Math.round(data.fit_percentage);
  const label =
    bar >= 90
      ? "Rất phù hợp"
      : bar >= 75
        ? "Phù hợp"
        : bar >= 60
          ? "Vừa vặn"
          : "Có thể hơi rộng/chật";

  const sizeChart = PRODUCT_SIZE_CHARTS[productId] || [];

  return (
    <div className="space-y-6">
      {/* Result Card */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100/30 border border-orange-100 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-24 h-24 bg-orange-200/20 rounded-full blur-xl -translate-y-6 translate-x-6"></div>

        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF6F61] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Khuyên dùng bởi AI
            </div>
            <div className="text-4xl font-black text-gray-900 tracking-tight flex items-baseline gap-1.5">
              <span>Size {data.recommended_size}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Độ tương thích
            </div>
            <div className="text-2xl font-black text-[#FF6F61]">{bar}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-1.5 font-semibold">
            <span>{label}</span>
            <span>{bar}/100 điểm</span>
          </div>
          <div className="w-full h-2 bg-gray-200/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF6F61] to-orange-400 rounded-full transition-all duration-1000"
              style={{ width: `${bar}%` }}
            />
          </div>
        </div>

        {/* AI Advice */}
        <div className="mt-5 pt-4 border-t border-orange-200/40 text-sm text-gray-700 leading-relaxed">
          {data.advice}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {onApplyBodyParams && (
          <button
            onClick={() => onApplyBodyParams(bodyParams)}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-slate-100"
          >
            Áp dụng số đo vào mô hình 3D <ArrowRight className="w-4 h-4" />
          </button>
        )}
        {onSelectSize && (
          <button
            onClick={() => onSelectSize(data.recommended_size)}
            className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            Chọn Size {data.recommended_size} <ArrowRight className="w-4 h-4 text-[#FF6F61]" />
          </button>
        )}
      </div>

      {/* Size Chart Grid */}
      {sizeChart.length > 0 && (
        <div className="border border-gray-150 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Bảng kích cỡ (Size Chart)
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-600">
              <thead className="text-[10px] uppercase bg-gray-50/50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-2.5 font-bold">Size</th>
                  {sizeChart.some((s) => s.chestCm) && <th className="px-4 py-2.5 font-bold">Ngực (cm)</th>}
                  <th className="px-4 py-2.5 font-bold">Eo (cm)</th>
                  {sizeChart.some((s) => s.hipsCm) && <th className="px-4 py-2.5 font-bold">Mông (cm)</th>}
                  {sizeChart.some((s) => s.lengthCm) && <th className="px-4 py-2.5 font-bold">Dài áo/quần (cm)</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sizeChart.map((row) => {
                  const isCurrent = row.size === data.recommended_size;
                  return (
                    <tr
                      key={row.size}
                      className={`transition-colors ${
                        isCurrent ? "bg-orange-50/70 font-semibold text-gray-900" : "hover:bg-gray-50/50"
                      }`}
                    >
                      <td className="px-4 py-2.5 font-bold text-gray-900">{row.size}</td>
                      {row.chestCm && (
                        <td className="px-4 py-2.5">
                          {row.chestCm[0]} - {row.chestCm[1]}
                        </td>
                      )}
                      <td className="px-4 py-2.5">
                        {row.waistCm[0]} - {row.waistCm[1]}
                      </td>
                      {row.hipsCm && (
                        <td className="px-4 py-2.5">
                          {row.hipsCm[0]} - {row.hipsCm[1]}
                        </td>
                      )}
                      {row.lengthCm && <td className="px-4 py-2.5">{row.lengthCm}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reset */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-wider"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Đo lại số đo khác
        </button>
      </div>
    </div>
  );
}
