

import Image from "next/image";
import bell from "@/public/bell.png";
import cloudy from "@/public/weatherForcastImages/cloudy_smart_weather.png";
import location from "@/public/location.png";
import api from "@/app/lib/axios";
import clear from "@/public/weatherForcastImages/clear.jpg";
import drizzle from "@/public/weatherForcastImages/drizzle.png";
import haze from "@/public/weatherForcastImages/haze.png";
import rain from "@/public/weatherForcastImages/rain.jpg";
import snow from "@/public/weatherForcastImages/snow.jpg";
import thunderstrom from "@/public/weatherForcastImages/thunderstrom.jpg";

// Get Data Daily
async function getWeatherDataDaily(lat = "23.8041", lon = "90.4152") {
  let baseURL = api.defaults.baseURL;
  const res = await fetch(`${baseURL}/weather/current?lat=${lat}&lon=${lon}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

// Get monthly data
async function getWeatherDataAdvance(lat = "23.8041", lon = "90.4152") {
  let baseURL = api.defaults.baseURL;
  const res = await fetch(`${baseURL}/weather/forecast?lat=${lat}&lon=${lon}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

// FORMATTERS (Synchronous)
const formatTime = (unixTime) => {
  const date = new Date(unixTime * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDate = (unixTime) => {
  const date = new Date(unixTime * 1000);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatWind = (speed, deg) => {
  const speedKmh = Math.round(speed * 3.6);
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(deg / 45) % 8;
  return { speedKmh, directionText: directions[index] };
};

const formatPlace = (name, country) => {
  if (name === "Sāmāir") name = "Dhaka";
  const countryName = country === "BD" ? "Bangladesh" : country;
  return `${name}, ${countryName}`;
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
    Mist: haze,
    Smoke: haze,
    Fog: haze,
  };
  return conditionMap[mainCondition] || cloudy;
};

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

const formatDayName = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

const WeatherPage = async () => {
  const weatherData = await getWeatherDataDaily();
  const weatherDataAdvance = await getWeatherDataAdvance();

  const timeStr = formatTime(weatherData?.dt);
  const dateStr = formatDate(weatherData?.dt);
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
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-20 min-h-screen text-slate-800">
      {/* Agricultural Insight Banner */}
      <div className={`p-8 rounded-[3.5rem] border border-green-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden bg-[#F7FDF4]`}>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border border-green-100 mb-4">
             <span className={`w-2 h-2 rounded-full animate-pulse ${advice.color === 'green' ? 'bg-green-500' : advice.color === 'red' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
             <span className="text-[9px] font-black text-gray-800 uppercase tracking-widest">{advice.action}</span>
          </div>
          <h1 className="text-4xl font-black text-green-900 tracking-tight mb-2">Farmer's Today</h1>
          <p className="text-lg font-semibold text-green-900/80 italic leading-relaxed">"{advice.message}"</p>
        </div>
        <div className="relative z-10 text-right">
           <p className="text-sm font-bold text-green-900/60 uppercase tracking-widest">{dateStr}</p>
           <p className="text-2xl font-light text-green-900/80">{timeStr}</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Main Hero Visuals */}
        <div className="lg:col-span-8 flex flex-col md:flex-row items-center justify-between px-10 py-16 bg-white rounded-[4rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-green-900/5 duration-700">
          <div className="flex flex-col items-center md:items-start group">
            <div className="flex items-start">
               <span className="text-8xl font-black leading-none text-green-800 tracking-tighter transition-all group-hover:tracking-widest">{temp}</span>
               <span className="text-4xl font-black text-green-400 mt-4">&deg;C</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 uppercase tracking-[0.2em]">{condition}</p>
          </div>
          
          <div className="relative transform transition-transform hover:scale-105 duration-700">
             <Image src={getWeatherImage(condition)} alt={condition} width={280} height={280} className="drop-shadow-2xl animate-float" />
          </div>
        </div>

        {/* Action Grid */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4 h-full">
           <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center text-center group hover:bg-green-50 transition-colors">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Humidity</p>
              <p className="text-2xl font-black text-gray-900">{weatherData?.main?.humidity}%</p>
           </div>
           <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center text-center group hover:bg-blue-50 transition-colors">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Wind</p>
              <p className="text-2xl font-black text-gray-900">{Math.round(weatherData?.wind?.speed * 3.6)} <span className="text-xs">km/h</span></p>
           </div>
           <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center text-center group hover:bg-orange-50 transition-colors">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Sunrise</p>
              <p className="text-xl font-black text-gray-800">{formatTime(weatherData?.sys?.sunrise)}</p>
           </div>
           <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center text-center group hover:bg-indigo-50 transition-colors">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Sunset</p>
              <p className="text-xl font-black text-gray-800">{formatTime(weatherData?.sys?.sunset)}</p>
           </div>
        </div>
      </div>

      {/* Forecast Section */}
      <div className="pt-20 border-t border-gray-100">
        <div className="flex justify-between items-end mb-12">
           <div>
             <h2 className="text-4xl font-black text-gray-900 tracking-tight">Agricultural Forecast</h2>
             <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.4em] mt-2">Next 5 Production Days</p>
           </div>
           <div className="hidden md:flex gap-3">
              <span className="w-10 h-1 rounded-full bg-green-300"></span>
              <span className="w-4 h-1 rounded-full bg-green-100"></span>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
           {fiveDaysForecast.slice(0, 5).map((item, index) => {
             const dayAdvice = getNotification(item.condition);
             return (
               <div key={index} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm text-center group hover:shadow-xl hover:shadow-green-900/5 hover:-translate-y-2 transition-all duration-500">
                  <p className="text-xs font-black text-gray-700 uppercase tracking-widest mb-8">{formatDayName(item.date)}</p>
                  <div className="mb-8 transform transition-transform group-hover:scale-105">
                    <Image src={getWeatherImage(item.condition)} alt="icon" width={64} height={64} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">{Math.round(item.temp)}&deg;</p>
                    <p className="text-[10px] font-bold text-green-800 uppercase tracking-widest">{item.condition}</p>
                  </div>
                  <div className="mt-8 pt-8 border-t border-gray-100 w-full">
                     <p className="text-[10px] font-bold text-gray-800 leading-tight italic">"{dayAdvice.tip}"</p>
                  </div>
               </div>
             )
           })}
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;

