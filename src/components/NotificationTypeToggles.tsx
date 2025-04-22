
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import React from "react";

interface NotificationTypeTogglesProps {
  weatherUpdates: boolean;
  setWeatherUpdates: (v: boolean) => void;
  outfitSuggestions: boolean;
  setOutfitSuggestions: (v: boolean) => void;
  travelTips: boolean;
  setTravelTips: (v: boolean) => void;
  musicRecommendations: boolean;
  setMusicRecommendations: (v: boolean) => void;
}

const NotificationTypeToggles: React.FC<NotificationTypeTogglesProps> = ({
  weatherUpdates,
  setWeatherUpdates,
  outfitSuggestions,
  setOutfitSuggestions,
  travelTips,
  setTravelTips,
  musicRecommendations,
  setMusicRecommendations,
}) => (
  <div className="space-y-4">
    <h3 className="font-medium">Include in notifications:</h3>
    <div className="flex items-center justify-between">
      <Label htmlFor="weatherUpdates" className="flex items-center gap-2">
        Weather updates
      </Label>
      <Switch
        id="weatherUpdates"
        checked={weatherUpdates}
        onCheckedChange={setWeatherUpdates}
      />
    </div>
    <div className="flex items-center justify-between">
      <Label htmlFor="outfitSuggestions" className="flex items-center gap-2">
        Outfit suggestions
      </Label>
      <Switch
        id="outfitSuggestions"
        checked={outfitSuggestions}
        onCheckedChange={setOutfitSuggestions}
      />
    </div>
    <div className="flex items-center justify-between">
      <Label htmlFor="travelTips" className="flex items-center gap-2">
        Travel tips
      </Label>
      <Switch
        id="travelTips"
        checked={travelTips}
        onCheckedChange={setTravelTips}
      />
    </div>
    <div className="flex items-center justify-between">
      <Label htmlFor="musicRecommendations" className="flex items-center gap-2">
        Music recommendations
      </Label>
      <Switch
        id="musicRecommendations"
        checked={musicRecommendations}
        onCheckedChange={setMusicRecommendations}
      />
    </div>
  </div>
);

export default NotificationTypeToggles;
