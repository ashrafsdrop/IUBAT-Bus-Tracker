import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, Animated, PermissionsAndroid, Platform } from 'react-native';
import * as import_react_native from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackgroundJob from 'react-native-background-actions';
import Geolocation from '@react-native-community/geolocation';
import { ref, set, remove, update, onDisconnect } from 'firebase/database';
import { database } from '../firebaseConfig';
import { ROUTES } from '../data/routes';
import Header from '../components/Header';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';

const sleep = (time: any) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));

const backgroundTask = async (taskDataArguments: any) => {
    const { delay, busId } = taskDataArguments;
    const startTime = Date.now();
    await new Promise(async (resolve) => {
        for (let i = 0; BackgroundJob.isRunning(); i++) {
            if (Date.now() - startTime > 2 * 60 * 60 * 1000) {
                console.log("Auto-stopping broadcast after 2 hours for safety.");
                await BackgroundJob.stop();
                break;
            }
            Geolocation.getCurrentPosition(
                (pos) => {
                    // ANTI-SPOOFING 1: Check native Android mock location flag
                    if ((pos as any).mocked) {
                        console.log("Mock GPS detected! Ignoring fake location.");
                        return;
                    }

                    const { latitude, longitude } = pos.coords;

                    // ANTI-SPOOFING 2: Regional Bounding Box (Dhaka & Gazipur area only)
                    // If someone tries to broadcast from America or Antarctica, reject it.
                    if (latitude < 23.5 || latitude > 24.2 || longitude < 90.1 || longitude > 90.7) {
                        console.log("Location outside allowed operational region! Ignoring.");
                        return;
                    }

                    // Push live coordinates, crowd level, and route info to Firebase with a unique Session ID
                    set(ref(database, `buses/${busId}_${globalSessionId}`), {
                        lat: latitude,
                        lng: longitude,
                        timestamp: Date.now(),
                        crowd: globalCrowdLevel,
                        busNo: globalBusNo,
                        routeId: busId
                    }).catch(e => console.log("Firebase Write Error:", e));
                },
                (err) => console.log("Seeder GPS Error:", err),
                { enableHighAccuracy: false, timeout: 15000, maximumAge: 1000 }
            );
            await sleep(delay);
        }
    });
};

const bgOptions: any = {
    taskName: 'BusTrackerSeeder',
    taskTitle: 'Broadcasting Live GPS',
    taskDesc: 'Your bus location is currently being shared with students.',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#147C41',
    parameters: {
        delay: 5000,
    },
    foregroundServiceType: ['location'], // REQUIRED for Android 14+
};

// Global variables to persist selection across component unmounts
let globalSelectedRoute: string | null = null;
let globalCrowdLevel: string = 'Empty';
let globalBusNo: string = '';
let globalSessionId: string = Math.random().toString(36).substring(2, 8);

const CROWD_LEVELS = [
  { id: 'Empty', color: '#147C41' },
  { id: 'Half Full', color: '#EAB308' },
  { id: 'Packed', color: '#C41E3A' }
];

