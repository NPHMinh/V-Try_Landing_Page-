import { AnimatePresence, motion } from "framer-motion";
import { X, Ruler } from "lucide-react";
import SizeSuggestionForm from "./SizeSuggestionForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
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

export default function SizeSuggestionModal({
  isOpen,
  onClose,
  productId,
  productName,
  onApplyBodyParams,
  onSelectSize,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 border border-gray-100 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-20">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF6F61]">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg uppercase tracking-wider">
                    AI Size Suggestion
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Tính toán kích cỡ cơ thể bằng trí tuệ nhân tạo
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-400 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 overflow-y-auto">
              <SizeSuggestionForm
                productId={productId}
                productName={productName}
                onApplyBodyParams={(params) => {
                  if (onApplyBodyParams) onApplyBodyParams(params);
                  onClose();
                }}
                onSelectSize={(size) => {
                  if (onSelectSize) onSelectSize(size);
                  onClose();
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
