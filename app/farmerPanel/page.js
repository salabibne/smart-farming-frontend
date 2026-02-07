"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/app/lib/axios";
import locationIcon from "@/public/location.png";
import cloudy from "@/public/weatherForcastImages/cloudy_smart_weather.png";
import clear from "@/public/weatherForcastImages/clear.jpg";
import drizzle from "@/public/weatherForcastImages/drizzle.png";
import haze from "@/public/weatherForcastImages/haze.png";
import rain from "@/public/weatherForcastImages/rain.jpg";
import snow from "@/public/weatherForcastImages/snow.jpg";
import thunderstrom from "@/public/weatherForcastImages/thunderstrom.jpg";

const getWeatherImageFormatter = (mainCondition) => {
  const conditionMap = {
    Clear: clear,
    Clouds: cloudy,
    Drizzle: drizzle,
    Rain: rain,
    Thunderstorm: thunderstrom,
    Snow: snow,
    Haze: haze,
    Mist: haze,
    Smoke: haze,
    Fog: haze,
  };
  return conditionMap[mainCondition] || cloudy;
};

export default function AdminDashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [financeData, setFinanceData] = useState({ netBalance: 0 });
  const [inventoryStats, setInventoryStats] = useState({ totalItems: 0, lowStockCount: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Weather
        const weatherRes = await api.get("/weather/current?lat=23.8041&lon=90.4152");
        setWeatherData(weatherRes.data);

        // Fetch Finance Profit
        const financeRes = await api.get("/finance/net-balance");
        setFinanceData(financeRes.data);

        // Fetch Inventory
        const inventoryRes = await api.get("/inventory-management");
        const items = inventoryRes.data.data || [];
        const lowStock = items.filter(item => (item.transactions?.[0]?.stock ?? 0) <= item.minimum_stock_level_alert).length;
        setInventoryStats({
          totalItems: items.length,
          lowStockCount: lowStock
        });

        // Mock Recent Activity (as requested: no DB, dynamic time)
        const now = new Date();
        const activities = [
          {
            id: 1,
            title: "Crops health check completed",
            time: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
            type: "health",
          },
          {
            id: 2,
            title: "New transaction recorded",
            time: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
            type: "finance",
          },
          {
            id: 3,
            title: "Inventory stock updated",
            time: new Date(now.getTime() - 10 * 60 * 60 * 1000), // 10 hours ago
            type: "inventory",
          }
        ];
        setRecentActivities(activities);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const weatherCondition = weatherData?.weather[0]?.main || "Clouds";
  const weatherImage = getWeatherImageFormatter(weatherCondition);

  const formatRelativeTime = (date) => {
    const diff = Math.floor((new Date() - date) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        <div className="text-sm text-gray-500 font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Weather Brief Widget */}
        <div className="bg-[#F7FDF4] p-6 rounded-2xl shadow-sm border border-green-100 flex flex-col justify-between group h-full relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-1.5 opacity-80">
                 <Image src={locationIcon} alt="loc" width={10} height={10} className="grayscale brightness-0 opacity-70" />
                 <span className="text-[9px] font-bold uppercase tracking-widest text-green-900">{weatherData?.name || "Dhaka"}</span>
               </div>
               <div className="p-1 px-2 bg-white rounded-full border border-green-100 shadow-sm text-[7px] font-black text-green-800 uppercase tracking-tighter">
                 {weatherCondition}
               </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-black text-green-800">{weatherData?.main?.temp ? Math.round(weatherData.main.temp) : "--"}&deg;C</p>
              <div className="relative transform scale-90">
                <Image src={weatherImage} alt="weather" width={40} height={40} className="drop-shadow-lg" />
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/90 backdrop-blur-sm rounded-xl border border-green-50 shadow-xs">
               <p className="text-[8px] font-black text-green-700 uppercase tracking-widest">Advice</p>
               <p className="text-[10px] font-bold text-gray-700 leading-tight line-clamp-2">"Ideal conditions for field maintenance today."</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full blur-2xl -mr-16 -mt-16"></div>
        </div>

        {/* Finance Stat - Profit */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widerCondensed">Net Profit</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">৳{financeData?.netBalance?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg text-blue-500">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-600 font-bold">
            <span className="mr-1">↑ 8%</span>
            <span className="text-gray-400 font-normal">than last month</span>
          </div>
        </div>

        {/* Inventory Stat - Items */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widerCondensed">Inventory Items</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{inventoryStats.totalItems}</p>
            </div>
            <div className="bg-green-50 p-2 rounded-lg text-green-500">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
               </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-600 font-bold">
            <span className="mr-1">Active</span>
            <span className="text-gray-400 font-normal">items tracked</span>
          </div>
        </div>

        {/* Dynamic Alerts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widerCondensed">Alerts</h3>
              <p className={`text-3xl font-bold mt-2 ${inventoryStats.lowStockCount > 0 ? 'text-red-500' : 'text-gray-800'}`}>
                {inventoryStats.lowStockCount}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${inventoryStats.lowStockCount > 0 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-gray-50 text-gray-400'}`}>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
               </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold">
            {inventoryStats.lowStockCount > 0 ? (
              <>
                <span className="text-red-600 mr-1">Critical</span>
                <span className="text-gray-400 font-normal">Low stock items</span>
              </>
            ) : (
              <span className="text-green-600">All systems clear</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 italic">
          <div className="flex justify-between items-center mb-6 ">
            <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
            <button className="text-sm text-green-600 font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'health' ? 'bg-green-100 text-green-600' : 
                    activity.type === 'finance' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'health' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {activity.type === 'finance' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    )}
                    {activity.type === 'inventory' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{activity.title}</p>
                    <p className="text-xs text-gray-500">{formatRelativeTime(activity.time)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-400 py-4">No recent activity to show.</p>
            )}
            <p className="text-center text-sm text-gray-400 py-4">No more recent activity to show.</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Tasks</h3>
           <div className="space-y-3">
              <Link href="/farmerPanel/manage-inventory" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all group">
                <span className="text-sm font-medium text-gray-600 group-hover:text-green-700">Check Inventory</span>
                <span className="text-gray-400">→</span>
              </Link>
              <Link href="/farmerPanel/finance" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                <span className="text-sm font-medium text-gray-600 group-hover:text-blue-700">Review Finance</span>
                <span className="text-gray-400">→</span>
              </Link>
              <Link href="/farmerPanel/crop-health" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all group">
                <span className="text-sm font-medium text-gray-600 group-hover:text-purple-700">Health Analysis</span>
                <span className="text-gray-400">→</span>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
