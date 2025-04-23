
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NotificationSettings from "@/components/NotificationSettings";
import { Settings, User, Globe, Info, Bell } from "lucide-react";
import { useCity } from "@/contexts/CityContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const SettingsPage = () => {
  const { city } = useCity();
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const [permissionStatus, setPermissionStatus] = useState(
    "Notification" in window ? Notification.permission : "unsupported"
  );

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("Notifications are not supported in this browser");
      return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === "granted") {
        toast.success("Notification permission granted! You can now receive weather updates.");
      } else if (permission === "denied") {
        toast.error("Notification permission denied. Please enable notifications in your browser settings.");
      } else {
        toast.warning("Notification permission request was dismissed. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast.error("Failed to request notification permission");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        Settings
      </h1>
      
      {isMobile && permissionStatus !== "granted" && (
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertTitle>Enable Notifications</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>For the best experience, please ensure notifications are enabled.</p>
            <Button 
              onClick={requestNotificationPermission}
              variant="outline"
              className="bg-background border-primary text-primary hover:bg-primary/10 w-full"
            >
              <Bell className="mr-2 h-4 w-4" />
              Allow Notifications
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
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
