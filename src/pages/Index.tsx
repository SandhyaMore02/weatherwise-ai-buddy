
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import WeatherPage from "@/components/pages/WeatherPage";
import OutfitPage from "@/components/pages/OutfitPage";
import TravelPage from "@/components/pages/TravelPage";
import MusicPage from "@/components/pages/MusicPage";

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
