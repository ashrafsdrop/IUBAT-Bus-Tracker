import './global.css';
import React, { useState, useEffect } from 'react';
import { useColorScheme, PermissionsAndroid, Platform, Alert, Linking, BackHandler } from 'react-native';

const CURRENT_APP_VERSION = 'v1.0.0'; // Hardcode your current app version here
const GITHUB_REPO = 'ashrafsdrop/IUBAT-Bus-Tracker'; // Your GitHub repository
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SelectionScreen from './src/screens/SelectionScreen';
import SeederScreen from './src/screens/SeederScreen';
import MapScreen from './src/screens/MapScreen';

function App() {
  const systemTheme = useColorScheme();
  const [currentScreen, setCurrentScreen] = useState('Welcome');
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        // Wait 1 second to ensure the app UI is fully mounted. 
        // Android often silently swallows permission prompts if called too early during app launch.
        setTimeout(async () => {
          try {
            let permissionsToRequest = [
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
            ];
            if (Platform.Version >= 33) {
              permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
            }
            await PermissionsAndroid.requestMultiple(permissionsToRequest);
          } catch (err) {
            console.warn(err);
          }
        }, 1000);
      }
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
        if (!response.ok) return;
        const data = await response.json();
        
        // The tag_name on GitHub (e.g., "v1.0.1")
        const latestVersion = data.tag_name; 

        if (latestVersion && latestVersion !== CURRENT_APP_VERSION) {
          Alert.alert(
            "Update Available! 🚀",
            `A new version (${latestVersion}) is available. You are using ${CURRENT_APP_VERSION}. Please update to get the latest features and bug fixes.`,
            [
              { text: "Later", style: "cancel" },
              { 
                text: "Download Update", 
                onPress: () => {
                  // Find the direct .apk download link in the GitHub release assets
                  const apkAsset = data.assets && data.assets.find((asset: any) => asset.name.endsWith('.apk'));
                  const downloadUrl = apkAsset ? apkAsset.browser_download_url : data.html_url;
                  Linking.openURL(downloadUrl);
                }
              }
            ]
          );
        }
      } catch (error) {
        console.log("Could not check for updates", error);
      }
    };

    // Check for updates slightly after the app launches (3 seconds delay)
    // so it doesn't interrupt the immediate splash screen/permission flow
    setTimeout(checkForUpdates, 3000);
  }, []);

  const handleNavigate = (screen: string, routeId?: string) => {
    if (routeId) setSelectedRouteId(routeId);
    setCurrentScreen(screen);
  };

  useEffect(() => {
    const backAction = () => {
      // If we are not on the Welcome screen, intercept the back button
      // and send the user back to the Welcome screen instead of closing the app.
      if (currentScreen !== 'Welcome') {
        setCurrentScreen('Welcome');
        return true; 
      }
      // If we are on the Welcome screen, let the default behavior happen (exit app)
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [currentScreen]);

  return (
    <SafeAreaProvider>
      {currentScreen === 'Welcome' && (
        <WelcomeScreen onNavigate={handleNavigate} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      )}
      {currentScreen === 'Selection' && (
        <SelectionScreen onBack={() => setCurrentScreen('Welcome')} onNavigate={handleNavigate} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      )}
      {currentScreen === 'Seeder' && (
        <SeederScreen onBack={() => setCurrentScreen('Welcome')} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      )}
      {currentScreen === 'Map' && (
        <MapScreen 
          onBack={() => setCurrentScreen('Welcome')} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          selectedRouteId={selectedRouteId} 
        />
      )}
    </SafeAreaProvider>
  );
}

export default App;
