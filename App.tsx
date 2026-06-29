import './global.css';
import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
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

  const handleNavigate = (screen: string, routeId?: string) => {
    if (routeId) setSelectedRouteId(routeId);
    setCurrentScreen(screen);
  };

  return (
    <SafeAreaProvider>
      {currentScreen === 'Welcome' && (
        <WelcomeScreen onNavigate={handleNavigate} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      )}
      {currentScreen === 'Selection' && (
        <SelectionScreen onBack={() => setCurrentScreen('Welcome')} onNavigate={handleNavigate} isDarkMode={isDarkMode} />
      )}
      {currentScreen === 'Seeder' && (
        <SeederScreen onBack={() => setCurrentScreen('Welcome')} isDarkMode={isDarkMode} />
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
