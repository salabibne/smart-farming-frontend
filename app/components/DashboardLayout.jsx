"use client";

import Link from "next/link";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-green-600">Farmer Panel</h1>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link
                href="/farmer"
                className="block px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/farmerPanel/yield-management"
                className="block px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                Yield Management
              </Link>
            </li>
            <li>
              <Link
                href="/farmerPanel/crop-health"
                className="block px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                Crops Health
              </Link>
            </li>
            <li>
              <Link
                href="/admin/weather-information"
                className="block px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                Weather Information
              </Link>
            </li>
            <li>
              <Link
                href="/farmerPanel/market-information"
                className="block px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                Market Information
              </Link>
            </li>
            <li>
              <Link
                href="/admin/price-prediction"
                className="block px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                Price Prediction
              </Link>
            </li>
            <li>
              <Link
                href="/farmerPanel/finance"
                className="block px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                Manage Finance
              </Link>
            </li>
            <li>
              <Link
                href="/farmerPanel/manage-inventory"
                className="block px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                Manage Inventory
              </Link>
            </li>
             <li>
              <Link
                href="/"
                className="block px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                Back to Home
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
