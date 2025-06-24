import React from "react";

export default function Heading({
  children,
  className = "",
  size = "3xl",
  centered = true,
  weight = "extrabold",
  color = "gray-900",
}) {
  const getSizeClass = () => {
    switch (size) {
      case "2xl":
        return "text-2xl";
      case "3xl":
        return "text-3xl";
      case "4xl":
        return "text-4xl";
      case "5xl":
        return "text-5xl";
      default:
        return "text-3xl";
    }
  };

  const getWeightClass = () => {
    switch (weight) {
      case "normal":
        return "font-normal";
      case "medium":
        return "font-medium";
      case "semibold":
        return "font-semibold";
      case "bold":
        return "font-bold";
      case "extrabold":
        return "font-extrabold";
      default:
        return "font-extrabold";
    }
  };

  return (
    <h2
      className={`
      ${getSizeClass()}
      ${getWeightClass()}
      ${centered ? "text-center" : ""}
      text-${color}
      ${className}
    `}
    >
      {children}
    </h2>
  );
}
