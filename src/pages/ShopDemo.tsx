import { ArrowLeft, Star, Heart, Share2, Ruler } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import SizeSuggestionModal from "../components/size-suggestion/SizeSuggestionModal";

export default function ShopDemo() {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("#111827");
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  const colors = [
    { name: "Onyx Black", hex: "#111827" },
    { name: "Heather Gray", hex: "#9ca3af" },
    { name: "Coral Red", hex: "#FF6F61" },
  ];

  const sizes = ["S", "M", "L", "XL"];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white pb-24">
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
            Home / Men / Tops /{" "}
            <span className="text-gray-900">V-Try T-Shirt</span>
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Select Size
                </h3>
                <button
                  onClick={() => setIsSizeModalOpen(true)}
                  className="text-sm font-medium text-[#FF6F61] hover:text-[#fa5c4d] flex items-center gap-1 transition-colors"
                >
                  <Ruler className="w-4 h-4" /> Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-3 text-sm font-bold rounded-xl border transition-all ${
                      selectedSize === s
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {s}
                  </button>
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
        onSelectSize={(size) => setSelectedSize(size)}
      />
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
