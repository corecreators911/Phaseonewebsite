import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Eye } from "lucide-react";

interface PreviewNoticeProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export const PreviewNotice = ({
  isOpen,
  onClose,
  title = "Coming Soon",
  message = "This section is still being developed and will be available in the final version.",
}: PreviewNoticeProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="relative max-w-sm w-full mx-4 rounded-2xl border border-white/[0.06] bg-neutral-950 p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-[#8C0B0C]/30 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-[#8C0B0C]/30 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-[#8C0B0C]/30 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-[#8C0B0C]/30 rounded-br-2xl" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:border-[#8C0B0C]/50 transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {/* Icon */}
            <div className="mx-auto mb-5 h-14 w-14 rounded-full border border-[#8C0B0C]/30 bg-[#8C0B0C]/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-[#8C0B0C]" />
            </div>

            {/* Label */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-1.5 w-1.5 rounded-full bg-[#8C0B0C] animate-pulse" />
              <span className="text-[10px] font-mono text-[#8C0B0C] uppercase tracking-[0.3em]">
                Preview
              </span>
            </div>

            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">
              {title}
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
