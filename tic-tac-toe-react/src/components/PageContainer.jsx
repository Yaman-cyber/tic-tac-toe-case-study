import React from "react";

export default function PageContainer({
  children,
  className = "",
  centered = true,
  background = "gray-50",
  padding = true,
}) {
  return (
    <div
      className={`
      min-h-screen 
      ${centered ? "flex items-center justify-center" : ""}
      bg-${background}
      ${padding ? "py-12 px-4 sm:px-6 lg:px-8" : ""}
      ${className}
    `}
    >
      {children}
    </div>
  );
}
