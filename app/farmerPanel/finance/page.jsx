"use client";

import { useState, useEffect } from "react";
import { financeService } from "./service";
import FinanceStats from "./components/FinanceStats";
import TransactionList from "./components/TransactionList";
import AddTransactionModal from "./components/AddTransactionModal";

export default function FinancePage() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [transactionsRes, statsRes] = await Promise.all([
        financeService.getAllTransactions(),
        financeService.getNetBalance(),
      ]);
      setTransactions(transactionsRes.data); // Assuming backend returns array or data wrapper
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching finance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTransactionAdded = () => {
    fetchData();
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
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Finance Management</h1>
        <button 
          className="btn btn-primary text-white"
          onClick={() => setIsModalOpen(true)}
        >
          + Record Transaction
        </button>
      </div>

      <FinanceStats stats={stats} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Transactions History</h2>
          <div className="join">
            <button 
              className={`join-item btn btn-sm ${activeCategory === 'ALL' ? 'btn-active btn-neutral' : ''}`}
              onClick={() => filterTransactions('ALL')}
            >
              All
            </button>
            <button 
              className={`join-item btn btn-sm ${activeCategory === 'SALE' ? 'btn-active btn-neutral' : ''}`}
              onClick={() => filterTransactions('SALE')}
            >
              Sales
            </button>
            <button 
              className={`join-item btn btn-sm ${activeCategory === 'PURCHASE' ? 'btn-active btn-neutral' : ''}`}
              onClick={() => filterTransactions('PURCHASE')}
            >
              Purchases
            </button>
             <button 
              className={`join-item btn btn-sm ${activeCategory === 'SALARY' ? 'btn-active btn-neutral' : ''}`}
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
