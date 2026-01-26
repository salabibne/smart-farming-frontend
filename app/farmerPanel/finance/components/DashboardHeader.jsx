"use client";

import { useState } from "react";

export default function DashboardHeader({ onDateChange }) {
  const [selectedRange, setSelectedRange] = useState("ALL_TIME");

  const getDates = (range) => {
    const today = new Date();
    let from = "";
    let to = "";

    if (range === "CURRENT_MONTH") {
      from = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      to = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    } else if (range === "LAST_MONTH") {
      from = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
      to = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
    }

    return { from, to };
  };

  const handleRangeChange = (range) => {
    setSelectedRange(range);
    if (range === "ALL_TIME") {
      onDateChange({});
    } else {
      onDateChange(getDates(range));
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Finance Dashboard</h2>
        <p className="text-sm text-gray-500">Overview of your financial performance</p>
      </div>
      <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
        <button
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
            selectedRange === "ALL_TIME" ? "bg-white shadow-sm text-primary" : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => handleRangeChange("ALL_TIME")}
        >
          All Time
        </button>
        <button
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
            selectedRange === "LAST_MONTH" ? "bg-white shadow-sm text-primary" : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => handleRangeChange("LAST_MONTH")}
        >
          Last Month
        </button>
        <button
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
            selectedRange === "CURRENT_MONTH" ? "bg-white shadow-sm text-primary" : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => handleRangeChange("CURRENT_MONTH")}
        >
          Current Month
        </button>
      </div>
    </div>
  );
}
