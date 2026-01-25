"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/farmer" },
    { name: "Yield Management", href: "/farmerPanel/yield-management" },
    { name: "Crops Health", href: "/farmerPanel/crop-health" },
    { name: "Weather Information", href: "/admin/weather-information" },
    { name: "Market Information", href: "/farmerPanel/market-information" },
    { name: "Price Prediction", href: "/admin/price-prediction" },
    { name: "Manage Finance", href: "/farmerPanel/finance" },
    { name: "Manage Inventory", href: "/farmerPanel/manage-inventory" },
    { name: "Back to Home", href: "/" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-green-600">Farmer Panel</h1>
        </div>
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-6 py-3 transition-colors ${
                      isActive
                        ? "bg-green-100 text-green-700 font-semibold border-r-4 border-green-600"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
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
