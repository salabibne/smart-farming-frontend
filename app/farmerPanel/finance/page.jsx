"use client";

import { useState, useEffect } from "react";
import { financeService } from "./service";
import FinanceStats from "./components/FinanceStats";
import TransactionList from "./components/TransactionList";
import AddTransactionModal from "./components/AddTransactionModal";
import DashboardHeader from "./components/DashboardHeader";
import KPISection from "./components/KPISection";
import FinanceCharts from "./components/FinanceCharts";

export default function FinancePage() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
  });
  const [kpiData, setKpiData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
    totalTransactions: 0,
    highestExpenseCategory: { category: "N/A", amount: 0 },
    period: "ALL_TIME"
  });
  const [loading, setLoading] = useState(true);
  const [kpiLoading, setKpiLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [transactionsRes, statsRes] = await Promise.all([
        financeService.getAllTransactions(),
        financeService.getNetBalance(),
      ]);
      setTransactions(transactionsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching finance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKPIData = async (range = {}) => {
    setKpiLoading(true);
    try {
      const res = await financeService.getDashboardKPI(range);
      setKpiData(res.data);
    } catch (error) {
      console.error("Error fetching KPI data:", error);
    } finally {
      setKpiLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchKPIData();
  }, []);

  const handleDateChange = (range) => {
    setDateRange(range);
    fetchKPIData(range);
  };

  const handleTransactionAdded = () => {
    fetchData();
    fetchKPIData(dateRange);
    setIsModalOpen(false);
  };

  const filterTransactions = async (category) => {
    setActiveCategory(category);
    setLoading(true);
    try {
      if (category === "ALL") {
        const res = await financeService.getAllTransactions();
        setTransactions(res.data);
      } else {
        const res = await financeService.getTransactionsByCategory(category);
        setTransactions(res.data);
      }
    } catch (error) {
      console.error("Error filtering transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Financial Overview</h1>
        <button 
          className="btn btn-primary text-white shadow-md hover:shadow-lg transition-all"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="text-xl mr-1">+</span> Record Transaction
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <DashboardHeader onDateChange={handleDateChange} />
        
        {kpiLoading ? (
          <div className="flex justify-center p-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <>
            <KPISection data={kpiData} />
            <FinanceCharts kpiData={kpiData} />
          </>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
            <p className="text-sm text-gray-500 mt-1">Manage and track your recent activities</p>
          </div>
          <div className="join bg-gray-50 p-1 rounded-xl">
            <button 
              className={`join-item btn btn-sm border-none ${activeCategory === 'ALL' ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-gray-500'}`}
              onClick={() => filterTransactions('ALL')}
            >
              All
            </button>
            <button 
              className={`join-item btn btn-sm border-none ${activeCategory === 'SALE' ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-gray-500'}`}
              onClick={() => filterTransactions('SALE')}
            >
              Sales
            </button>
            <button 
              className={`join-item btn btn-sm border-none ${activeCategory === 'PURCHASE' ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-gray-500'}`}
              onClick={() => filterTransactions('PURCHASE')}
            >
              Purchases
            </button>
            <button 
              className={`join-item btn btn-sm border-none ${activeCategory === 'SALARY' ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-gray-500'}`}
              onClick={() => filterTransactions('SALARY')}
            >
              Salary
            </button>
          </div>
        </div>
        
        <TransactionList transactions={transactions} loading={loading} />
      </div>

      {isModalOpen && (
        <AddTransactionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleTransactionAdded} 
        />
      )}
    </div>
  );
}
