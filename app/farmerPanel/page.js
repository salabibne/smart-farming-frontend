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

async function getWeatherDataDaily(lat = "23.8041", lon = "90.4152") {
  let baseURL = api.defaults.baseURL;
  try {
    const res = await fetch(`${baseURL}/weather/current?lat=${lat}&lon=${lon}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export default async function AdminDashboard() {
  const weatherData = await getWeatherDataDaily();
  const weatherCondition = weatherData?.weather[0]?.main || "Clouds";
  const weatherImage = getWeatherImageFormatter(weatherCondition);

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        <div className="text-sm text-gray-500 font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Weather Brief Widget (Agricultural Focus) */}
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

        {/* Stat Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widerCondensed">Total Users</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">1,234</p>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg text-blue-500">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-600 font-bold">
            <span className="mr-1">↑ 12%</span>
            <span className="text-gray-400 font-normal">from last month</span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widerCondensed">Active Farms</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">56</p>
            </div>
            <div className="bg-green-50 p-2 rounded-lg text-green-500">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 012.5 2.5V14a2 2 0 01-2 2h-1.5a2 2 0 00-2 2v1.105" />
               </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-600 font-bold">
            <span className="mr-1">↑ 4</span>
            <span className="text-gray-400 font-normal">new this week</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widerCondensed">Alerts</h3>
              <p className="text-3xl font-bold text-red-500 mt-2">3</p>
            </div>
            <div className="bg-red-50 p-2 rounded-lg text-red-500 animate-pulse">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
               </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-red-600 font-bold">
            <span className="mr-1">Critical</span>
            <span className="text-gray-400 font-normal">Requires attention</span>
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
             <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                   </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Crops health check completed</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
             </div>
             <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 opacity-60">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                     <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                   </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">New transaction recorded</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
             </div>
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
