
import axios from 'axios';

const OPENWEATHER_API_KEY = '86a262a5f35cb4ba95de2bf3a644a4ec';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

interface ForecastItem {
  date: string;
  day: string;
  temp: number;
  condition: string;
}

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
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

export const fetchForecast = async (city: string): Promise<ForecastItem[]> => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`);
    
    // Process the forecast data
    const forecastData = response.data.list;
    const processed: ForecastItem[] = [];
    
    // Short day names
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Get current day
    const today = new Date().getDay();
    
    // Create a 7-day sequence starting from tomorrow
    const daySequence: string[] = [];
    for (let i = 1; i <= 7; i++) {
      const dayIndex = (today + i) % 7;
      daySequence.push(days[dayIndex]);
    }
    
    // Group forecasts by day (taking noon forecast as representative)
    const dailyForecasts = new Map<string, any>();
    
    for (const item of forecastData) {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      // Skip today as we already have current weather
      if (date.getDate() === new Date().getDate()) continue;
      
      // For each day, prefer the forecast around noon
      const hour = date.getHours();
      if (!dailyForecasts.has(dateStr) || Math.abs(hour - 12) < Math.abs(dailyForecasts.get(dateStr).hour - 12)) {
        dailyForecasts.set(dateStr, {
          data: item,
          hour: hour,
          date: dateStr,
          day: days[date.getDay()]
        });
      }
    }
    
    // Convert the map to array and sort by date
    const sortedForecasts = Array.from(dailyForecasts.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 7);
    
    // Make sure we have exactly 7 days with the correct sequence
    for (let i = 0; i < 7; i++) {
      if (i < sortedForecasts.length) {
        // Use real forecast data
        processed.push({
          date: sortedForecasts[i].date,
          day: daySequence[i], // Use the sequence day instead of the actual day
          temp: Math.round(sortedForecasts[i].data.main.temp),
          condition: sortedForecasts[i].data.weather[0].main.toLowerCase()
        });
      } else {
        // Fill remaining days with placeholder data
        const lastDate = processed.length > 0 
          ? new Date(processed[processed.length - 1].date) 
          : new Date();
        
        lastDate.setDate(lastDate.getDate() + 1);
        
        processed.push({
          date: lastDate.toISOString().split('T')[0],
          day: daySequence[i],
          temp: Math.round(Math.random() * 5 + 20), // Placeholder temp (20-25°C)
          condition: "clear" // Default condition
        });
      }
    }
    
    return processed;
  } catch (error) {
    console.error('Forecast fetch error:', error);
    throw error;
  }
};
