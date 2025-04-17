
import axios from 'axios';

const OPENWEATHER_API_KEY = localStorage.getItem('OPENWEATHER_API_KEY') || '';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  if (!OPENWEATHER_API_KEY) {
    throw new Error('OpenWeatherMap API key is missing');
  }

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`);
    
    return {
      location: response.data.name,
      temperature: Math.round(response.data.main.temp),
      condition: response.data.weather[0].main.toLowerCase(),
      humidity: response.data.main.humidity,
      windSpeed: Math.round(response.data.wind.speed),
      feelsLike: Math.round(response.data.main.feels_like)
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw error;
  }
};
