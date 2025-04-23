
interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
}

interface NotificationPreviewProps {
  notificationsEnabled: boolean;
  weatherUpdates: boolean;
  outfitSuggestions: boolean;
  travelTips: boolean;
  musicRecommendations: boolean;
  notificationTime: string;
}

const NotificationPreview: React.FC<NotificationPreviewProps> = ({
  notificationsEnabled,
  weatherUpdates,
  outfitSuggestions,
  travelTips,
  musicRecommendations,
  notificationTime
}) => {
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

  return { showNotification };
};

export default NotificationPreview;
