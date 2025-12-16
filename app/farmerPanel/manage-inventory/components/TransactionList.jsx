"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import axios from "axios"; // TODO: Uncomment when API is ready
import api from "@/app/lib/axios";
export default function TransactionList() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false); // Set true when API is ready
  const [error, setError] = useState(null);
const baseUrl = api.defaults.baseURL
  useEffect(() => {
    
  const fetchTransaction = async()=>{
    try {
      const res = await api.get(`${baseUrl}/inventory-transaction`);
      console.log("transactions",res.data.data);
      setTransactions(res.data.data);
    } catch (err) {
      setError("Failed to load transactions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
    fetchTransaction();
    
    // fetchTransactions();
  }, []);

  /*
  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/inventory-transaction");
      setTransactions(res.data);
    } catch (err) {
      setError("Failed to load transactions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  */

  if (loading) return <div className="text-center py-4">Loading transactions...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200">
              <th>Date</th>
              <th>Item</th>
              <th>Type</th>
              <th>Purpose</th>
              <th>Quantity</th>
              <th>Stock After</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  className="hover:bg-base-300 cursor-pointer transition-colors"
                  onClick={() => router.push(`/inventory-transaction/${tx.inventoryId}`)}
                >
                  <td>{new Date(tx.transactionDate).toLocaleString()}</td>
                  <td className="font-medium">{tx.inventory?.name || "Unknown Item"}</td>
                  <td>
                    <span
                      className={`badge ${
                        tx.stockType === "IN" ? "badge-success text-white" : "badge-error text-white"
                      }`}
                    >
                      {tx.stockType}
                    </span>
                  </td>
                  <td>{tx.purpose}</td>
                  <td>{tx.transactionQuantity}</td>
                  <td>{tx.stock}</td>
                  <td className="text-sm text-gray-500">{tx.notes || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
