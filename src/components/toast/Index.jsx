import { useEffect, useState } from "react";

export default function Toast({ type, message, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const styles = {
    success: "bg-green-100 border-green-300 text-green-700",
    error: "bg-red-100 border-red-300 text-red-700",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-700",
  };

  return (
    <div
      className={`
        flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-lg
        transition-all duration-300
        ${styles[type] || styles.error}
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}
      `}
    >
      <div className="flex items-center gap-2">
        <span>
          {type === "success" && "✅"}
          {type === "error" && "⚠️"}
          {type === "warning" && "⚡"}
        </span>
        <span className="text-sm">{message}</span>
      </div>

      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 200);
        }}
        className="font-bold"
      >
        ✕
      </button>
    </div>
  );
}