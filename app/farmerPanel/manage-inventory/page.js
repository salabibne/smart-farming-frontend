"use client";

import { useState } from "react";
import InventoryList from "./components/InventoryList";
import CategoryList from "./components/CategoryList";
import TransactionList from "./components/TransactionList";

export default function InventoryManagement() {
  const [activeTab, setActiveTab] = useState("inventory");

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
      </div>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-lifted tabs-lg mb-8">
        <a
          role="tab"
          className={`tab ${activeTab === "inventory" ? "tab-active [--tab-bg:theme(colors.green.50)] [--tab-border-color:theme(colors.green.200)] font-bold text-green-700" : ""}`}
          onClick={() => setActiveTab("inventory")}
        >
          Inventory Items
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === "categories" ? "tab-active [--tab-bg:theme(colors.green.50)] [--tab-border-color:theme(colors.green.200)] font-bold text-green-700" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === "transactions" ? "tab-active [--tab-bg:theme(colors.green.50)] [--tab-border-color:theme(colors.green.200)] font-bold text-green-700" : ""}`}
          onClick={() => setActiveTab("transactions")}
        >
          Transactions
        </a>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[500px]">
        {activeTab === "inventory" && <InventoryList />}
        {activeTab === "categories" && <CategoryList />}
        {activeTab === "transactions" && <TransactionList />}
      </div>
    </div>
  );
}
