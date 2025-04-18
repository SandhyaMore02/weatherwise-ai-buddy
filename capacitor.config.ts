
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.06e1bb85b79d4c33bf44e9656cee3eea',
  appName: 'weatherwise-ai-buddy',
  webDir: 'dist',
  server: {
    url: 'https://06e1bb85-b79d-4c33-bf44-e9656cee3eea.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      androidxCore: '1.7.0',
      minSdkVersion: 21,
      targetSdkVersion: 33,
    }
  }
};

export default config;
