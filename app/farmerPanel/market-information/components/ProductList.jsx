"use client";

export default function ProductList({ products, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No market information available. Click "Refresh Market Data" to fetch.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Description</th>
            {/* Add more columns if the backend returns more data like price, date, etc. */}
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index} className="hover">
              <th>{index + 1}</th>
              <td className="font-semibold">{product.name || product.title || "N/A"}</td>
              <td className="text-gray-600">{product.description || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
