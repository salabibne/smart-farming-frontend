export default function TransactionList({ transactions, loading }) {
  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading transactions...</div>;
  }

  if (!transactions || transactions.length === 0) {
    return <div className="text-center py-10 text-gray-500">No transactions record found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr className="bg-base-200">
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Inventory Item</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="hover">
              <td className="text-sm">
                {new Date(t.transactionDate).toLocaleDateString()}
                <br />
                <span className="text-xs text-gray-400">
                  {new Date(t.transactionDate).toLocaleTimeString()}
                </span>
              </td>
              <td>
                <span className={`badge ${t.transactionType === 'INCOME' ? 'badge-success text-white' : 'badge-error text-white'}`}>
                  {t.transactionType}
                </span>
              </td>
              <td>
                <span className="badge badge-ghost badge-sm">{t.transactionCategory}</span>
              </td>
              <td className={`font-bold ${t.transactionType === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                {t.transactionType === 'INCOME' ? '+' : '-'}৳{t.amount.toLocaleString()}
              </td>
              <td className="text-sm">{t.paymentMethod}</td>
              <td className="text-sm">
                {t.inventory ? (
                  <span className="text-blue-600">{t.inventory.name}</span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="text-sm text-gray-500 max-w-xs truncate" title={t.notes}>
                {t.notes || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
