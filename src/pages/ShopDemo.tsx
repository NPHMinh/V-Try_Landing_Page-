import { ArrowLeft, Star, Heart, Share2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import SizeSuggestionModal from "../components/size-suggestion/SizeSuggestionModal";

export default function ShopDemo() {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("#111827");
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [suggestedSize, setSuggestedSize] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipAutoHideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-show tooltip after 3 seconds if no size is selected by user action
  useEffect(() => {
    tooltipTimerRef.current = setTimeout(() => {
      if (!suggestedSize) {
        setShowTooltip(true);
        tooltipAutoHideRef.current = setTimeout(() => setShowTooltip(false), 6000);
      }
    }, 3000);
    return () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      if (tooltipAutoHideRef.current) clearTimeout(tooltipAutoHideRef.current);
    };
  }, [suggestedSize]);

  const dismissTooltip = () => {
    setShowTooltip(false);
    if (tooltipAutoHideRef.current) clearTimeout(tooltipAutoHideRef.current);
  };

  const colors = [
    { name: "Onyx Black", hex: "#111827" },
    { name: "Heather Gray", hex: "#9ca3af" },
    { name: "Coral Red", hex: "#FF6F61" },
  ];

  const sizes = ["S", "M", "L", "XL"];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white pb-24">
      {/* Inline styles for animations */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseBorder {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 111, 97, 0.5); }
          50% { box-shadow: 0 0 0 6px rgba(255, 111, 97, 0); }
        }
        @keyframes aiPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes tooltipSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ai-gradient-btn {
          background: linear-gradient(135deg, #FF6F61, #f97316, #e11d48, #FF6F61);
          background-size: 300% 300%;
          animation: gradientShift 3s ease infinite, pulseBorder 2s ease infinite;
        }
        .ai-badge {
          animation: aiPulse 2s ease-in-out infinite;
        }
        .tooltip-animate {
          animation: tooltipSlideIn 0.3s ease forwards;
        }
      `}</style>

      {/* Top Navigation */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Demos
          </Link>
          <div className="text-sm font-medium text-gray-500 hidden sm:block">
            Home / Men / Tops / <span className="text-gray-900">V-Try T-Shirt</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          {/* Left: Product Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 relative group">
              <img
                src="/t-shirt-demo.jpg"
                alt="Product"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col pt-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              V-Try Essential T-Shirt
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-gray-900">$45.00</span>
              <div className="flex items-center gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-sm font-medium text-gray-500 ml-1">
                  (128 reviews)
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Experience the perfect blend of comfort and style. Our premium
              lightweight cotton tee is tailored to adapt to your specific body
              shape, ensuring you look your best all day long.
            </p>

            <hr className="border-gray-100 mb-8" />

            {/* Colors */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Color: {colors.find((c) => c.hex === selectedColor)?.name}
              </h3>
              <div className="flex gap-3">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedColor(c.hex)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      selectedColor === c.hex
                        ? "border-gray-900 scale-110 shadow-md"
                        : "border-transparent hover:scale-110"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Select Size
                </h3>
              </div>

              {/* AI Size Suggestion Button with Tooltip */}
              <div className="relative mb-4">
                <button
                  id="ai-size-btn"
                  onClick={() => {
                    setShowTooltip(false);
                    setIsSizeModalOpen(true);
                  }}
                  className="ai-gradient-btn w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity"
                >
                  <SparklesIcon className="w-4 h-4" />
                  <span>✨ Gợi ý Size bằng AI</span>
                  <span className="ai-badge ml-1 bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/30">
                    AI
                  </span>
                  {suggestedSize && (
                    <span className="ml-1 bg-white text-orange-500 text-[10px] font-black px-2 py-0.5 rounded-full">
                      Chính xác 99%
                    </span>
                  )}
                </button>

                {/* Smart Tooltip */}
                {showTooltip && (
                  <div className="tooltip-animate absolute bottom-full mb-3 left-0 right-0 z-30">
                    <div className="relative bg-gray-900 text-white text-xs font-medium rounded-2xl px-4 py-3 shadow-2xl">
                      <button
                        onClick={dismissTooltip}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="flex items-start gap-2 pr-4">
                        <span className="text-base">⚡</span>
                        <p className="leading-relaxed">
                          Bạn băn khoăn về kích cỡ? Hãy để AI gợi ý size vừa vặn nhất cho bạn chỉ trong 5 giây!
                        </p>
                      </div>
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </div>
                  </div>
                )}
              </div>

              {/* Size Grid */}
              <div className="grid grid-cols-4 gap-3">
                {sizes.map((s) => (
                  <div key={s} className="relative">
                    {suggestedSize === s && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                        <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
                          Khuyên dùng
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => setSelectedSize(s)}
                      className={`w-full py-3 text-sm font-bold rounded-xl border transition-all ${
                        selectedSize === s
                          ? suggestedSize === s
                            ? "border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 text-orange-600 shadow-md shadow-orange-100"
                            : "border-gray-900 bg-gray-900 text-white"
                          : suggestedSize === s
                          ? "border-orange-300 text-orange-500 hover:border-orange-500"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {s}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* V-Try Plugin CTA */}
            <div className="mb-8 p-1 rounded-2xl bg-gradient-to-r from-[#FF6F61] via-orange-400 to-[#FF6F61] overflow-hidden">
              <div className="bg-white rounded-xl p-5 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-orange-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2 text-[#FF6F61]">
                    <SparklesIcon className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">
                      Powered by V-Try
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    Unsure about the fit?
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    See exactly how this looks on your specific body type in 3D.
                  </p>

                  <button
                    onClick={() => navigate("/try-on")}
                    className="w-full bg-[#FF6F61] text-white font-bold py-3 rounded-xl hover:bg-[#fa5c4d] hover:-translate-y-0.5 transition-all shadow-md shadow-orange-200 flex items-center justify-center gap-2"
                  >
                    Launch Virtual Try-On
                  </button>
                </div>
              </div>
            </div>

            <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 mb-4">
              Add to Cart
            </button>
            <p className="text-center text-xs font-medium text-gray-500">
              Free shipping and returns on orders over $100.
            </p>
          </div>
        </div>
      </div>
      <SizeSuggestionModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        productId="hoodie"
        productName="V-Try Essential T-Shirt"
        onSelectSize={(size) => {
          setSelectedSize(size);
          setSuggestedSize(size);
        }}
      />
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2l2.09 6.26L20 9l-5.91 2.74L12 22l-2.09-10.26L4 9l5.91-.74L12 2z" />
    </svg>
  );
}
