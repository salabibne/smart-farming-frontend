

import Image from "next/image";
import bell from "../../public/bell.png";
import cloudy from "../../public/weatherForcastImages/cloudy_smart_weather.png";
import location from "../../public/location.png";
import api from "@/app/lib/axios";
import clear from "../../public/weatherForcastImages/clear.jpg";
import drizzle from "../../public/weatherForcastImages/drizzle.png";
import haze from "../../public/weatherForcastImages/haze.png";
import rain from "../../public/weatherForcastImages/rain.jpg";
import snow from "../../public/weatherForcastImages/snow.jpg";
import thunderstrom from "../../public/weatherForcastImages/thunderstrom.jpg";

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

// Time Formatter
const timeFormatter = async (unixTime) => {
  const date = new Date();
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Date Formatter
const dateFormatter = async (unixTime) => {
  const date = new Date(unixTime * 1000);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Wind Speed Formatter
const windSpeedFormatter = async (speed, deg) => {
  const speedKmh = Math.round(speed * 3.6);
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(deg / 45) % 8;
  return { speedKmh, directionText: directions[index] };
};

// Place Formatter
const placeFormatter = async (name, country) => {
  if (name === "Sāmāir") name = "Dhaka";
  if (country === "BD") country = "Bangladesh";
  return `${name}, ${country}`;
};

// Weather Image Formatter
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

// 🛠 PROPER NOTIFICATION FORMATTER
const notifactionFormatter = (mainCondition) => {
  const conditionMapForNotification = {
    Clear: {
      message:
        "Weather is clear — great time for all farming activities. You can work your fields freely!",
      action: "good",
      color: "green",
    },
    Clouds: {
      message:
        "Cloudy weather today. You can continue farming, but keep an eye on the sky — light rain might come later.",
      action: "caution",
      color: "yellow",
    },
    Drizzle: {
      message:
        "Light drizzle expected. Good for soil moisture, but avoid spraying pesticides or fertilizers right now.",
      action: "caution",
      color: "yellow",
    },
    Rain: {
      message:
        "Rainy conditions — field work may be difficult. Avoid irrigation and protect your harvest if needed.",
      action: "warning",
      color: "orange",
    },
    Thunderstorm: {
      message:
        "⚠ Thunderstorm alert! Do NOT work in open fields. Stay indoors and protect equipment & animals.",
      action: "danger",
      color: "red",
    },
    Snow: {
      message:
        "Snowy weather ahead. Protect your crops and livestock — consider adding covers or extra shelter.",
      action: "warning",
      color: "orange",
    },
    Haze: {
      message:
        "Hazy conditions. You can work, but visibility may be low. Be careful while using machinery.",
      action: "caution",
      color: "yellow",
    },
    Mist: {
      message:
        "Misty weather — low visibility. Delay pesticide spraying and work carefully in open fields.",
      action: "caution",
      color: "yellow",
    },
    Smoke: {
      message:
        "Smoke in the air — health risk. Avoid outdoor work if possible and protect eyes & nose.",
      action: "danger",
      color: "red",
    },
    Fog: {
      message:
        "Foggy conditions — visibility is very low. Reduce field work and operate machines safely.",
      action: "warning",
      color: "orange",
    },
  };

  return conditionMapForNotification[mainCondition] || null;
};

const WeatherPage = async () => {
  // Get weather data from the API
  let weatherData = await getWeatherDataDaily();
  let timeFormat = await timeFormatter(weatherData?.dt);
  let dateFormat = await dateFormatter(weatherData?.dt);
  let windDataFormat = await windSpeedFormatter(weatherData?.wind?.speed, weatherData?.wind?.deg);
  let placeFormat = await placeFormatter(weatherData?.name, weatherData?.sys?.country);
  let weatherFormat = weatherData?.weather[0]?.main;
  let weatherImage = getWeatherImageFormatter(weatherFormat);
  let notificationMessage = notifactionFormatter(weatherFormat);

  // 🟢 TAILWIND COLOR MAP (SAFE CLASS)
  const colorMap = {
    green: "text-green-700",
    yellow: "text-yellow-700",
    orange: "text-orange-700",
    red: "text-red-700",
  };

  return (
    <div>
      {/* Notification Bar */}
      <div className="border-2 border-[#6BBF59] px-4 rounded-2xl bg-[#6BBF59]/50 min-h-12 flex justify-between items-center">
        {/* Text Content */}
        <div className="flex gap-4 p-2 max-w-3/4 ml-7 items-center">
          <Image src={bell} alt="bell" width={15} height={15} />

          <p
            className={`font-semibold text-sm py-2 ${
              colorMap[notificationMessage?.color] || "text-black"
            }`}
          >
            {notificationMessage?.action} - {notificationMessage?.message}
          </p>
        </div>

        {/* Time */}
        <div className="flex flex-col py-2 text-right text-sm font-semibold mr-20">
          <p>{timeFormat}</p>
          <p>{dateFormat}</p>
        </div>
      </div>

      {/* Weather Info */}
      <div className="flex mt-6 p-6 items-center justify-center gap-20 rounded-2xl bg-[#FFFFFF]/50">
        <Image
          src={weatherImage}
          alt={weatherFormat}
          width={250}
          height={250}
        />

        <div>
          <div className="flex gap-2">
            <Image src={location} alt="location" width={35} height={35} />
            <p className="text-2xl">{placeFormat}</p>
          </div>

          <div className="flex mt-4 gap-8">
            <p className="text-5xl">{weatherData?.main?.temp}&deg; C</p>
            <div className="flex flex-col">
              <p>Feels Like : {weatherData?.main?.feels_like}&deg; C</p>
              <p>Humidity: {weatherData?.main?.humidity}%</p>
              <p>
                Wind Speed: {windDataFormat?.speedKmh}{" "}
                {windDataFormat?.directionText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next 5 Days */}
      <div className="flex flex-col items-center justify-center mt-8">
        <p className="text-4xl font-bold">
          Possible next 5 days weather information
        </p>
        <div className="flex flex-row gap-8 mt-6">
          <p>testing</p>
          <p>testing</p>
          <p>testing</p>
          <p>testing</p>
          <p>testing</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;

