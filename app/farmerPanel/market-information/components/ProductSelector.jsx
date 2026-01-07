"use client";

export default function ProductSelector({ products, selectedId, onSelect }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        <p>No products available. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {products.map((product) => {
        const isSelected = selectedId === product.id;
        return (
          <button
            key={product.id}
            onClick={() => onSelect(product.id)}
            className={`
              px-3 py-2 rounded-md border text-center transition-all duration-200
              text-sm font-medium
              ${
                isSelected
                  ? "border-green-600 bg-green-100 text-green-800 shadow-sm"
                  : "border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-gray-50"
              }
            `}
          >
            {product.name}
          </button>
        );
      })}
    </div>
  );
}
