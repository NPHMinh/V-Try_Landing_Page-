import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
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
              <style>{`
                @keyframes headerGradient {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                @keyframes badgePulse {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.8; transform: scale(1.1); }
                }
                .modal-icon-bg {
                  background: linear-gradient(135deg, #FF6F61, #f97316, #e11d48, #FF6F61);
                  background-size: 300% 300%;
                  animation: headerGradient 4s ease infinite;
                }
                .modal-ai-badge {
                  animation: badgePulse 2s ease-in-out infinite;
                }
              `}</style>
              <div className="flex items-center gap-3">
                <div className="modal-icon-bg w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 2l2.09 6.26L20 9l-5.91 2.74L12 22l-2.09-10.26L4 9l5.91-.74L12 2z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-black text-gray-900 text-lg uppercase tracking-wider">
                      Gợi ý Size AI
                    </h3>
                    <span className="modal-ai-badge bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow">
                      AI ✨
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    Phân tích số đo & tìm size vừa vặn nhất chỉ trong 5 giây ⚡
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
