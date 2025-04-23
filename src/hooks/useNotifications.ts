
import { useState, useEffect } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "weatherwise-notification-settings";

export interface NotificationSettings {
  enabled: boolean;
  time: string;
  weatherUpdates: boolean;
  outfitSuggestions: boolean;
  travelTips: boolean;
  musicRecommendations: boolean;
}

export function useNotifications() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState("08:00");
  const [weatherUpdates, setWeatherUpdates] = useState(true);
  const [outfitSuggestions, setOutfitSuggestions] = useState(true);
  const [travelTips, setTravelTips] = useState(true);
  const [musicRecommendations, setMusicRecommendations] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<string>('default');
  const [isNotificationsSupported, setIsNotificationsSupported] = useState(true);

  useEffect(() => {
    setIsNotificationsSupported("Notification" in window);
    
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

  useEffect(() => {
    checkNotificationPermission();
  });

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

  const saveSettings = (
    enabled: boolean,
    time: string,
    weather: boolean,
    outfit: boolean,
    travel: boolean,
    music: boolean
  ) => {
    const settings = {
      enabled,
      time,
      weatherUpdates: weather,
      outfitSuggestions: outfit,
      travelTips: travel,
      musicRecommendations: music
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  };

  return {
    notificationsEnabled,
    setNotificationsEnabled,
    notificationTime,
    setNotificationTime,
    weatherUpdates,
    setWeatherUpdates,
    outfitSuggestions,
    setOutfitSuggestions,
    travelTips,
    setTravelTips,
    musicRecommendations,
    setMusicRecommendations,
    permissionStatus,
    isNotificationsSupported,
    requestNotificationPermission,
    saveSettings
  };
}
