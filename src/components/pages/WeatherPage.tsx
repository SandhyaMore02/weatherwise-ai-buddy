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
  const [forecast, setForecast] = useState<Array<{day: string, temp: number, condition: string}>>([]);

  // For weather assistant
  const [assistantQuery, setAssistantQuery] = useState("");
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hi! I'm your weather assistant. Ask me anything about weather, climate, or how to prepare for different conditions." }
  ]);
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Delhi weather by default for Indian cities focus
    fetchInitialWeather();
  }, []);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const fetchInitialWeather = async () => {
    try {
      setIsLoading(true);
      const weatherData = await fetchWeatherByCity("Delhi");
      setWeather(weatherData);
      const forecastData = await fetchForecast("Delhi");
      
      // Convert API forecast to UI format
      const formattedForecast = forecastData.map(item => ({
        day: item.day,
        temp: item.temp,
        condition: item.condition
      }));
      
      setForecast(formattedForecast);
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
      
      // Get forecast data
      const forecastData = await fetchForecast(searchQuery);
      
      // Convert API forecast to UI format
      const formattedForecast = forecastData.map(item => ({
        day: item.day,
        temp: item.temp,
        condition: item.condition
      }));
      
      setForecast(formattedForecast);
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

  const handleAssistantQuery = () => {
    if (assistantQuery.trim() === "") return;

    // Add user message to conversation
    setConversation(prev => [...prev, { role: "user", content: assistantQuery }]);
    
    // Simulate AI thinking
    setIsAssistantThinking(true);
    
    // Get weather-related response
    setTimeout(() => {
      const response = getWeatherAssistantResponse(assistantQuery, weather, forecast);
      setConversation(prev => [...prev, { role: "assistant", content: response }]);
      setIsAssistantThinking(false);
      setAssistantQuery("");
    }, 1000);
  };

  const getWeatherAssistantResponse = (query: string, weatherData: any, forecastData: any[]) => {
    const lowerQuery = query.toLowerCase();
    
    // Very basic pattern matching for demo purposes
    // In a real app, you'd use a more sophisticated NLP approach or an actual AI API
    if (lowerQuery.includes("rain") || lowerQuery.includes("umbrella")) {
      if (weatherData.condition === "rain" || weatherData.condition === "drizzle") {
        return "Yes, it's currently raining in " + weatherData.location + ". Don't forget your umbrella!";
      } else {
        const rainDays = forecastData.filter(day => day.condition === "rain" || day.condition === "drizzle");
        if (rainDays.length > 0) {
          return "No rain right now in " + weatherData.location + ", but rain is expected on " + rainDays.map(d => d.day).join(", ") + ".";
        } else {
          return "No rain expected today or in the next 6 days in " + weatherData.location + ". The current condition is " + weatherData.condition + ".";
        }
      }
    } else if (lowerQuery.includes("hot") || lowerQuery.includes("temperature") || lowerQuery.includes("warm")) {
      if (weatherData.temperature > 30) {
        return "Yes, it's quite hot in " + weatherData.location + " at " + weatherData.temperature + "°C. Stay hydrated and try to stay in shade.";
      } else if (weatherData.temperature > 20) {
        return "The temperature in " + weatherData.location + " is pleasant at " + weatherData.temperature + "°C.";
      } else {
        return "It's not very warm in " + weatherData.location + ". The current temperature is " + weatherData.temperature + "°C.";
      }
    } else if (lowerQuery.includes("humid") || lowerQuery.includes("humidity")) {
      if (weatherData.humidity > 80) {
        return "Yes, it's very humid in " + weatherData.location + " with humidity at " + weatherData.humidity + "%. It might feel sticky outside.";
      } else if (weatherData.humidity > 50) {
        return "The humidity in " + weatherData.location + " is moderate at " + weatherData.humidity + "%.";
      } else {
        return "The air is quite dry in " + weatherData.location + " with humidity at only " + weatherData.humidity + "%.";
      }
    } else if (lowerQuery.includes("wind") || lowerQuery.includes("windy")) {
      if (weatherData.windSpeed > 20) {
        return "Yes, it's very windy in " + weatherData.location + " with wind speeds of " + weatherData.windSpeed + " km/h. Be careful outside!";
      } else if (weatherData.windSpeed > 10) {
        return "There's a moderate breeze in " + weatherData.location + " with wind speeds of " + weatherData.windSpeed + " km/h.";
      } else {
        return "It's not very windy in " + weatherData.location + ". Wind speeds are only " + weatherData.windSpeed + " km/h.";
      }
    } else if (lowerQuery.includes("forecast") || lowerQuery.includes("next few days") || lowerQuery.includes("week")) {
      let forecastSummary = "Here's the 6-day forecast for " + weatherData.location + ": ";
      forecastData.forEach(day => {
        forecastSummary += day.day + ": " + day.temp + "°C, " + day.condition + ". ";
      });
      return forecastSummary;
    } else if (lowerQuery.includes("wear") || lowerQuery.includes("clothes") || lowerQuery.includes("outfit")) {
      if (weatherData.temperature > 30) {
        return "For today's weather in " + weatherData.location + " ("+weatherData.temperature+"°C, "+weatherData.condition+"), wear light, breathable clothing like cotton t-shirts and shorts. Don't forget sunglasses, a hat, and sunscreen.";
      } else if (weatherData.temperature > 20) {
        return "For today's weather in " + weatherData.location + " ("+weatherData.temperature+"°C, "+weatherData.condition+"), light clothing like t-shirts and jeans would be comfortable. Maybe bring a light jacket for the evening.";
      } else if (weatherData.temperature > 10) {
        return "For today's weather in " + weatherData.location + " ("+weatherData.temperature+"°C, "+weatherData.condition+"), you'll need a jacket or light sweater. Jeans and closed shoes would be appropriate.";
      } else {
        return "For today's weather in " + weatherData.location + " ("+weatherData.temperature+"°C, "+weatherData.condition+"), dress warmly with layers, a coat, and don't forget gloves and a hat.";
      }
    } else {
      return "I'm your weather assistant for " + weatherData.location + ". Current conditions: " + weatherData.temperature + "°C, " + weatherData.condition + ". How can I help you with weather-related questions?";
    }
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
            <h2 className="text-xl font-medium mb-4">6-Day Forecast</h2>
            <div className="grid grid-cols-6 gap-2">
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
                          : 'bg-primary text-white ml-auto'
                      }`}
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
                  placeholder="Ask me about today's weather, what to wear, forecast, etc."
                  value={assistantQuery}
                  onChange={(e) => setAssistantQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAssistantQuery())}
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
