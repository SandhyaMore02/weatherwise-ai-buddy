
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationSettings from "@/components/NotificationSettings";
import { Settings, User, Globe, Info } from "lucide-react";
import { useCity } from "@/contexts/CityContext";

const SettingsPage = () => {
  const { city } = useCity();

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        Settings
      </h1>
      
      <NotificationSettings />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            User Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Temperature Unit</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg bg-primary text-primary-foreground">°C</button>
              <button className="px-3 py-1 rounded-lg bg-muted text-muted-foreground">°F</button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Distance Unit</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg bg-primary text-primary-foreground">km</button>
              <button className="px-3 py-1 rounded-lg bg-muted text-muted-foreground">mi</button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Default Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Your saved location will be used when the app starts.</p>
          <div className="flex items-center justify-between">
            <span>Current Default</span>
            <span className="font-medium">{city}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">WeatherWise v1.0</p>
          <p className="text-xs text-muted-foreground mt-2">
            Your AI-powered weather companion that provides personalized suggestions based on real-time weather data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
