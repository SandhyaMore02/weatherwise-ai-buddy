
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const PermissionStatusAlert: React.FC = () => {
  const openSettings = () => {
    // This will direct user to browser settings on most mobile browsers
    // For desktop browsers, provide guidance
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      // On Android, we can try to open app settings directly
      if (/Android/i.test(navigator.userAgent)) {
        try {
          window.open('app-settings:');
        } catch (error) {
          console.error("Could not open settings automatically");
        }
      }
    }
    
    alert("Please enable notifications for this site in your browser settings");
  };

  return (
    <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md text-sm">
      <p className="font-medium">Notifications are blocked</p>
      <p className="mt-1">
        Please enable notifications in your device settings to receive weather updates.
      </p>
      <Button 
        onClick={openSettings}
        variant="outline" 
        size="sm"
        className="mt-2 bg-red-200 dark:bg-red-800 border-red-300 dark:border-red-700 hover:bg-red-300 dark:hover:bg-red-700"
      >
        <Settings className="h-4 w-4 mr-2" />
        Open Settings
      </Button>
    </div>
  );
};

export default PermissionStatusAlert;
