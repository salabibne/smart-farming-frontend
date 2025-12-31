export default function FinanceStats({ stats }) {
  const { totalIncome, totalExpense, netBalance } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="stats shadow bg-white border border-green-100">
        <div className="stat">
          <div className="stat-figure text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          </div>
          <div className="stat-title text-gray-500">Total Income</div>
          <div className="stat-value text-green-600">৳{totalIncome?.toLocaleString() ?? 0}</div>
          <div className="stat-desc">All time income</div>
        </div>
      </div>

      <div className="stats shadow bg-white border border-red-100">
        <div className="stat">
          <div className="stat-figure text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
          <div className="stat-title text-gray-500">Total Expense</div>
          <div className="stat-value text-red-600">৳{totalExpense?.toLocaleString() ?? 0}</div>
          <div className="stat-desc">All time expenses</div>
        </div>
      </div>

      <div className="stats shadow bg-white border border-blue-100">
        <div className="stat">
          <div className="stat-figure text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div className="stat-title text-gray-500">Net Balance</div>
          <div className={`stat-value ${netBalance >= 0 ? "text-blue-600" : "text-red-500"}`}>
            ৳{netBalance?.toLocaleString() ?? 0}
          </div>
          <div className="stat-desc">Income - Expenses</div>
        </div>
      </div>
    </div>
  );
}
