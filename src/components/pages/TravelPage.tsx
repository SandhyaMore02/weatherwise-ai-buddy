import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Compass, Umbrella, Bus, Bike, AlertTriangle, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { fetchWeatherByCity } from "@/services/WeatherService";

// Mock data for travel tips
const travelTips = {
  sunny: {
    mainTip: "Great day for outdoor activities!",
    transport: "Biking or walking recommended",
    preparation: "Bring sunscreen and water",
    alert: null,
    icon: "🚲"
  },
  cloudy: {
    mainTip: "Good day for most activities",
    transport: "Any transportation works well",
    preparation: "Light jacket might be handy",
    alert: null,
    icon: "🚌"
  },
  rainy: {
    mainTip: "Indoor activities recommended",
    transport: "Public transport or car advised",
    preparation: "Bring umbrella and raincoat",
    alert: "Watch for slippery roads",
    icon: "🚗"
  }
};

// Enhanced city-specific recommendations with more options and normalized city names
const cityRecommendations = {
  "delhi": [
    { icon: "🏰", name: "Red Fort", description: "Historic monument in Old Delhi" },
    { icon: "🕌", name: "Jama Masjid", description: "One of India's largest mosques" },
    { icon: "🏛️", name: "India Gate", description: "War memorial in central Delhi" },
    { icon: "🏯", name: "Humayun's Tomb", description: "UNESCO World Heritage Site" },
    { icon: "🛍️", name: "Chandni Chowk", description: "Historic market with street food" }
  ],
  "mumbai": [
    { icon: "🏨", name: "Gateway of India", description: "Iconic monument facing Arabian Sea" },
    { icon: "🚶", name: "Marine Drive", description: "Scenic coastal boulevard" },
    { icon: "🚆", name: "CST Railway Station", description: "UNESCO World Heritage Site" },
    { icon: "🎭", name: "Elephanta Caves", description: "Ancient cave temples" },
    { icon: "🏖️", name: "Juhu Beach", description: "Popular beach with street food" }
  ],
  "bangalore": [
    { icon: "🏯", name: "Bangalore Palace", description: "Tudor-style architecture palace" },
    { icon: "🌳", name: "Cubbon Park", description: "Large green space in the city center" },
    { icon: "🛍️", name: "MG Road", description: "Popular shopping and entertainment area" },
    { icon: "🏛️", name: "Vidhana Soudha", description: "State legislature building" },
    { icon: "🌺", name: "Lalbagh Botanical Garden", description: "Historic garden with glass house" }
  ],
  "kolkata": [
    { icon: "🌉", name: "Howrah Bridge", description: "Iconic cantilever bridge" },
    { icon: "🏛️", name: "Victoria Memorial", description: "Marble museum dedicated to Queen Victoria" },
    { icon: "🚋", name: "Tram Ride", description: "Experience the historic tram network" },
    { icon: "🏯", name: "Indian Museum", description: "Oldest and largest museum in India" },
    { icon: "🛍️", name: "New Market", description: "Historic shopping area" }
  ],
  "chennai": [
    { icon: "🏖️", name: "Marina Beach", description: "One of the longest urban beaches in the world" },
    { icon: "🕍", name: "Kapaleeshwarar Temple", description: "Ancient Shiva temple" },
    { icon: "🏛️", name: "Fort St. George", description: "First English fortress in India" },
    { icon: "🌳", name: "Guindy National Park", description: "One of the smallest national parks" },
    { icon: "🎭", name: "Government Museum", description: "Second oldest museum in India" }
  ],
  "jaipur": [
    { icon: "🏰", name: "Amber Fort", description: "Majestic fort overlooking Maota Lake" },
    { icon: "👑", name: "City Palace", description: "Royal residence in the heart of Jaipur" },
    { icon: "📸", name: "Hawa Mahal", description: "Palace of Winds with intricate facade" },
    { icon: "🔭", name: "Jantar Mantar", description: "UNESCO World Heritage astronomical site" },
    { icon: "💎", name: "Johri Bazaar", description: "Famous jewelry market" }
  ],
  "hyderabad": [
    { icon: "🏛️", name: "Charminar", description: "Iconic monument and mosque" },
    { icon: "🏰", name: "Golconda Fort", description: "Ancient fort with light and sound show" },
    { icon: "🍲", name: "Biryani Tour", description: "Sample the famous Hyderabadi biryani" },
    { icon: "💎", name: "Salar Jung Museum", description: "One of the largest museums in the world" },
    { icon: "🛕", name: "Birla Mandir", description: "Beautiful temple with panoramic views" }
  ],
  "agra": [
    { icon: "🏛️", name: "Taj Mahal", description: "World-famous marble mausoleum" },
    { icon: "🏰", name: "Agra Fort", description: "UNESCO World Heritage Site" },
    { icon: "🏙️", name: "Fatehpur Sikri", description: "Historic city founded by Akbar" },
    { icon: "🪦", name: "Itimad-ud-Daulah", description: "Baby Taj with marble inlay work" },
    { icon: "🌳", name: "Mehtab Bagh", description: "Garden with perfect Taj Mahal view" }
  ],
  "pune": [
    { icon: "🏰", name: "Shaniwar Wada", description: "Historic fortification in the city" },
    { icon: "🪨", name: "Sinhagad Fort", description: "Ancient hill fortress with great views" },
    { icon: "🏛️", name: "Aga Khan Palace", description: "Historic monument and Gandhi memorial" },
    { icon: "🛕", name: "Dagdusheth Ganpati Temple", description: "Famous Hindu temple" },
    { icon: "🌳", name: "Empress Garden", description: "Beautiful botanical garden" }
  ],
  "chandigarh": [
    { icon: "🌳", name: "Rock Garden", description: "Sculpture garden made from industrial waste" },
    { icon: "🏞️", name: "Sukhna Lake", description: "Artificial lake with walking path" },
    { icon: "🏛️", name: "Capitol Complex", description: "Government buildings designed by Le Corbusier" },
    { icon: "🌺", name: "Rose Garden", description: "Asia's largest rose garden" },
    { icon: "🛍️", name: "Sector 17 Market", description: "Popular shopping area" }
  ],
  "ahmedabad": [
    { icon: "🕌", name: "Sabarmati Ashram", description: "Gandhi's residence for many years" },
    { icon: "🌉", name: "Sabarmati Riverfront", description: "Urban development project along the river" },
    { icon: "🕋", name: "Jama Masjid", description: "Historic mosque" },
    { icon: "🪟", name: "Sidi Saiyyed Mosque", description: "Famous for stone lattice work" },
    { icon: "🏛️", name: "Adalaj Stepwell", description: "Intricately carved step well" }
  ]
};