const SeederScreen = ({ onBack, isDarkMode, setIsDarkMode }: { onBack?: () => void, isDarkMode?: boolean, setIsDarkMode?: (val: boolean) => void }) => {
  const insets = useSafeAreaInsets();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(globalSelectedRoute);
  const [crowdLevel, setCrowdLevel] = useState<string>(globalCrowdLevel);
  const [busNo, setBusNo] = useState<string>(globalBusNo);
  const [isBroadcasting, setIsBroadcasting] = useState(BackgroundJob.isRunning() && globalSelectedRoute !== null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const isReady = selectedRoute !== null || isBroadcasting;

  useEffect(() => {
    if (isBroadcasting) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isBroadcasting, pulseAnim]);

  const toggleBroadcast = async () => {
    if (isReady) {
      if (isBroadcasting) {
        setIsBroadcasting(false);
        await BackgroundJob.stop();
        if (selectedRoute) {
            remove(ref(database, `buses/${selectedRoute}_${globalSessionId}`)).catch(e => console.log(e));
        }
      } else {
        // Generate a new unique session ID each time we start broadcasting
        globalSessionId = Math.random().toString(36).substring(2, 8);
        if (Platform.OS === 'android') {
            try {
                let permissionsToRequest = [
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
                ];
                if (Platform.Version >= 33) {
                    permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
                }
                await PermissionsAndroid.requestMultiple(permissionsToRequest);
            } catch (e) {
                console.warn(e);
            }
            
            // Verify if permission was actually granted
            const hasLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) || await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
            if (!hasLocation) {
                alert("Location permission is required to broadcast.");
                return;
            }
        }
        
        setIsBroadcasting(true);
        try {
            await BackgroundJob.stop(); // Stop passenger tracker or old broadcasts
            
            // Automatically remove this seeder's node if the connection drops or app force-closes
            const busRef = ref(database, `buses/${selectedRoute}_${globalSessionId}`);
            onDisconnect(busRef).remove();

            await BackgroundJob.start(backgroundTask, { 
              ...bgOptions, 
              parameters: { delay: 5000, busId: selectedRoute } 
            });
        } catch (e) {
            console.log("Background job failed to start", e);
        }
      }
    }
  };

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-slate-900' : 'bg-[#FCFBF8]'}`} style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent={true} />

      {/* Header */}
      <Header 
        title="Share Live Location"
        onBack={onBack}
        isDarkMode={isDarkMode}
        transparentBackground={true}
        rightAction={setIsDarkMode ? <ThemeToggle isDarkMode={!!isDarkMode} onToggle={setIsDarkMode} /> : undefined}
      />

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>

        {/* Route Selection Area */}
        <View className="mb-12">
          <Text className={`text-xs font-bold uppercase tracking-widest mb-4 ml-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Select Route</Text>
          <View className="flex-row flex-wrap gap-3">
            {ROUTES.map((route) => (
              <TouchableOpacity
                key={route.id}
                disabled={isBroadcasting}
                onPress={() => {
                  setSelectedRoute(route.id);
                  globalSelectedRoute = route.id;
                  if (!isBroadcasting) {
                    const defaultBusNo = (route as any).busNo || '';
                    setBusNo(defaultBusNo);
                    globalBusNo = defaultBusNo;
                  }
                }}
                className={`px-5 py-3 rounded-xl border shadow-sm ${
                  selectedRoute === route.id 
                    ? (isDarkMode ? 'bg-[#064E3B] border-[#147C41]' : 'bg-[#F0FDF4] border-[#147C41]')
                    : (isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200')
                } ${isBroadcasting ? 'opacity-50' : 'opacity-100'}`}
              >
                <Text className={`font-bold tracking-wide ${
                  selectedRoute === route.id ? (isDarkMode ? 'text-[#34D399]' : 'text-[#147C41]') : (isDarkMode ? 'text-slate-300' : 'text-slate-600')
                }`}>
                  {route.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Crowding Selection Area */}
        <View className="mb-12">
          <Text className={`text-xs font-bold uppercase tracking-widest mb-4 ml-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>How full is the bus?</Text>
          <View className="flex-row gap-3">
            {CROWD_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.id}
                onPress={() => {
                  setCrowdLevel(level.id);
                  globalCrowdLevel = level.id;
                  if (isBroadcasting && selectedRoute) {
                    update(ref(database, `buses/${selectedRoute}_${globalSessionId}`), {
                      crowd: level.id,
                      timestamp: Date.now()
                    }).catch(e => console.log("Firebase Update Error:", e));
                  }
                }}
                className="flex-1 py-4 rounded-xl items-center border"
                style={{
                  backgroundColor: crowdLevel === level.id ? level.color : (isDarkMode ? '#1E293B' : 'white'),
                  borderColor: crowdLevel === level.id ? level.color : (isDarkMode ? '#334155' : '#E2E8F0'),
                  elevation: crowdLevel === level.id ? 2 : 0
                }}
              >
                <Text style={{
                  color: crowdLevel === level.id ? 'white' : (isDarkMode ? '#94A3B8' : '#64748B'),
                  fontWeight: 'bold',
                  fontSize: 14
                }}>
                  {level.id}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text className={`text-xs mt-3 italic text-center ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>You can change this at any time while broadcasting.</Text>
        </View>

        {/* Bus Number Selection Area */}
        <View className="mb-12">
          <Text className={`text-xs font-bold uppercase tracking-widest mb-4 ml-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Bus Number</Text>
          <import_react_native.TextInput
            value={busNo}
            onChangeText={(t) => {
              setBusNo(t);
              globalBusNo = t;
            }}
            placeholder="e.g. 26"
            placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
            keyboardType="numeric"
            className={`border font-bold text-xl px-5 py-4 rounded-xl ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
          />
          <Text className={`text-xs mt-3 italic ml-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>We automatically fill this when you pick a route, but you can change it if you are driving a different bus.</Text>
        </View>

        {/* Broadcast Toggle Button */}
        <Button 
          title={!isReady ? 'Select a Route' : isBroadcasting ? 'Stop Broadcasting' : 'Start Broadcasting'}
          onPress={toggleBroadcast}
          disabled={!isReady}
          variant={isBroadcasting ? 'danger' : 'primary'}
          size="large"
        />

        <View className="h-32" />
      </ScrollView>

      {/* Live Status Indicator (Absolute Positioned at Bottom) */}
      {isBroadcasting && (
        <View className="absolute bottom-10 left-6 right-6">
          <View className={`p-5 rounded-3xl shadow-lg border flex-row items-center ${isDarkMode ? 'bg-slate-800 border-red-900/30' : 'bg-white border-red-100'}`} style={{ elevation: 10 }}>
            {/* Pulsing Red Dot */}
            <View className="relative w-4 h-4 mr-4 items-center justify-center">
              <Animated.View 
                className="absolute w-full h-full bg-[#C41E3A] rounded-full" 
                style={{ 
                  transform: [{ scale: 1.5 }],
                  opacity: pulseAnim 
                }} 
              />
              <View className="absolute w-2 h-2 bg-[#C41E3A] rounded-full" />
            </View>
            
            <View className="flex-1">
              <Text className="text-[10px] font-bold text-[#C41E3A] uppercase tracking-widest mb-1">Live Status</Text>
              <Text className={`font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Broadcasting GPS for <Text className="text-[#147C41]">{ROUTES.find(r => r.id === selectedRoute)?.name || "Active Route"}</Text></Text>
            </View>
          </View>
        </View>
      )}

    </View>
  );
};

export default SeederScreen;
