import React from "react";

export default function Button({
  type = "button",
  children,
  onClick,
  className = "",
  variant = "primary",
  fullWidth = false,
  disabled = false,
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-indigo-600 hover:bg-indigo-700 text-white";
      case "secondary":
        return "bg-gray-200 hover:bg-gray-300 text-gray-900";
      case "outline":
        return "bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50";
      default:
        return "bg-indigo-600 hover:bg-indigo-700 text-white";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex justify-center py-2 px-4 border border-transparent
        text-sm font-medium rounded-md
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        ${getVariantClasses()}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
