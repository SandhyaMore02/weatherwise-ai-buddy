
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import WeatherPage from "@/components/pages/WeatherPage";
import OutfitPage from "@/components/pages/OutfitPage";
import TravelPage from "@/components/pages/TravelPage";
import MusicPage from "@/components/pages/MusicPage";
import SettingsPage from "@/components/pages/SettingsPage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("weather");
  
  const renderContent = () => {
    switch (activeTab) {
      case "weather":
        return <WeatherPage />;
      case "outfit":
        return <OutfitPage />;
      case "travel":
        return <TravelPage />;
      case "music":
        return <MusicPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <WeatherPage />;
    }
  };
  
  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </MainLayout>
  );
};

export default Index;
