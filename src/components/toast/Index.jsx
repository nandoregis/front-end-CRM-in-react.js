import { useEffect, useState } from "react";

const icons = {
  success: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  ),
  warning: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
};

export default function Toast({ type, message, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const styles = {
    success: "bg-white border-green-200 text-gray-800",
    error:   "bg-white border-red-200 text-gray-800",
    warning: "bg-white border-yellow-200 text-gray-800",
  };

  const accent = {
    success: "bg-green-500",
    error:   "bg-red-500",
    warning: "bg-yellow-400",
  };

  return (
    <div
      className={`
        relative flex items-center justify-between gap-4 px-4 py-3
        rounded-xl border shadow-sm overflow-hidden min-w-[280px] max-w-sm
        transition-all duration-300 ease-out
        ${styles[type] || styles.error}
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
      `}
    >
      <span className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${accent[type] || accent.error}`} />

      <div className="flex items-center gap-3 pl-2">
        <span className="flex-shrink-0">{icons[type]}</span>
        <span className="text-sm text-gray-700 leading-snug">{message}</span>
      </div>

      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 200);
        }}
        className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0"
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}