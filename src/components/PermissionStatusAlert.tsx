
import React from "react";

const PermissionStatusAlert: React.FC = () => (
  <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md text-sm">
    <p className="font-medium">Notifications are blocked</p>
    <p className="mt-1">
      Please enable notifications in your device settings to receive weather updates.
    </p>
  </div>
);

export default PermissionStatusAlert;
