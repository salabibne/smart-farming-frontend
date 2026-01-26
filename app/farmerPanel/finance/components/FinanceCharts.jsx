"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from "recharts";

const COLORS = [
  "#22c55e", // SALE (Green)
  "#ef4444", // PURCHASE (Red)
  "#3b82f6", // SALARY (Blue)
  "#a855f7", // RENT (Purple)
  "#f59e0b", // UTILITIES (Amber)
  "#06b6d4", // MAINTENANCE (Cyan)
  "#64748b", // OTHER (Slate)
  "#ec4899", // LOGISTICS (Pink)
  "#f97316", // RETURN (Orange)
  "#8b5cf6", // DAMAGE (Violet)
  "#10b981", // ADJUSTMENT (Emerald)
];

const CATEGORY_COLORS = {
  SALE: "#22c55e",
  PURCHASE: "#ef4444",
  SALARY: "#3b82f6",
  RENT: "#a855f7",
  UTILITIES: "#f59e0b",
  MAINTENANCE: "#06b6d4",
  OTHER: "#64748b",
  LOGISTICS: "#ec4899",
  RETURN: "#f97316",
  DAMAGE: "#8b5cf6",
  ADJUSTMENT: "#10b981",
};

export default function FinanceCharts({ kpiData }) {
  const { totalIncome, totalExpense } = kpiData;

  const barData = [
    { name: "Comparison", Income: totalIncome, Expense: totalExpense },
  ];

  // For the pie chart, we would ideally need a breakdown of expenses by category.
  // Since we only have the 'highestExpenseCategory' in KPI data, 
  // we'll mock some data for visualization if real breakdown isn't provided in kpi response.
  // However, I'll structure it so it can handle real category data if we fetch it separately.
  
  // Assuming the KPI response might be expanded or we use dummy categories for now
  // to show the UI structure.
  const pieData = [
    { name: "Salary", value: 2500 },
    { name: "Rent", value: 1200 },
    { name: "Utilities", value: 500 },
    { name: "Maintenance", value: 400 },
    { name: "Other", value: 300 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Income vs Expense Bar Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold mb-6 text-gray-800">Income vs Expense</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" hide />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: 'transparent' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Bar dataKey="Income" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={60} />
              <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Distribution Pie Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold mb-6 text-gray-800">Expense Distribution</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
