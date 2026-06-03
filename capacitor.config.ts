import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lastminute.app',
  appName: 'LastMinute',
  webDir: '.next/server/app',
  server: {
    androidScheme: 'https',
    // When running on a real device, proxy API calls to the deployed server
    // Set your deployed URL here (e.g., Vercel, Railway, etc.)
    url: process.env.CAPACITOR_SERVER_URL || undefined,
    cleartext: true,
    allowNavigation: ['*'],
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#0a0a1a',
      showSpinner: false,
    },
  },
};

export default config;
