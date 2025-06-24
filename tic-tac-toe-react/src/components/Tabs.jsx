import React from "react";

export default function Tabs({ children, activeIndex = 0, onTabChange }) {
  const tabs = React.Children.toArray(children);
  const activeTab = tabs[activeIndex];

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-center border-b border-gray-300 bg-white">
        <div className="flex">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => onTabChange(index)}
              className={`py-4 px-4 text-sm font-medium border-b-2 transition-all duration-300 ${
                activeIndex === index
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-indigo-500"
              }`}
            >
              {tab.props.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">{activeTab?.props?.children}</div>
    </div>
  );
}
