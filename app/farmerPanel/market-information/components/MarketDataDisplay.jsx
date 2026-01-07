"use client";



export default function MarketDataDisplay({ marketData, selectedProduct, onScrape, isScraping }) {
  const isCentral = !selectedProduct;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {isCentral ? "Central Market Overview" : `Market Analysis: ${selectedProduct.name}`}
          </h2>
          <p className="text-sm text-gray-500">
            {isCentral 
              ? "General market trends and scraped prices." 
              : `Showing scraped data for category: ${selectedProduct.name}`}
          </p>
        </div>
        
        {!isCentral && (
          <button 
            className="btn btn-success text-white"
            onClick={onScrape}
            disabled={isScraping}
          >
            {isScraping ? "Scraping..." : "Scrap Market Data"}
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border shadow-sm">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-50">
              <th>Name</th>
              <th>Category</th>
              <th>Weight</th>
              <th>Price (৳)</th>
              <th>Source</th>
              <th>Scraped At</th>
            </tr>
          </thead>
          <tbody>
            {(marketData && marketData.length > 0) ? (
              marketData.map((row, i) => (
                <tr key={row.id || i} className="hover">
                  <td className="font-medium">{row.name}</td>
                  <td>{row.category}</td>
                  <td>{row.weight}</td>
                  <td className="font-bold text-green-700">{row.price} ৳</td>
                  <td>
                    <a 
                      href={row.source} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      {new URL(row.source).hostname}
                    </a>
                  </td>
                  <td className="text-gray-500 text-sm">
                    {new Date(row.scraped_at).toLocaleString("en-US",{
                       timeZone: "UTC",
                    })}
                  </td>
                </tr>
              ))
            ) : (
               <tr>
                <td colSpan="6" className="text-center py-8 text-gray-400">
                  {isCentral ? "No market data available." : "No scraped data found for this product."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isCentral && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">Price Forecast</h3>
            <p className="text-sm text-blue-600">
              Based on historical data for <span className="font-bold">{selectedProduct.name}</span>, prices may fluctuate. Use scraped data to make informed decisions.
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <h3 className="font-semibold text-orange-800 mb-2">Market Demand</h3>
             <p className="text-sm text-orange-600">
              Check the latest inventory levels and adjust your pricing strategy accordingly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
