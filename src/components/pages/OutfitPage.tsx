
import { Card, CardContent } from "@/components/ui/card";
import { Shirt, Footprints, UserCircle2, Umbrella } from "lucide-react";

// Mock data for outfit suggestions
const outfitSuggestions = {
  sunny: {
    top: "Light t-shirt or short-sleeve shirt",
    bottom: "Shorts or light pants",
    accessories: "Sunglasses, hat",
    footwear: "Sandals or light shoes",
    icon: "👕"
  },
  cloudy: {
    top: "Long-sleeve shirt or light sweater",
    bottom: "Jeans or casual pants",
    accessories: "Light scarf (optional)",
    footwear: "Sneakers or casual shoes",
    icon: "👚"
  },
  rainy: {
    top: "Water-resistant jacket",
    bottom: "Water-resistant pants",
    accessories: "Umbrella, maybe a hat",
    footwear: "Water-resistant shoes or boots",
    icon: "🧥"
  }
};

// For demo purposes, we'll use sunny as the current condition
const currentCondition = "sunny";

const OutfitPage = () => {
  const suggestion = outfitSuggestions[currentCondition as keyof typeof outfitSuggestions];
  
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <UserCircle2 className="h-6 w-6 text-primary" />
        Outfit Suggestions
      </h1>
      
      <Card className="weather-card bg-gradient-to-br from-primary/20 to-primary/5">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Today's Outfit</h2>
            <span className="text-3xl">{suggestion.icon}</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Shirt className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">Top</p>
                <p className="text-muted-foreground">{suggestion.top}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1">
                <path d="M12 3H8a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V9" />
              </svg>
              <div>
                <p className="font-medium">Bottom</p>
                <p className="text-muted-foreground">{suggestion.bottom}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Footprints className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">Footwear</p>
                <p className="text-muted-foreground">{suggestion.footwear}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Umbrella className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">Accessories</p>
                <p className="text-muted-foreground">{suggestion.accessories}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium mb-4">Why This Outfit?</h2>
          <p className="text-muted-foreground">
            Based on today's sunny weather and temperature of 24°C, 
            we've suggested an outfit that will keep you comfortable
            throughout the day without overheating.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutfitPage;
