import Image from "next/image";
import api from "@/app/lib/axios";
import locationIcon from "../../../public/location.png";
import bell from "../../../public/bell.png";
import cloudy from "../../../public/weatherForcastImages/cloudy_smart_weather.png";
import clear from "../../../public/weatherForcastImages/clear.jpg";
import drizzle from "../../../public/weatherForcastImages/drizzle.png";
import haze from "../../../public/weatherForcastImages/haze.png";
import rain from "../../../public/weatherForcastImages/rain.jpg";
import snow from "../../../public/weatherForcastImages/snow.jpg";
import thunderstrom from "../../../public/weatherForcastImages/thunderstrom.jpg";

async function getWeatherDataDaily(lat = "23.8041", lon = "90.4152") {
  let baseURL = api.defaults.baseURL;
  const res = await fetch(`${baseURL}/weather/current?lat=${lat}&lon=${lon}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch current weather");
  return res.json();
}

async function getWeatherDataAdvance(lat = "23.8041", lon = "90.4152") {
  let baseURL = api.defaults.baseURL;
  const res = await fetch(`${baseURL}/weather/forecast?lat=${lat}&lon=${lon}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch forecast");
  return res.json();
}

const getNotification = (mainCondition) => {
  const conditionMapForNotification = {
    Clear: {
      message: "Weather is clear — great time for all farming activities. You can work your fields freely!",
      action: "OPTIMAL",
      color: "green",
      tip: "Harvesting & Sowing"
    },
    Clouds: {
      message: "Cloudy weather today. You can continue farming, but keep an eye on the sky — light rain might come later.",
      action: "CAUTION",
      color: "yellow",
      tip: "Monitor Soil"
    },
    Drizzle: {
      message: "Light drizzle expected. Good for soil moisture, but avoid spraying pesticides or fertilizers right now.",
      action: "CAUTION",
      color: "blue",
      tip: "Rainwater Collection"
    },
    Rain: {
      message: "Rainy conditions — field work may be difficult. Avoid irrigation and protect your harvest if needed.",
      action: "PROTECT",
      color: "orange",
      tip: "Check Drainage"
    },
    Thunderstorm: {
      message: "⚠ Thunderstorm alert! Do NOT work in open fields. Stay indoors and protect equipment & animals.",
      action: "DANGER",
      color: "red",
      tip: "Safety First"
    },
    Snow: {
      message: "Snowy weather ahead. Protect your crops and livestock — consider adding covers or extra shelter.",
      action: "WARNING",
      color: "orange",
      tip: "Cold Protection"
    },
    Haze: {
      message: "Hazy conditions. You can work, but visibility may be low. Be careful while using machinery.",
      action: "CAUTION",
      color: "yellow",
      tip: "Low Visibility"
    },
    Mist: {
      message: "Misty weather — low visibility. Delay pesticide spraying and work carefully in open fields.",
      action: "CAUTION",
      color: "yellow",
      tip: "Low Visibility"
    },
    Smoke: {
      message: "Smoke in the air — health risk. Avoid outdoor work if possible and protect eyes & nose.",
      action: "DANGER",
      color: "red",
      tip: "Health Risk"
    },
    Fog: {
      message: "Foggy conditions — visibility is very low. Reduce field work and operate machines safely.",
      action: "WARNING",
      color: "orange",
      tip: "Low Visibility"
    },
  };
  return conditionMapForNotification[mainCondition] || { message: "Weather conditions are normal.", action: "STABLE", color: "green", tip: "Maintainance" };
};

const getWeatherImage = (mainCondition) => {
  const conditionMap = {
    Clear: clear,
    Clouds: cloudy,
    Drizzle: drizzle,
    Rain: rain,
    Thunderstorm: thunderstrom,
    Snow: snow,
    Haze: haze,
  };
  return conditionMap[mainCondition] || cloudy;
};

export default async function WeatherInformationPage() {
  const weatherData = await getWeatherDataDaily();
  const weatherDataAdvance = await getWeatherDataAdvance();

  const condition = weatherData?.weather[0]?.main;
  const temp = Math.round(weatherData?.main?.temp);
  const advice = getNotification(condition);

  // Process forecast
  const fiveDaysForecast = [];
  const todayDate = new Date().toISOString().split("T")[0];
  if (weatherDataAdvance?.list) {
    weatherDataAdvance.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (date !== todayDate && !fiveDaysForecast.some((day) => day.date === date)) {
        fiveDaysForecast.push({
          date,
          temp: item.main.temp,
          condition: item.weather[0].main,
        });
      }
    });
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header with Farmer Focus */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Weather Insight</h1>
          <p className="text-gray-700 font-bold mt-1 flex items-center gap-2 italic">
             Agricultural focus for {weatherData?.name || "Dhaka"}
          </p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 text-right">
          <p className="text-lg font-bold text-green-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <p className="text-xs text-gray-700 font-bold uppercase tracking-wider">Last updated: {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Condition Card (Hero) */}
        <div className="lg:col-span-2 bg-[#F7FDF4] rounded-[3rem] p-10 border border-green-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-green-50/50 mb-6 group transition-all hover:border-green-200">
                <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${advice.color === 'green' ? 'bg-green-500' : advice.color === 'red' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{advice.action} CONDITION</span>
             </div>
             
             <div className="flex items-start mb-2 group">
                <h2 className="text-8xl font-black leading-none text-green-800 transition-all group-hover:tracking-tighter">{temp}</h2>
                <span className="text-3xl font-black text-green-500 mt-4">&deg;C</span>
             </div>
             <p className="text-2xl font-bold text-gray-800 uppercase tracking-widest">{condition}</p>
             
             <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 flex items-start gap-3 max-w-sm">
                <div className="mt-1">
                  <Image src={bell} alt="bell" width={18} height={18} className="opacity-80" />
                </div>
                <div>
                   <p className="text-xs font-bold text-green-800 uppercase tracking-widest">Farmer's Advice</p>
                   <p className="text-sm font-semibold text-gray-700 mt-1 leading-relaxed">{advice.message}</p>
                </div>
             </div>
          </div>

          <div className="relative z-10">
             <Image 
               src={getWeatherImage(condition)} 
               alt={condition} 
               width={280} 
               height={280} 
               className="drop-shadow-2xl animate-float"
             />
          </div>
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
        </div>

        {/* Side Stats Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
           <div className="space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                <h3 className="font-bold text-gray-800 tracking-tight uppercase text-xs">Astro Information</h3>
                <span className="text-[9px] font-bold text-gray-700 tracking-widest">PHASE: WAXING</span>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                       </svg>
                    </div>
                    <div>
                       <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Sunrise</p>
                       <p className="text-lg font-bold text-gray-800">{new Date(weatherData?.sys?.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                 </div>
                 <div className="space-y-4 text-right">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center ml-auto">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                       </svg>
                    </div>
                    <div>
                       <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Sunset</p>
                       <p className="text-lg font-bold text-gray-800">{new Date(weatherData?.sys?.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                 </div>
              </div>
              
              <div className="p-5 rounded-3xl bg-green-50 border border-green-100 group transition-all hover:bg-green-100/50">
                 <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-bold text-green-800 uppercase tracking-widest">Agricultural Suggestion</p>
                    <span className="text-[9px] font-bold text-green-500">TODAY</span>
                 </div>
                 <p className="text-sm font-semibold text-gray-800 italic">"Best time for {advice.tip.toLowerCase()} activities."</p>
              </div>
           </div>
           
           <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl border border-dashed border-gray-200 group transition-all hover:border-green-200">
              <div className="text-center flex-1">
                 <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Visibility</p>
                 <p className="text-xl font-bold text-gray-800">{(weatherData?.visibility / 1000).toFixed(1)} <span className="text-xs font-normal">km</span></p>
              </div>
              <div className="w-px h-10 bg-gray-100"></div>
              <div className="text-center flex-1">
                 <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Pressure</p>
                 <p className="text-xl font-bold text-gray-800">{weatherData?.main?.pressure} <span className="text-xs font-normal">hPa</span></p>
              </div>
           </div>
        </div>
      </div>

      {/* Metric Cards - Detailed Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
            <div className="w-14 h-14 rounded-2xl bg-[#E5F9DB] flex items-center justify-center group-hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
               </svg>
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-1">Wind Speed</p>
               <p className="text-2xl font-black text-gray-900">{Math.round(weatherData?.wind?.speed * 3.6)} <span className="text-sm font-bold text-gray-500">km/h</span></p>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
               </svg>
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-1">Humidity</p>
               <p className="text-2xl font-black text-gray-900">{weatherData?.main?.humidity}%</p>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
               </svg>
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-1">Feels Like</p>
               <p className="text-2xl font-black text-gray-900">{Math.round(weatherData?.main?.feels_like)}&deg;</p>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all text-center justify-center">
            <div className="text-center">
               <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-1">Daily High/Low</p>
               <p className="text-2xl font-black text-gray-900">{Math.round(weatherData?.main?.temp_max)}&deg; / {Math.round(weatherData?.main?.temp_min)}&deg;</p>
            </div>
         </div>
      </div>

      {/* Forecast Section - Horizontal Scroll or Grid */}
      <div className="pt-10">
        <div className="flex items-end justify-between mb-8 px-2">
           <div>
             <h3 className="text-2xl font-black text-gray-900 tracking-tight">Upcoming Forecast</h3>
             <p className="text-xs font-bold text-gray-600 uppercase tracking-[0.3em] mt-1">Plan your week effectively</p>
           </div>
           <div className="flex gap-2">
              <div className="w-8 h-1 rounded-full bg-green-300"></div>
              <div className="w-4 h-1 rounded-full bg-green-100"></div>
           </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pb-4">
           {fiveDaysForecast.slice(0, 5).map((item, index) => {
             const dayAdvice = getNotification(item.condition);
             return (
               <div key={index} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col items-center text-center group hover:bg-[#F7FDF4] transition-all hover:border-green-100 duration-500">
                  <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-6">{new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <div className="mb-6 transform transition-transform group-hover:scale-105">
                    <Image src={getWeatherImage(item.condition)} alt="icon" width={56} height={56} />
                  </div>
                  <div className="space-y-1">
                     <p className="text-2xl font-black text-gray-900 tracking-tighter">{Math.round(item.temp)}&deg;C</p>
                     <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest">{item.condition}</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-100 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-[8px] font-black text-green-800 uppercase tracking-widest block mb-1">SUGGESTION</span>
                     <p className="text-[9px] font-bold text-gray-500 leading-tight">{dayAdvice.tip}</p>
                  </div>
               </div>
             )
           })}
        </div>
      </div>
    </div>
  );
}
