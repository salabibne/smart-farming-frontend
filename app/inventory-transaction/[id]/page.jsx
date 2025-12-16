"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "@/app/lib/axios";

export default function TransactionDetailPage() {
  const { id } = useParams();

  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = api.defaults.baseURL;

  useEffect(() => {
    if (!id) return;

    const fetchTransactionDetails = async () => {
      try {
        const res = await api.get(
          `${baseUrl}/inventory-transaction/${id}`
        );

        setTransactions(res.data.data); // ✅ array
      } catch (err) {
        console.error("Error fetching transaction:", err);
        setError("Failed to load transaction details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [id, baseUrl]);



  const downloadPDF = () => {
    if (!transactions.length) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Transaction History – ${item?.name}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Unit: ${item?.unit} | Cost: ৳${item?.cost_per_unit}`, 14, 26);

    const tableColumn = [
      "#",
      "Date",
      "Type",
      "Purpose",
      "Quantity",
      "Stock After",
      "Notes",
    ];

    const tableRows = [];

    transactions.forEach((tx, index) => {
      const transactionData = [
        index + 1,
        new Date(tx.transactionDate).toLocaleString(),
        tx.stockType,
        tx.purpose,
        tx.transactionQuantity,
        tx.stock,
        tx.notes || "-",
      ];
      tableRows.push(transactionData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 32,
      theme: "grid",
      headStyles: { fillColor: [22, 163, 74] }, // green-600
    });

    doc.save(`transactions_${item?.name}.pdf`);
  };

  if (loading)
    return <div className="text-center py-10">Loading transactions...</div>;

  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  if (!transactions.length)
    return <div className="text-center py-10">No transactions found.</div>;

  const item = transactions[0]?.inventory;

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="btn btn-ghost mb-6"
      >
        ← Back
      </button>

      {/* HEADER INFO */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">
            Transaction History – {item?.name}
          </h2>
          <p className="text-sm text-gray-500">
            Unit: {item?.unit} | Cost: ৳{item?.cost_per_unit}
          </p>
        </div>
        <button onClick={downloadPDF} className="btn btn-primary">
          Download PDF
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200">
              <th>#</th>
              <th>Date</th>
              <th>Type</th>
              <th>Purpose</th>
              <th>Quantity</th>
              <th>Stock After</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={tx.id}>
                <td>{index + 1}</td>
                <td>
                  {new Date(tx.transactionDate).toLocaleString()}
                </td>
                <td>
                  <span
                    className={`badge ${
                      tx.stockType === "IN"
                        ? "badge-success text-white"
                        : "badge-error text-white"
                    }`}
                  >
                    {tx.stockType}
                  </span>
                </td>
                <td>{tx.purpose}</td>
                <td className="font-semibold">
                  {tx.transactionQuantity}
                </td>
                <td
                  className={`font-bold ${
                    tx.stock <= item?.minimum_stock_level_alert
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {tx.stock}
                </td>
                <td>{tx.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
