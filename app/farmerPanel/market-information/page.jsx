"use client";

import { useState, useEffect } from "react";
import { marketService } from "./service";
import ProductSelector from "./components/ProductSelector";
import MarketDataDisplay from "./components/MarketDataDisplay";
import AddProductModal from "./components/AddProductModal";

export default function MarketInformationPage() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await marketService.getAllProducts();
      const productsData = res.data.data || res.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketData = async () => {
    try {
      let res;
      if (selectedId) {
        const product = products.find(p => p.id === selectedId);
        if (product) {
          res = await marketService.getScrapedData(product.name);
        }
      } else {
        res = await marketService.getScrapedData();
      }
      
      if (res && res.data) {
        setMarketData(res.data.data || res.data || []);
      }
    } catch (error) {
      console.error("Error fetching market data:", error);
      setMarketData([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchMarketData();
  }, [selectedId, products]); // re-fetch when selection changes or products load (for name lookup)

  const handleProductAdded = () => {
    setIsModalOpen(false);
    fetchProducts(); 
  };

  const handleSelect = (id) => {
    setSelectedId(prev => (prev === id ? null : id));
  };

  const handleScrape = async () => {
    const product = products.find(p => p.id === selectedId);
    if (!product) return;

    setIsScraping(true);
    try {
      await marketService.triggerScraping({
        name: product.name,
        id: product.id
      });
      alert("Scraping initiated successfully! Data will be updated shortly.");
      
      // Notify after 5 seconds
      setTimeout(() => {
        setShowNotification(true);
        // Hide notification after 4 seconds
        setTimeout(() => setShowNotification(false), 4000);
      }, 9000);

      // Optional: re-fetch after a delay or optimistically? 
      // User didn't specify auto-refresh, but good UX would be to wait a bit and refresh.
      setTimeout(fetchMarketData, 2000); 
    } catch (error) {
      console.error("Error scraping:", error);
      alert("Failed to initiate scraping.");
    } finally {
      setIsScraping(false);
    }
  };

  const selectedProduct = products.find(p => p.id === selectedId);

  return (
    <div className="p-4 space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Market Information</h1>
          <p className="text-sm text-gray-500">Select a product category to view specific market data.</p>
        </div>
        
        <div className="flex gap-2">
           <button 
            className="btn btn-outline btn-sm"
            onClick={fetchProducts}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh List"}
          </button>
          
          <button 
            className="btn btn-primary btn-sm text-white"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Product Selection Area (Compact) */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Available Products</h2>
        {loading ? (
           <div className="flex justify-center items-center h-20">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : (
          <ProductSelector 
            products={products} 
            selectedId={selectedId} 
            onSelect={handleSelect} 
          />
        )}
      </div>

      {/* Market Data Display Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[400px]">
        <MarketDataDisplay 
          marketData={marketData}
          selectedProduct={selectedProduct}
          onScrape={handleScrape}
          isScraping={isScraping}
        />
      </div>

      {isModalOpen && (
        <AddProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleProductAdded} 
        />
      )}

      {/* Success Notification Toast */}
      {showNotification && (
        <div className="toast toast-end toast-bottom z-[100]">
          <div className="alert alert-success shadow-lg text-white">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Data Scraping has been successful!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
