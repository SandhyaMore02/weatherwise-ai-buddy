
import { useState, useEffect } from "react";
import { fetchWeatherByCity } from "@/services/WeatherService";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, MapPin, Wind, Droplets, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const WeatherPage = () => {
  const [weather, setWeather] = useState({
    location: "Delhi",
    temperature: 24,
    condition: "sunny",
    humidity: 65,
    windSpeed: 12,
    feelsLike: 26
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load Delhi weather by default for Indian cities focus
    fetchInitialWeather();
  }, []);

  const fetchInitialWeather = async () => {
    try {
      setIsLoading(true);
      const weatherData = await fetchWeatherByCity("Delhi");
      setWeather(weatherData);
    } catch (error) {
      toast.error("Could not fetch weather for Delhi. Please try a different city.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      toast.error("Please enter a location");
      return;
    }

    setIsLoading(true);
    try {
      const weatherData = await fetchWeatherByCity(searchQuery);
      setWeather(weatherData);
      setSearchQuery("");
      setIsSearchOpen(false);
      toast.success(`Weather updated for ${weatherData.location}`);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message === "city not found") {
        toast.error(`City "${searchQuery}" not found. Please check the spelling and try again.`);
      } else {
        toast.error("Could not fetch weather data. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case "clouds":
        return <Cloud className="weather-icon text-gray-500 animate-pulse-subtle" />;
      case "rain":
      case "drizzle":
        return <CloudRain className="weather-icon text-blue-500 animate-pulse-subtle" />;
      case "clear":
        return <Sun className="weather-icon text-yellow-500 animate-pulse-subtle" />;
      default:
        return <Sun className="weather-icon text-yellow-500 animate-pulse-subtle" />;
    }
  };

  const getWeatherCardClass = () => {
    switch (weather.condition) {
      case "clear":
        return "sunny-gradient text-white";
      case "clouds":
        return "cloudy-gradient text-white";
      case "rain":
      case "drizzle":  
        return "rainy-gradient text-white";
      default:
        return "sunny-gradient text-white";
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{weather.location}</span>
          {isLoading && <span className="text-xs">(Loading...)</span>}
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
      
      {isSearchOpen && (
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Enter city name (e.g., Mumbai, Delhi, Bangalore)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      )}
      
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
