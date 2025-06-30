export default {
  description: {
    format: '[city]',
    desc: 'Check weather of a city'
  },
  args: {
    min: 0,
    max: 1,
  },
  execute: async ({content}) => {
    if(!content.length) return `Please enter a location to check weather`;

    try {
      const geocodeRes = await fetch(`https://geocode.maps.co/search?q=${content}&api_key=685e45f632329287339657ctza3e53d`);
      const geocodeData = await geocodeRes.json();

      const {lat, lon, location} = {lat: geocodeData[0].lat, lon: geocodeData[0].lon, location: geocodeData[0].display_name};

      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto`);
      const weatherData = await weatherRes.json();

      return `Weather in ${location}:
    Temperature: ${weatherData.current.temperature_2m}°C
    Weather: ${handleCode(weatherData.current.weather_code)}`
    } catch(error) {
      return `Error occurred: ${error.message}`;
    }
  }
}

function handleCode(code) {
  switch(code) {
    case 0:
      return 'Clear sky';
    case 1:
      return 'Mainly clear';
    case 2:
      return 'Partly cloudy';
    case 3:
      return 'Overcast';
    case 45:
      return 'Fog';
    case 48:
      return 'Depositing Rime Fog';
    case 51:
      return 'Light Drizzle';
    case 53:
      return 'Moderate Drizzle';
    case 55:
      return 'Dense Drizzle';
    case 56:
      return 'Light Freezing Drizzle';
    case 57:
      return 'Dense Freezing Drizzle';
    case 61:
      return 'Slight Rain';
    case 63:
      return 'Moderate Rain';
    case 65:
      return 'Heavy Rain';
    case 66:
      return 'Light freezing rain';
    case 67:
      return 'Heavy freezing rain';
    case 71:
      return 'Slight snow fall';
    case 73:
      return 'Moderate snow fall';
    case 75:
      return 'Heavy snow fall';
    case 77:
      return 'Snow grains';
    case 80:
      return 'Slight rain showers';
    case 81:
      return 'Moderate rain showers';
    case 82:
      return 'Violent rain showers';
    case 85:
      return 'Slight snow showers';
    case 86:
      return 'Heavy snow showers';
    case 95:
      return 'Thunderstorm';
    case 96:
      return 'Light hailstorm';
    case 99:
      return 'Heavy hailstorm';
    default:
      return 'Unknown code';
  }
}