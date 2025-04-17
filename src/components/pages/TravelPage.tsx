
import { Card, CardContent } from "@/components/ui/card";
import { Compass, Umbrella, Bus, Bike, AlertTriangle } from "lucide-react";

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

// For demo purposes, we'll use sunny as the current condition
const currentCondition = "sunny";

const TravelPage = () => {
  const tips = travelTips[currentCondition as keyof typeof travelTips];
  
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Compass className="h-6 w-6 text-primary" />
        Travel Tips
      </h1>
      
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
          <h2 className="text-xl font-medium mb-4">Local Recommendations</h2>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-secondary flex items-center gap-3">
              <span className="text-2xl">🏞️</span>
              <p>Golden Gate Park - Perfect for a sunny day!</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary flex items-center gap-3">
              <span className="text-2xl">🏙️</span>
              <p>Ferry Building - Great views and food market</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary flex items-center gap-3">
              <span className="text-2xl">🌉</span>
              <p>Walk across the Golden Gate Bridge</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TravelPage;
