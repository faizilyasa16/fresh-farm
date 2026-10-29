import React, { useEffect } from 'react';

export default function AccessibleModal({
    isOpen,
    onClose,
    title,
    id = 'modal-dialog',
    maxWidthClass = 'max-w-2xl',
    children,
}) {
    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const headingId = `${id}-heading`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className={`bg-white rounded-2xl w-full ${maxWidthClass} p-5 sm:p-7 shadow-xl border border-[#D6D3CB] my-8 max-h-[90vh] overflow-y-auto`}
            >
                <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-[#E7E5DF]">
                    <h2 id={headingId} className="text-lg sm:text-xl font-bold text-[#1C1917]">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup dialog"
                        className="min-w-11 min-h-11 inline-flex items-center justify-center rounded-xl border border-[#78716C] text-[#1C1917] hover:bg-[#F4F2EC] font-bold text-lg leading-none shrink-0 cursor-pointer"
                    >
                        &times;
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

