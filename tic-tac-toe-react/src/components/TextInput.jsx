import React from "react";

export default function TextInput({
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  autoComplete,
  className = "",
  label,
  showLabel = false,
  rounded = "none",
  error = "",
}) {
  const getRoundedClass = () => {
    switch (rounded) {
      case "top":
        return "rounded-t-md";
      case "bottom":
        return "rounded-b-md";
      case "both":
        return "rounded-md";
      default:
        return "";
    }
  };

  return (
    <div>
      {showLabel && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className={`
          appearance-none relative block w-full px-3 py-2 border
          ${error ? "border-red-300" : "border-gray-300"}
          placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm
          ${getRoundedClass()}
          ${className}
        `}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
