
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";
import TimePicker from "./TimePicker";
import NotificationTypeToggles from "./NotificationTypeToggles";
import PermissionStatusAlert from "./PermissionStatusAlert";

const STORAGE_KEY = "weatherwise-notification-settings";

interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
}

const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState("08:00");
  const [weatherUpdates, setWeatherUpdates] = useState(true);
  const [outfitSuggestions, setOutfitSuggestions] = useState(true);
  const [travelTips, setTravelTips] = useState(true);
  const [musicRecommendations, setMusicRecommendations] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<string>('default');

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

    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = () => {
    if (!("Notification" in window)) {
      setPermissionStatus('unsupported');
      return;
    }
    setPermissionStatus(Notification.permission);
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("Notifications are not supported in this browser");
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);

      if (permission === "granted") {
        toast.success("Notification permission granted");
        return true;
      } else if (permission === "denied") {
        toast.error("Notification permission denied. Please enable notifications in your device settings.");
        return false;
      } else {
        toast.warning("Notification permission not granted. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast.error("Failed to request notification permission");
      return false;
    }
  };

  const handleSaveSettings = async () => {
    const settings = {
      enabled: notificationsEnabled,
      time: notificationTime,
      weatherUpdates,
      outfitSuggestions,
      travelTips,
      musicRecommendations
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    if (notificationsEnabled) {
      if (permissionStatus === "granted") {
        showNotification();
        toast.success("Notification settings saved successfully");
      } else {
        const permissionGranted = await requestNotificationPermission();
        if (permissionGranted) {
          showNotification();
        } else {
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          if (isMobile) {
            toast.warning(
              "Please enable notifications in your device settings: Settings > Apps > WeatherWise > Notifications",
              { duration: 5000 }
            );
          }
        }
      }
    } else {
      toast.success("Notification settings saved successfully");
    }
  };

  const showNotification = () => {
    let notificationTitle = "WeatherWise";
    let notificationBody = `Daily update for ${new Date().toLocaleDateString()}`;

    const details = [];
    if (weatherUpdates) details.push("weather updates");
    if (outfitSuggestions) details.push("outfit suggestions");
    if (travelTips) details.push("travel tips");
    if (musicRecommendations) details.push("music recommendations");

    if (details.length > 0) {
      notificationBody += `: You'll receive ${details.join(", ")} at ${notificationTime}`;
    }

    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          const options: ExtendedNotificationOptions = {
            body: notificationBody,
            icon: "/favicon.ico",
            tag: "weatherwise-notification",
          };
          if ('vibrate' in navigator) {
            options.vibrate = [200, 100, 200];
          }
          registration.showNotification(notificationTitle, options)
            .catch(error => {
              console.error("Service worker notification error:", error);
              fallbackNotification(notificationTitle, notificationBody);
            });
        }).catch(error => {
          console.error("Service worker not ready:", error);
          fallbackNotification(notificationTitle, notificationBody);
        });
      } else {
        fallbackNotification(notificationTitle, notificationBody);
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("Could not create notification");
    }
  };

  const fallbackNotification = (title: string, body: string) => {
    try {
      new Notification(title, {
        body: body,
        icon: "/favicon.ico"
      });
    } catch (error) {
      console.error("Fallback notification error:", error);
      toast.error("Could not create notification. Please check your browser settings.");
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
            <NotificationTypeToggles
              weatherUpdates={weatherUpdates}
              setWeatherUpdates={setWeatherUpdates}
              outfitSuggestions={outfitSuggestions}
              setOutfitSuggestions={setOutfitSuggestions}
              travelTips={travelTips}
              setTravelTips={setTravelTips}
              musicRecommendations={musicRecommendations}
              setMusicRecommendations={setMusicRecommendations}
            />
          </>
        )}

        <Button onClick={handleSaveSettings} className="w-full">
          Save Settings
        </Button>

        {permissionStatus === 'denied' && (
          <PermissionStatusAlert />
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
