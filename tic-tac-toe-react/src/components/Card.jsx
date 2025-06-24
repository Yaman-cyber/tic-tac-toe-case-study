import React from "react";

export default function Card({
  children,
  className = "",
  maxWidth = "md",
  centered = true,
  padding = true,
}) {
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-xl";
      default:
        return "max-w-md";
    }
  };

  return (
    <div
      className={`
      ${getMaxWidthClass()} 
      w-full 
      ${padding ? "p-6" : ""} 
      ${centered ? "mx-auto" : ""}
      ${className}
    `}
    >
      {children}
    </div>
  );
}
