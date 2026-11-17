import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/formatters';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-md',
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Dialog container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className={cn(
            'relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all w-full border border-[#E2DFC9]',
            maxWidth
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-[#EAE7D8]">
            <div>
              <h3 className="text-base font-bold text-[#18201B]">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-[#6F7B70] mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-[#849185] hover:text-[#18201B] p-1 rounded-lg hover:bg-[#F2EFE4] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
