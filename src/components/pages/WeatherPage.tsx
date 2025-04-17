
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, MapPin, Wind, Droplets } from "lucide-react";
import { useState, useEffect } from "react";

// Mock weather data for demo purposes
const MOCK_WEATHER = {
  location: "San Francisco",
  temperature: 24,
  condition: "sunny", // sunny, cloudy, rainy
  humidity: 65,
  windSpeed: 12,
  feelsLike: 26,
};

const WeatherPage = () => {
  const [weather, setWeather] = useState(MOCK_WEATHER);
  
  // In a real app, this would fetch from a weather API
  
  const getWeatherIcon = () => {
    switch (weather.condition) {
      case "sunny":
        return <Sun className="weather-icon text-yellow-500 animate-pulse-subtle" />;
      case "cloudy":
        return <Cloud className="weather-icon text-gray-500 animate-pulse-subtle" />;
      case "rainy":
        return <CloudRain className="weather-icon text-blue-500 animate-pulse-subtle" />;
      default:
        return <Sun className="weather-icon text-yellow-500 animate-pulse-subtle" />;
    }
  };
  
  const getWeatherCardClass = () => {
    switch (weather.condition) {
      case "sunny":
        return "sunny-gradient text-white";
      case "cloudy":
        return "cloudy-gradient text-white";
      case "rainy":
        return "rainy-gradient text-white";
      default:
        return "sunny-gradient text-white";
    }
  };
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>{weather.location}</span>
      </div>
      
      <Card className={`weather-card ${getWeatherCardClass()}`}>
        <CardContent className="p-6 flex flex-col items-center space-y-4">
          <div className="flex flex-col items-center">
            {getWeatherIcon()}
            <h1 className="text-4xl font-bold mt-2">{weather.temperature}°C</h1>
            <p className="text-lg capitalize">{weather.condition}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full mt-6">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              <div>
                <p className="text-sm opacity-80">Humidity</p>
                <p>{weather.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5" />
              <div>
                <p className="text-sm opacity-80">Wind</p>
                <p>{weather.windSpeed} km/h</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <h2 className="text-xl font-medium mb-4">Daily Forecast</h2>
        <div className="grid grid-cols-5 gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
            <div key={day} className="flex flex-col items-center p-3 bg-card rounded-lg">
              <span className="text-sm font-medium">{day}</span>
              <Sun className="h-6 w-6 my-2 text-yellow-500" />
              <span className="text-sm">24°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
