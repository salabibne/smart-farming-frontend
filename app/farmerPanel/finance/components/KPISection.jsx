"use client";

import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  BanknotesIcon, 
  CalculatorIcon, 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon 
} from "@heroicons/react/24/outline";

export default function KPISection({ data }) {
  const { totalIncome, totalExpense, netProfit, totalTransactions, highestExpenseCategory } = data;

  const kpis = [
    {
      title: "Total Income",
      value: `৳${totalIncome.toLocaleString()}`,
      icon: <ArrowTrendingUpIcon className="w-6 h-6 text-green-500" />,
      bg: "bg-green-50",
      trend: "Income",
    },
    {
      title: "Total Expense",
      value: `৳${totalExpense.toLocaleString()}`,
      icon: <ArrowTrendingDownIcon className="w-6 h-6 text-red-500" />,
      bg: "bg-red-50",
      trend: "Expense",
    },
    {
      title: "Net Balance",
      value: `৳${netProfit.toLocaleString()}`,
      icon: <BanknotesIcon className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-50",
      trendColor: netProfit >= 0 ? "text-green-600" : "text-red-600",
      isCustom: true,
    },
    {
      title: "Total Transactions",
      value: totalTransactions,
      icon: <CalculatorIcon className="w-6 h-6 text-purple-500" />,
      bg: "bg-purple-50",
      trend: "Activity",
    },
    {
      title: "Highest Expense",
      value: highestExpenseCategory?.amount ? `৳${highestExpenseCategory.amount.toLocaleString()}` : "N/A",
      subValue: highestExpenseCategory?.category || "No data",
      icon: <ChartBarIcon className="w-6 h-6 text-orange-500" />,
      bg: "bg-orange-50",
      trend: "Top Category",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {kpis.map((kpi, index) => (
        <div 
          key={index} 
          className={`p-5 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md bg-white`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${kpi.bg}`}>
              {kpi.icon}
            </div>
            {kpi.trend && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {kpi.trend}
              </span>
            )}
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">{kpi.title}</p>
            <h3 className={`text-2xl font-bold mt-1 ${kpi.trendColor || "text-gray-800"}`}>
              {kpi.value}
            </h3>
            {kpi.subValue && (
              <p className="text-xs text-gray-400 mt-1 font-semibold">{kpi.subValue}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