// Default recommendations for cities not in our database
const defaultRecommendations = [
  { icon: "🏞️", name: "Local Parks", description: "Explore the green spaces" },
  { icon: "🏛️", name: "Museums & Galleries", description: "Discover local culture and history" },
  { icon: "🍽️", name: "Local Cuisine", description: "Try regional specialties" },
  { icon: "🛍️", name: "Markets", description: "Shop for local goods and souvenirs" },
  { icon: "🧭", name: "Walking Tour", description: "Explore the city streets on foot" }
];

const TravelPage = () => {
  const [currentCondition, setCurrentCondition] = useState("sunny");
  const [currentCity, setCurrentCity] = useState("delhi");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get recommendations based on current city, normalized to lowercase with whitespace removed
  const getNormalizedCityRecommendations = () => {
    // Normalize city name (lowercase, remove extra spaces)
    const normalizedCity = currentCity.toLowerCase().trim().replace(/\s+/g, ' ');
    
    // Check for exact match
    if (cityRecommendations[normalizedCity]) {
      return cityRecommendations[normalizedCity];
    }
    
    // Check for partial matches
    for (const city in cityRecommendations) {
      if (normalizedCity.includes(city) || city.includes(normalizedCity)) {
        console.log(`Found partial match: ${normalizedCity} matches with ${city}`);
        return cityRecommendations[city];
      }
    }
    
    // Default recommendations if no match found
    return defaultRecommendations;
  };
  
  const recommendations = getNormalizedCityRecommendations();
  const tips = travelTips[currentCondition as keyof typeof travelTips];
  
  useEffect(() => {
    // Load Delhi weather by default
    fetchCityWeather("Delhi");
  }, []);

  const fetchCityWeather = async (city: string) => {
    if (!city) return;
    
    setIsLoading(true);
    try {
      const weatherData = await fetchWeatherByCity(city);
      setCurrentCity(weatherData.location);
      console.log(`Set current city to: ${weatherData.location}`);
      
      // Set weather condition
      if (weatherData.condition === "clear") {
        setCurrentCondition("sunny");
      } else if (weatherData.condition === "clouds") {
        setCurrentCondition("cloudy");
      } else if (weatherData.condition === "rain" || weatherData.condition === "drizzle") {
        setCurrentCondition("rainy");
      }
      
      toast.success(`Travel tips updated for ${weatherData.location}`);
    } catch (error) {
      console.error("Error fetching weather:", error);
      toast.error("Couldn't fetch travel information for this city");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      toast.error("Please enter a city name");
      return;
    }
    
    fetchCityWeather(searchQuery);
    setSearchQuery("");
    setIsSearchOpen(false);
  };
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Compass className="h-6 w-6 text-primary" />
          Travel Tips
        </h1>
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
      
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span className="capitalize">{currentCity}</span>
        {isLoading && <span className="text-xs">(Loading...)</span>}
      </div>
      
      <Card className="weather-card bg-gradient-to-br from-primary/20 to-primary/5">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Today's Travel Advice</h2>
            <span className="text-3xl">{tips.icon}</span>
          </div>
          
          <p className="text-lg font-medium mb-4">{tips.mainTip}</p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              {currentCondition === "sunny" ? (
                <Bike className="h-5 w-5 text-primary mt-1" />
              ) : (
                <Bus className="h-5 w-5 text-primary mt-1" />
              )}
              <div>
                <p className="font-medium">Transport</p>
                <p className="text-muted-foreground">{tips.transport}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Umbrella className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">Preparation</p>
                <p className="text-muted-foreground">{tips.preparation}</p>
              </div>
            </div>
            
            {tips.alert && (
              <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg text-destructive">
                <AlertTriangle className="h-5 w-5 mt-1" />
                <div>
                  <p className="font-medium">Alert</p>
                  <p>{tips.alert}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium mb-4">Local Recommendations for {currentCity}</h2>
          <div className="space-y-3">
            {recommendations.map((item, index) => (
              <div key={index} className="p-3 rounded-lg bg-secondary flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TravelPage;
