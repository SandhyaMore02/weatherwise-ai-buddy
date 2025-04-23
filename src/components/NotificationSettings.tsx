
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";
import TimePicker from "./TimePicker";
import NotificationTypeToggles from "./NotificationTypeToggles";
import PermissionStatusAlert from "./PermissionStatusAlert";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationPreview from "./NotificationPreview";

const NotificationSettings = () => {
  const {
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
  } = useNotifications();

  const { showNotification } = NotificationPreview({
    notificationsEnabled,
    weatherUpdates,
    outfitSuggestions,
    travelTips,
    musicRecommendations,
    notificationTime
  });

  const handleToggleNotifications = async (checked: boolean) => {
    if (checked && permissionStatus !== 'granted') {
      const permissionGranted = await requestNotificationPermission();
      if (!permissionGranted) {
        return;
      }
    }
    
    setNotificationsEnabled(checked);
    saveSettings(checked, notificationTime, weatherUpdates, outfitSuggestions, travelTips, musicRecommendations);
  };

  const handleSaveSettings = async () => {
    saveSettings(
      notificationsEnabled,
      notificationTime,
      weatherUpdates,
      outfitSuggestions,
      travelTips,
      musicRecommendations
    );

    if (notificationsEnabled) {
      if (permissionStatus === "granted") {
        showNotification();
        toast.success("Notification settings saved successfully");
      } else {
        const permissionGranted = await requestNotificationPermission();
        if (permissionGranted) {
          showNotification();
        }
      }
    } else {
      toast.success("Notification settings saved successfully");
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
        {!isNotificationsSupported ? (
          <PermissionStatusAlert type="unsupported" />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex items-center gap-2">
                Enable daily notifications
              </Label>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={handleToggleNotifications}
                disabled={!isNotificationsSupported}
              />
            </div>

            {permissionStatus === 'denied' && (
              <PermissionStatusAlert type="blocked" />
            )}

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
          </>
        )}

        <Button 
          onClick={handleSaveSettings} 
          className="w-full"
          disabled={!isNotificationsSupported}
        >
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
