import { useState, useEffect, useRef } from "react";
import { fetchWeatherByCity, fetchForecast } from "@/services/WeatherService";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, MapPin, Wind, Droplets, Search, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useCity } from "@/contexts/CityContext";

const WeatherPage = () => {
  const { city, setCity } = useCity();
  const [weather, setWeather] = useState({
    location: city,
    temperature: 24,
    condition: "sunny",
    humidity: 65,
    windSpeed: 12,
    feelsLike: 26
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forecast, setForecast] = useState<Array<{day: string, temp: number, condition: string}>>([]);
  const [assistantQuery, setAssistantQuery] = useState("");
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: `Hi! I'm your weather assistant for ${city}. Ask me anything about weather, climate, or how to prepare for different conditions.` }
  ]);
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchWeatherInfo(city);
  }, [city]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const fetchWeatherInfo = async (searchedCity: string) => {
    try {
      setIsLoading(true);
      const weatherData = await fetchWeatherByCity(searchedCity);
      setWeather(weatherData);
      setCity(weatherData.location);
      const forecastData = await fetchForecast(searchedCity);
      setForecast(forecastData.map(item => ({
        day: item.day,
        temp: item.temp,
        condition: item.condition
      })));
      
      setConversation([
        { role: "assistant", content: `Hi! I'm your weather assistant for ${weatherData.location}. Ask me anything about weather, climate, or how to prepare for different conditions.` }
      ]);
    } catch (error) {
      toast.error("Could not fetch weather. Please try another city.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      toast.error("Please enter a location");
      return;
    }
    await fetchWeatherInfo(searchQuery);
    setSearchQuery("");
    setIsSearchOpen(false);
    toast.success(`Weather updated for ${searchQuery}`);
  };

  const handleAssistantQuery = () => {
    if (assistantQuery.trim() === "") return;
    
    const userQuery = assistantQuery.trim();
    setConversation(prev => [...prev, { role: "user", content: userQuery }]);
    setAssistantQuery("");
    setIsAssistantThinking(true);
    
    setTimeout(() => {
      const response = getWeatherAssistantResponse(userQuery, weather, forecast);
      setConversation(prev => [...prev, { role: "assistant", content: response }]);
      setIsAssistantThinking(false);
    }, 1000);
  };

  const getWeatherAssistantResponse = (query: string, weatherData: any, forecastData: any[]) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("city") || 
        lowerQuery.includes("location") || 
        lowerQuery.includes("where") || 
        lowerQuery.includes("place")) {
      return `I'm currently providing weather information for ${weatherData.location}. If you'd like information for a different city, you can use the search function at the top of the screen.`;
    }
    
    if ((lowerQuery.includes("change") || lowerQuery.includes("switch") || lowerQuery.includes("different")) && 
        (lowerQuery.includes("city") || lowerQuery.includes("location") || lowerQuery.includes("place"))) {
      return `To view weather for a different city, please use the search icon at the top of the screen.`;
    }
    
    const cityRegex = /(?:in|for|at)\s+([a-zA-Z\s]+)(?:\?|$|\.)/i;
    const cityMatch = lowerQuery.match(cityRegex);
    if (cityMatch && cityMatch[1] && cityMatch[1].length > 2) {
      const mentionedCity = cityMatch[1].trim();
      if (mentionedCity.toLowerCase() !== weatherData.location.toLowerCase()) {
        return `I'm currently showing weather for ${weatherData.location}. If you'd like to see weather information for ${mentionedCity}, please use the search icon at the top of the screen.`;
      }
    }

    const weatherKeywords = [
      "temperature", "temp", "hot", "cold", "warm", "cool", 
      "rain", "sunny", "cloudy", "humidity", "wind", "weather"
    ];

    const matchedKeywords = weatherKeywords.filter(keyword => lowerQuery.includes(keyword));
    
    if (matchedKeywords.length > 0) {
      switch (true) {
        case lowerQuery.includes("temperature") || lowerQuery.includes("temp") || lowerQuery.includes("hot") || lowerQuery.includes("cold"):
          return `The current temperature in ${weatherData.location} is ${weatherData.temperature}°C. It feels like ${weatherData.feelsLike}°C.`;
        
        case lowerQuery.includes("rain"):
          if (weatherData.condition === "rain" || weatherData.condition === "drizzle") {
            return `Yes, it's currently raining in ${weatherData.location}. Bring an umbrella!`;
          } else {
            const rainDays = forecastData.filter(day => day.condition === "rain" || day.condition === "drizzle");
            return rainDays.length > 0 
              ? `No rain right now in ${weatherData.location}, but rain is expected in the next few days.`
              : `No rain expected in the forecast for ${weatherData.location}.`;
          }
        
        case lowerQuery.includes("humidity"):
          return `The humidity in ${weatherData.location} is currently ${weatherData.humidity}%. ${
            weatherData.humidity > 80 ? "It might feel quite sticky outside." : 
            weatherData.humidity > 50 ? "The humidity is moderate." : 
            "The air is quite dry."
          }`;
        
        case lowerQuery.includes("wind"):
          return `Wind speed in ${weatherData.location} is ${weatherData.windSpeed} km/h. ${
            weatherData.windSpeed > 20 ? "It's quite windy today!" : 
            weatherData.windSpeed > 10 ? "There's a moderate breeze." : 
            "The wind is calm."
          }`;
      }
    }

    if (lowerQuery.includes("forecast") || lowerQuery.includes("next few days") || lowerQuery.includes("week")) {
      let forecastSummary = `7-day forecast for ${weatherData.location}: `;
      forecastData.forEach(day => {
        forecastSummary += `${day.day}: ${day.temp}°C, ${day.condition}. `;
      });
      return forecastSummary;
    }

    if (lowerQuery.includes("wear") || lowerQuery.includes("clothes") || lowerQuery.includes("outfit")) {
      if (weatherData.temperature > 30) {
        return `For today's hot weather in ${weatherData.location} (${weatherData.temperature}°C), wear light, breathable clothing like cotton t-shirts and shorts. Don't forget sunglasses, a hat, and sunscreen.`;
      } else if (weatherData.temperature > 20) {
        return `For the warm weather in ${weatherData.location} (${weatherData.temperature}°C), light clothing like t-shirts and jeans would be comfortable. Maybe bring a light jacket for the evening.`;
      } else if (weatherData.temperature > 10) {
        return `For the mild weather in ${weatherData.location} (${weatherData.temperature}°C), you'll need a jacket or light sweater. Jeans and closed shoes would be appropriate.`;
      } else {
        return `It's quite cold in ${weatherData.location} (${weatherData.temperature}°C). Dress warmly with layers, a coat, and don't forget gloves and a hat.`;
      }
    }

    if (lowerQuery.includes("how") && lowerQuery.includes("weather")) {
      return `The current weather in ${weatherData.location} is ${weatherData.condition} with a temperature of ${weatherData.temperature}°C. It feels like ${weatherData.feelsLike}°C with ${weatherData.humidity}% humidity and wind speed of ${weatherData.windSpeed} km/h.`;
    }

    if (lowerQuery.includes("hello") || lowerQuery.includes("hi") || lowerQuery.includes("hey")) {
      return `Hello! I'm your weather assistant for ${weatherData.location}. The current weather is ${weatherData.condition} at ${weatherData.temperature}°C. How can I help you today?`;
    }

    return `I'm your weather assistant for ${weatherData.location}. Current conditions are ${weatherData.temperature}°C and ${weatherData.condition}. Ask me anything about the weather!`;
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "clouds":
        return <Cloud className="h-full w-full text-gray-500" />;
      case "rain":
      case "drizzle":
        return <CloudRain className="h-full w-full text-blue-500" />;
      case "clear":
      default:
        return <Sun className="h-full w-full text-yellow-500" />;
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
          <span className="capitalize">{city}</span>
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
      
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Weather</TabsTrigger>
          <TabsTrigger value="assistant">Weather Assistant</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4 mt-2">
          <Card className={`weather-card ${getWeatherCardClass()}`}>
            <CardContent className="p-6 flex flex-col items-center space-y-4">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16">
                  {getWeatherIcon(weather.condition)}
                </div>
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
            <h2 className="text-xl font-medium mb-4">7-Day Forecast</h2>
            <div className="grid grid-cols-7 gap-2">
              {forecast.map((day, index) => (
                <div key={index} className="flex flex-col items-center p-3 bg-card rounded-lg">
                  <span className="text-sm font-medium">{day.day}</span>
                  <div className="h-6 w-6 my-2">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <span className="text-sm">{day.temp}°</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="assistant" className="space-y-4 mt-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium">Weather Assistant</h2>
              </div>
              
              <div className="h-72 overflow-y-auto mb-4 p-2 border rounded-lg">
                {conversation.map((message, index) => (
                  <div 
                    key={index}
                    className={`mb-3 ${message.role === 'assistant' ? 'pr-8' : 'pl-8'}`}
                  >
                    <div 
                      className={`p-3 rounded-lg ${
                        message.role === 'assistant' 
                          ? 'bg-secondary' 
                          : 'bg-primary text-primary-foreground ml-auto'
                      }`}
                      style={{ 
                        maxWidth: '85%',
                        marginLeft: message.role === 'user' ? 'auto' : '0'
                      }}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isAssistantThinking && (
                  <div className="mb-3 pr-8">
                    <div className="p-3 rounded-lg bg-secondary">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="flex gap-2">
                <Textarea 
                  placeholder="Ask me about weather in any city, forecasts, what to wear, etc."
                  value={assistantQuery}
                  onChange={(e) => setAssistantQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAssistantQuery();
                    }
                  }}
                  className="min-h-10"
                />
                <Button 
                  onClick={handleAssistantQuery} 
                  disabled={isAssistantThinking || assistantQuery.trim() === ""}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeatherPage;
