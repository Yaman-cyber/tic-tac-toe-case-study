import React from "react";

export default function StatCard({ title, value, color }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${color}`}>
      <h3 className="text-lg font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
