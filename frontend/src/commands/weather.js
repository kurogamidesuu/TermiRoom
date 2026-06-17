const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export default {
  description: {
    format: "[city]",
    desc: "Check weather of a city",
  },
  args: {
    min: 0,
    max: 1,
    description: {
      "-detailed": "Get a detailed description of weather in a city",
    },
  },
  execute: async ({ args, content }) => {
    if (!content.trim()) {
      return `Please enter a location or allow location access with "weather here"`;
    }

    try {
      const geocodeRes = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(content)}&apiKey=${GEOAPIFY_API_KEY}`,
      );

      if (!geocodeRes.ok) {
        return `Geocoding Error: Check API Key or try again later.`;
      }

      const geocodeData = await geocodeRes.json();

      if (!geocodeData.features || geocodeData.features.length === 0) {
        return `Location not found: '${content}'. Please try a different city name.`;
      }

      const {
        lat,
        lon,
        formatted: location,
      } = geocodeData.features[0].properties;

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto`,
      );

      if (!weatherRes.ok) {
        return `Weather Data Error: Unable to fetch forecast.`;
      }

      const weatherData = await weatherRes.json();

      return formatWeatherOutput(weatherData, location, args.detailed);
    } catch (error) {
      console.error("Weather command error:", error);
      return `Error fetching weather data. Please try again later.`;
    }
  },

  subcommands: {
    here: {
      description: {
        format: "",
        desc: "Shows the weather of your current location.",
      },
      args: {
        min: 0,
        max: 1,
      },
      execute: async ({ args }) => {
        try {
          const { coords } = await getLocation();
          const lat = coords.latitude;
          const lon = coords.longitude;

          const [geocodeRes, weatherRes] = await Promise.all([
            fetch(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}`,
            ),
            fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto`,
            ),
          ]);

          if (!geocodeRes.ok || !weatherRes.ok) {
            return `Error: Could not retrieve location or weather data.`;
          }

          const geocodeData = await geocodeRes.json();
          const weatherData = await weatherRes.json();

          let place = "your location";
          if (geocodeData.features && geocodeData.features.length > 0) {
            place =
              geocodeData.features[0].properties.city ||
              geocodeData.features[0].properties.formatted ||
              "your location";
          }

          return formatWeatherOutput(weatherData, place, args.detailed);
        } catch (error) {
          if (error.code === 1) {
            return `Location access denied. Please allow location permissions in your browser.`;
          }
          return `Error occurred: ${error.message}`;
        }
      },
    },
  },
};

const getLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const formatWeatherOutput = (weatherData, location, isDetailed) => {
  const current = weatherData.current;
  const weatherString = handleCode(current.weather_code);

  if (isDetailed) {
    return `Weather in ${location}:
    Time: ${current.time.replace("T", " ")} 
    Timezone: ${weatherData.timezone} ${weatherData.timezone_abbreviation}
    Temperature: ${current.temperature_2m}°C
    Wind Speed: ${current.wind_speed_10m} km/h
    Condition: ${weatherString}`;
  }

  return `Weather in ${location}:
    Temperature: ${current.temperature_2m}°C
    Condition: ${weatherString}`;
};

function handleCode(code) {
  const codes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    56: "Light Freezing Drizzle",
    57: "Dense Freezing Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Light hailstorm",
    99: "Heavy hailstorm",
  };
  return codes[code] || "Unknown condition";
}
