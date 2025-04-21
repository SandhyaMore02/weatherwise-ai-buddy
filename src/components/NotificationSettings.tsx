
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";

type TimePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

// Simple time picker component
const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <select
        className="bg-background border border-input rounded px-2 py-1"
        value={value.split(':')[0]}
        onChange={(e) => {
          const hour = e.target.value;
          const minute = value.split(':')[1];
          onChange(`${hour}:${minute}`);
        }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <option key={i} value={i.toString().padStart(2, '0')}>
            {i.toString().padStart(2, '0')}
          </option>
        ))}
      </select>
      <span>:</span>
      <select
        className="bg-background border border-input rounded px-2 py-1"
        value={value.split(':')[1]}
        onChange={(e) => {
          const hour = value.split(':')[0];
          const minute = e.target.value;
          onChange(`${hour}:${minute}`);
        }}
      >
        {Array.from({ length: 60 }).map((_, i) => (
          <option key={i} value={i.toString().padStart(2, '0')}>
            {i.toString().padStart(2, '0')}
          </option>
        ))}
      </select>
    </div>
  );
};

const STORAGE_KEY = "weatherwise-notification-settings";

const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState("08:00");
  const [weatherUpdates, setWeatherUpdates] = useState(true);
  const [outfitSuggestions, setOutfitSuggestions] = useState(true);
  const [travelTips, setTravelTips] = useState(true);
  const [musicRecommendations, setMusicRecommendations] = useState(true);

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setNotificationsEnabled(parsedSettings.enabled || false);
        setNotificationTime(parsedSettings.time || "08:00");
        setWeatherUpdates(parsedSettings.weatherUpdates !== false);
        setOutfitSuggestions(parsedSettings.outfitSuggestions !== false);
        setTravelTips(parsedSettings.travelTips !== false);
        setMusicRecommendations(parsedSettings.musicRecommendations !== false);
      } catch (error) {
        console.error("Error loading notification settings:", error);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    // Save notification settings to local storage
    const settings = {
      enabled: notificationsEnabled,
      time: notificationTime,
      weatherUpdates,
      outfitSuggestions,
      travelTips,
      musicRecommendations
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    
    // Check permissions if notifications are enabled
    if (notificationsEnabled && "Notification" in window) {
      if (Notification.permission === "granted") {
        showNotification();
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            showNotification();
          } else {
            toast.warning("Please enable browser notifications for the best experience");
          }
        });
      } else {
        toast.warning("Notifications are blocked. Please update your browser settings.");
      }
    } else if (notificationsEnabled) {
      toast.warning("Browser notifications are not supported in this browser");
    } else {
      toast.success("Notification settings saved successfully");
    }
  };

  const showNotification = () => {
    const message = `Notifications will be sent at ${notificationTime}`;
    toast.success(message);
    
    // Show a test notification
    try {
      new Notification("WeatherWise Notifications Enabled", {
        body: `You'll receive daily updates at ${notificationTime}`,
        icon: "/favicon.ico"
      });
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("Could not create notification");
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {notificationsEnabled ? (
            <Bell className="h-5 w-5 text-primary" />
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications" className="flex items-center gap-2">
            Enable daily notifications
          </Label>
          <Switch 
            id="notifications" 
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </div>
        
        {notificationsEnabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="notificationTime">Notification Time</Label>
              <TimePicker value={notificationTime} onChange={setNotificationTime} />
              <p className="text-xs text-muted-foreground mt-1">
                You'll receive daily updates at this time
              </p>
            </div>
            
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
          </>
        )}
        
        <Button onClick={handleSaveSettings} className="w-full">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
