import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useSizeSuggestion } from "../../hooks/useSizeSuggestion";
import { trackSizeSuggestionSubmit } from "../../services/analytics";
import SizeSuggestionResult from "./SizeSuggestionResult";

interface SliderProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

function Slider({ label, unit, value, min, max, onChange }: SliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold text-gray-700 tracking-wide">
          {label}
        </span>
        <span className="font-bold text-[#FF6F61] bg-orange-50 px-2 py-0.5 rounded text-xs tabular-nums border border-orange-100">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#FF6F61] transition-all hover:bg-gray-200"
      />
    </div>
  );
}

interface Props {
  productId: string;
  productName: string;
  onApplyBodyParams?: (params: {
    height: number;
    weight: number;
    chest: number;
    waist: number;
    hips: number;
  }) => void;
  onSelectSize?: (size: string) => void;
}

export default function SizeSuggestionForm({
  productId,
  productName,
  onApplyBodyParams,
  onSelectSize,
}: Props) {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [chest, setChest] = useState(90);
  const [waist, setWaist] = useState(80);
  const [hips, setHips] = useState(90);

  const { state, submit, reset } = useSizeSuggestion();
  const isJacket = productId === "black-jacket";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // TODO: Truyền product thật từ API/Supabase vào trackSizeSuggestionSubmit
    trackSizeSuggestionSubmit({
      productId,
      productName,
      measurements: {
        heightCm: height,
        weightKg: weight,
        chestCm: chest,
        waistCm: waist,
        hipsCm: hips,
      },
    });

    submit({
      productId,
      measurements: {
        heightCm: height,
        weightKg: weight,
        chestCm: chest,
        waistCm: waist,
        hipsCm: hips,
      },
    });
  }

  if (state.status === "success") {
    return (
      <SizeSuggestionResult
        data={state.status === "success" ? state.data : null}
        productId={productId}
        onReset={reset}
        bodyParams={{ height, weight, chest, waist, hips }}
        onApplyBodyParams={onApplyBodyParams}
        onSelectSize={onSelectSize}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-orange-50/50 border border-orange-100/50 rounded-xl p-4 text-xs text-orange-800 leading-relaxed">
        Nhập chính xác các thông số cơ thể dưới đây. AI của V-Try sẽ đối chiếu với bảng kích cỡ thực tế của **{productName}** để đề xuất size tối ưu nhất cho bạn.
      </div>

      <div className="space-y-5">
        <Slider label="Chiều cao" unit="cm" value={height} min={150} max={210} onChange={setHeight} />
        <Slider label="Cân nặng" unit="kg" value={weight} min={40} max={150} onChange={setWeight} />

        {!isJacket && (
          <Slider label="Vòng ngực" unit="cm" value={chest} min={70} max={130} onChange={setChest} />
        )}

        <Slider label="Vòng eo" unit="cm" value={waist} min={60} max={120} onChange={setWaist} />

        {isJacket && (
          <Slider label="Vòng mông" unit="cm" value={hips} min={70} max={130} onChange={setHips} />
        )}
      </div>

      {state.status === "error" && (
        <div className="text-sm text-red-600 border border-red-200 bg-red-50 rounded-xl px-4 py-3">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={state.status === "loading"}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
      >
        {state.status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
        {state.status === "loading" ? "Đang phân tích số đo..." : "Nhận gợi ý từ AI"}
      </button>
    </form>
  );
}
