import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StatusBar, PermissionsAndroid, Platform, Animated, PanResponder } from 'react-native';
import { WebView } from 'react-native-webview';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import BackgroundJob from 'react-native-background-actions';

const sleep = (time: any) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));

// Standard Haversine formula to calculate distance in meters between two coordinates
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

const getUserLocation = () => new Promise<{lat: number, lng: number}>((resolve) => {
    Geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => resolve({ lat: 23.8815, lng: 90.3888 }), // fallback to campus
        { timeout: 3000, maximumAge: 10000, enableHighAccuracy: false }
    );
});

import { ref, onValue, remove, runTransaction } from 'firebase/database';
import { database } from '../firebaseConfig';
import { ROUTES } from '../data/routes';
import Header from '../components/Header';
import ThemeToggle from '../components/ThemeToggle';

const passengerBgTask = async (taskDataArguments: any) => {
    const { delay } = taskDataArguments;
    let alertedBuses = new Set<string>();

    await new Promise(async (resolve) => {
        // Create an active listener for Firebase real-time data
        let liveBuses: Record<string, { lat: number, lng: number }> = {};
        const unsubscribe = onValue(ref(database, 'buses'), (snapshot) => {
            if (snapshot.exists()) {
                liveBuses = snapshot.val();
            }
        });

        for (let i = 0; BackgroundJob.isRunning(); i++) {
            
            // 1. Fetch live GPS silently in background, fallback if no signal
            const userLoc = await getUserLocation();
            const userLat = userLoc.lat;
            const userLng = userLoc.lng;
            
            for (const [busName, bus] of Object.entries(liveBuses)) {
                const distance = getDistance(userLat, userLng, bus.lat, bus.lng);
                
                if (distance <= 800 && !alertedBuses.has(busName)) {
                    alertedBuses.add(busName);
                    // 2. Fire Push Notification directly from Native Headless JS Thread
                    try {
                        const channelId = await notifee.createChannel({
                            id: 'bus-alerts-bg',
                            name: 'Bus Arrival Alerts',
                            importance: AndroidImportance.HIGH,
                        });
                        const actualRouteId = (bus as any).routeId || busName;
                        const routeObj = ROUTES.find(r => r.id === actualRouteId);
                        const displayRouteName = routeObj ? routeObj.name : actualRouteId;
                        const displayBusNo = (bus as any).busNo || actualRouteId;

                        await notifee.displayNotification({
                            title: "Bus Approaching! 🚌",
                            body: `Bus ${displayBusNo} is less than 800m away! Get ready.`,
                            android: {
                                channelId,
                                color: '#147C41',
                                pressAction: { id: 'default' },
                            }
                        });
                        await sleep(1000); // Wait 1s between push notifications to prevent Android tray stutter
                    } catch (e) { console.warn("Notifee error:", e); }
                }
            }

            await sleep(delay);
        }
        
        unsubscribe(); // Cleanup listener when job is stopped
    });
};

const passengerBgOptions: any = {
    taskName: 'PassengerTracker',
    taskTitle: 'Tracking Approaching Buses',
    taskDesc: 'We will notify you when a bus gets close.',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#147C41',
    parameters: {
        delay: 5000,
    },
    foregroundServiceType: ['location'], 
};

const MapScreen = ({ onBack, isDarkMode, setIsDarkMode, selectedRouteId }: { onBack?: () => void, isDarkMode: boolean, setIsDarkMode: (val: boolean) => void, selectedRouteId?: string | null }) => {
  const insets = useSafeAreaInsets();
  const [userLocation, setUserLocation] = useState<[number, number]>([23.8815, 90.3888]); // Default to campus
  
  const [selectedBus, setSelectedBus] = useState({
    route: 'Tap a bus on the map',
    bus: '--',
    time: '-- min away'
  });
  const [isMapReady, setIsMapReady] = useState(false);
  const [latestBuses, setLatestBuses] = useState<any>(null);
  const webviewRef = useRef<WebView>(null);

  // In-App Notification state
  const [notification, setNotification] = useState<{title: string, message: string} | null>(null);
  const notificationAnim = useRef(new Animated.Value(-150)).current;
  const notifiedBuses = useRef(new Set<string>());
  const isShowingNotification = useRef(false);
  const notificationQueue = useRef<{title: string, message: string}[]>([]);

  const processQueue = () => {
    if (isShowingNotification.current || notificationQueue.current.length === 0) return;
    
    isShowingNotification.current = true;
    const nextNotif = notificationQueue.current.shift();
    if (!nextNotif) return;

    setNotification(nextNotif);
    
    Animated.sequence([
      Animated.spring(notificationAnim, { toValue: 0, friction: 6, useNativeDriver: true }),
      Animated.delay(3000),
      Animated.timing(notificationAnim, { toValue: -150, duration: 300, useNativeDriver: true })
    ]).start(() => {
        isShowingNotification.current = false;
        if (notificationQueue.current.length > 0) {
            setTimeout(processQueue, 500); // Wait 500ms before sliding down the next one
        }
    });
  };

  const showNotification = (title: string, message: string) => {
    notificationQueue.current.push({ title, message });
    processQueue();
  };

  const dismissNotification = () => {
    notificationAnim.stopAnimation();
    Animated.timing(notificationAnim, { 
      toValue: -150, 
      duration: 200, 
      useNativeDriver: true 
    }).start(() => {
        isShowingNotification.current = false;
        setNotification(null);
        if (notificationQueue.current.length > 0) {
            setTimeout(processQueue, 500);
        }
    });
  };

  const reportBus = async (busName: string) => {
    if (busName === '--' || !busName) return;
    
    // Increment the report counter in Firebase
    try {
        await runTransaction(ref(database, `buses/${busName}`), (busData) => {
            if (busData) {
                if (!busData.reports) busData.reports = 0;
                busData.reports += 1;
            }
            return busData;
        });
        showNotification("Bus Reported 🚩", "Thank you! If this bus receives 3 reports, it will be automatically removed from the map.");
    } catch (e) {
        console.warn("Report error", e);
    }
  };

  // Toggle Dark Mode
  useEffect(() => {
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(`
        if (typeof setTheme === 'function') {
          setTheme(${isDarkMode});
        }
        true;
      `);
    }
  }, [isDarkMode]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy < -10) { // Detect Swipe Up
          dismissNotification();
        }
      },
    })
  ).current;

  useEffect(() => {
    const getLocation = () => {
      Geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation([lat, lng]);
          
          if (webviewRef.current) {
            webviewRef.current.injectJavaScript(`
              if (typeof updateLocation === 'function') {
                updateLocation(${lat}, ${lng});
              }
              true;
            `);
          }
        },
        (error) => console.log('Location Error:', error.code, error.message),
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      );
    };

    const initializeTracking = async () => {
      // 1. Request Location Permission first
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ]);
          if (
            granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED ||
            granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
          ) {
            getLocation();
          }
        } catch (err) { console.warn(err); }
      } else {
        getLocation();
      }

      // 2. Request Notification Permission
      try {
        await notifee.requestPermission();
      } catch (e) { console.warn("Notifee permission err", e); }

      // 3. Start Background Job securely now that we have permissions
      try {
        if (Platform.OS === 'android') {
            const hasLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) || await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
            if (!hasLocation) {
                console.log("Location permission denied. Cannot start background tracker.");
                return;
            }
        }

        if (!BackgroundJob.isRunning()) {
          await BackgroundJob.start(passengerBgTask, passengerBgOptions);
        } else {
          console.log("Another background task is running (likely Driver Broadcast). Keeping it alive.");
        }
      } catch (e) {
        console.warn("Could not start background tracking", e);
      }
    };

    initializeTracking();

    // Firebase Listener to update the map dynamically and self-clean the database
    const unsubscribeBuses = onValue(ref(database, 'buses'), (snapshot) => {
      if (snapshot.exists() && webviewRef.current) {
        const buses = snapshot.val();
        const now = Date.now();
        const twoHours = 2 * 60 * 60 * 1000;
        
        // Secure approach: The client never deletes from the database.
        // It simply filters out stale buses locally before showing them on the map.
        // We also filter out any buses that have been reported as fake data >= 3 times!
        for (const busName in buses) {
            const bus = buses[busName];
            if ((bus.timestamp && (now - bus.timestamp > twoHours)) || (bus.reports && bus.reports >= 3)) {
                // Delete locally so it vanishes from the map, but leave the database untouched
                delete buses[busName]; 
            } else if (selectedRouteId && (bus.routeId || busName) !== selectedRouteId) {
                // Filter out buses that don't match the selected route
                delete buses[busName];
            }
        }

        setLatestBuses(buses);
      }
    });

    return () => unsubscribeBuses();
  }, []);

  // Safely inject buses into the webview only when both the map is ready and we have data
  useEffect(() => {
    if (isMapReady && latestBuses && webviewRef.current) {
        let extraJS = "";
        if (selectedRouteId) {
            const busName = Object.keys(latestBuses).find(key => {
                const b = latestBuses[key];
                return (b.routeId || key) === selectedRouteId;
            });
            if (busName) {
                const routeName = ROUTES.find(r => r.id === selectedRouteId)?.name || selectedRouteId;
                extraJS = `
                    setTimeout(function() {
                        if (window.busMarkers && window.busMarkers['${busName}']) {
                            showRouteForBus(window.busMarkers['${busName}'], '${busName}', '${routeName}');
                        }
                    }, 500);
                `;
            }
        }

        webviewRef.current.injectJavaScript(`
          if (typeof updateFirebaseBuses === 'function') {
            updateFirebaseBuses(${JSON.stringify(latestBuses)});
          }
          if (typeof setRoutesData === 'function') {
            setRoutesData(${JSON.stringify(ROUTES)});
          }
          ${extraJS}
          true;
        `);
    }
  }, [isMapReady, latestBuses, selectedRouteId]);

  const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>
        <style>
            body { padding: 0; margin: 0; background-color: #FEFDF5; }
            html, body, #map { height: 100%; width: 100%; }
            
            .bus-icon {
                font-family: 'Inter', sans-serif;
                background: transparent;
                border: none;
                transition: transform 5s linear; /* Hardware accelerated smooth interpolation! */
            }
            .student-icon {
                background-color: white;
                border-radius: 50%;
                border: 3px solid #C41E3A;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 20px;
                box-shadow: 0px 4px 10px rgba(0,0,0,0.3);
            }
            
            /* Custom Zoom Control Styling */
            .leaflet-control-zoom {
                border: none !important;
                box-shadow: 0px 4px 15px rgba(0,0,0,0.15) !important;
                border-radius: 12px !important;
                overflow: hidden;
            }
            .leaflet-control-zoom-in, .leaflet-control-zoom-out {
                width: 46px !important;
                height: 46px !important;
                line-height: 46px !important;
                color: #147C41 !important;
                font-size: 24px !important;
                font-weight: bold !important;
                background-color: white !important;
            }
            /* Push the controls up so they don't hide behind our React Native info card */
            .leaflet-bottom.leaflet-right {
                margin-bottom: 200px !important; 
                margin-right: 15px !important;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            var initialLoc = [${userLocation[0]}, ${userLocation[1]}];
            var map = L.map('map', { zoomControl: false, attributionControl: false }).setView(initialLoc, 15);
            
            map.on('click', function() {
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'BUS_DESELECTED' }));
                }
                if (activeRouteLine) {
                    map.removeLayer(activeRouteLine);
                    activeRouteLine = null;
                }
                if (activeBusMarker) {
                    activeBusMarker.closePopup();
                    activeBusMarker = null;
                }
                if (etaInterval) {
                    clearInterval(etaInterval);
                    etaInterval = null;
                }
            });

            
            // Add custom styled zoom controls to the bottom right
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            var activeTileLayer = null;
            function setTheme(isDark) {
                if (activeTileLayer) map.removeLayer(activeTileLayer);
                var url = isDark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
                activeTileLayer = L.tileLayer(url, {}).addTo(map);
                document.body.style.backgroundColor = isDark ? '#111' : '#f5f5f5';
            }
            // Initialize with the React Native state
            setTheme(${isDarkMode});

            // Calculate bearing between two coordinates
            function getBearing(lat1, lon1, lat2, lon2) {
                var dLon = (lon2 - lon1) * Math.PI / 180;
                lat1 = lat1 * Math.PI / 180;
                lat2 = lat2 * Math.PI / 180;
                var y = Math.sin(dLon) * Math.cos(lat2);
                var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
                var brng = Math.atan2(y, x);
                return ((brng * 180 / Math.PI) + 360) % 360;
            }

            var allRoutes = [];
            window.setRoutesData = function(rData) {
                allRoutes = rData;
            }

            function createBusIcon(busNo, crowdLevel, heading) {
                var cColor = '#147C41'; // Default Green (Empty)
                var glowColor = 'rgba(20, 124, 65, 0.4)';
                if (crowdLevel === 'Half Full') {
                    cColor = '#EAB308'; // Yellow
                    glowColor = 'rgba(234, 179, 8, 0.4)';
                }
                if (crowdLevel === 'Packed') {
                    cColor = '#C41E3A'; // Red
                    glowColor = 'rgba(196, 30, 58, 0.4)';
                }

                // If busNo is missing or not provided, fallback to a dash
                var displayBusNo = busNo || '--';
                var rot = heading || 0;

                var innerHtml = \`
                    <div style="
                        width: 32px;
                        height: 76px;
                        transform: rotate(\${rot}deg);
                        transition: transform 1s ease-in-out;
                        transform-origin: center center;
                    ">
                        <svg viewBox="0 0 100 240" style="width: 100%; height: 100%; filter: drop-shadow(0px 8px 12px \${glowColor});">
                           <defs>
                              <linearGradient id="busGrad-\${busNo}" x1="0" y1="0" x2="1" y2="0">
                                 <stop offset="0%" stop-color="\${cColor}" />
                                 <stop offset="100%" stop-color="\${cColor}" style="stop-opacity:0.8" />
                              </linearGradient>
                           </defs>
                           
                           <!-- Bus Chassis -->
                           <rect x="5" y="5" width="90" height="230" rx="20" fill="url(#busGrad-\${busNo})" stroke="#ffffff" stroke-width="4"/>
                           
                           <!-- Front Bumper -->
                           <rect x="20" y="2" width="60" height="10" rx="3" fill="#94A3B8"/>
                           <!-- Rear Bumper -->
                           <rect x="20" y="228" width="60" height="10" rx="3" fill="#94A3B8"/>
                           
                           <!-- Front Windshield -->
                           <path d="M 15 25 Q 50 15 85 25 L 85 50 L 15 50 Z" fill="#0F172A"/>
                           
                           <!-- Rear Windshield -->
                           <rect x="15" y="210" width="70" height="15" rx="5" fill="#0F172A"/>
                           
                           <!-- Side Windows -->
                           <rect x="5" y="65" width="6" height="135" fill="#0F172A"/>
                           <rect x="89" y="65" width="6" height="135" fill="#0F172A"/>
                           
                           <!-- Roof Details (AC) -->
                           <rect x="30" y="70" width="40" height="30" rx="5" fill="#F1F5F9" opacity="0.9"/>
                           <rect x="30" y="160" width="40" height="30" rx="5" fill="#F1F5F9" opacity="0.9"/>
                           
                           <!-- Bus Number -->
                           <text x="50" y="130" font-family="sans-serif" font-weight="900" font-size="44" fill="white" text-anchor="middle" dominant-baseline="central">\${displayBusNo}</text>
                        </svg>
                    </div>
                \`;

                return L.divIcon({ 
                    html: innerHtml, 
                    className: 'bus-icon', 
                    iconSize: [32, 76], 
                    iconAnchor: [16, 38] 
                });
            }

            var studentIcon = L.divIcon({ html: '👤', className: 'student-icon', iconSize: [40, 40], iconAnchor: [20, 20] });
            var studentMarker = L.marker(initialLoc, {icon: studentIcon}).addTo(map).bindPopup("You are here");

            var activeBusMarker = null;
            var activeRouteLine = null;
            var tempRoutingControl = null;
            var etaInterval = null;
            var currentBusName = "";
            var currentRouteName = "";

            function fetchRouteAndEta() {
                if (tempRoutingControl) {
                    map.removeControl(tempRoutingControl);
                }

                var now = new Date();
                var currentHour = now.getHours();
                // From 6 AM to 1 PM (13:00), buses head TO campus. 
                // After 1 PM, they head FROM campus back to the city.
                var isHeadingToCampus = currentHour >= 6 && currentHour < 13;
                var campusLoc = L.latLng(23.8815, 90.3888);
                var busLoc = activeBusMarker.getLatLng();
                
                var waypointsToRoute = isHeadingToCampus ? [busLoc, campusLoc] : [campusLoc, busLoc];

                tempRoutingControl = L.Routing.control({
                    waypoints: waypointsToRoute,
                    addWaypoints: false,
                    show: false,
                    createMarker: function() { return null; },
                    fitSelectedRoutes: false
                }).addTo(map);

                tempRoutingControl.on('routesfound', function(e) {
                    var route = e.routes[0];
                    var coordinates = route.coordinates;
                    
                    if (activeRouteLine) {
                        map.removeLayer(activeRouteLine);
                    }
                    
                    // Highlight the actual bus route!
                    activeRouteLine = L.polyline(coordinates, { color: '#147C41', opacity: 0.8, weight: 6 }).addTo(map);
                    
                    var realEtaMinutes = Math.round(route.summary.totalTime / 60);
                    var etaText = isHeadingToCampus ? realEtaMinutes + " min to Campus" : realEtaMinutes + " min from Campus";

                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'BUS_SELECTED',
                            payload: {
                                bus: currentBusName,
                                route: currentRouteName,
                                time: etaText
                            }
                        }));
                    }

                    map.removeControl(tempRoutingControl);
                    tempRoutingControl = null;
                });
            }

            function showRouteForBus(busMarker, busName, routeName) {
                activeBusMarker = busMarker;
                currentBusName = busName;
                currentRouteName = routeName;

                // Send initial data to React Native (Calculating ETA...)
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'BUS_SELECTED',
                        payload: {
                            bus: busName,
                            route: routeName,
                            time: "Calculating..."
                        }
                    }));
                }

                // Perform the initial calculation immediately
                fetchRouteAndEta();

                // Clear any existing interval
                if (etaInterval) {
                    clearInterval(etaInterval);
                }

                // Set up a loop to recalculate the actual road route and ETA every 60 seconds (60000 ms)
                etaInterval = setInterval(fetchRouteAndEta, 60000);

                busMarker.bindPopup("<b>" + busName + "</b><br>Route mapped!").openPopup();
                map.panTo(busMarker.getLatLng(), { animate: true });
            }

            // Firebase marker management
            window.busMarkers = {};
            window.busHeadings = {};

            window.updateFirebaseBuses = function(buses) {
                var uLoc = studentMarker.getLatLng();
                var distancesPayload = [];

                // Remove markers that are no longer in the Firebase buses object (e.g. seeder stopped)
                for (let existingBusName in window.busMarkers) {
                    if (!buses[existingBusName]) {
                        map.removeLayer(window.busMarkers[existingBusName]);
                        delete window.busMarkers[existingBusName];
                        delete window.busHeadings[existingBusName];
                        
                        // Clear active routing if the selected bus vanished
                        if (currentBusName === existingBusName) {
                            if (activeRouteLine) {
                                map.removeLayer(activeRouteLine);
                                activeRouteLine = null;
                            }
                            if (etaInterval) {
                                clearInterval(etaInterval);
                                etaInterval = null;
                            }
                            if (window.ReactNativeWebView) {
                                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'BUS_DESELECTED' }));
                            }
                            activeBusMarker = null;
                            currentBusName = "";
                        }
                    }
                }

                for (let busName in buses) {
                    let b = buses[busName];
                    let actualRouteId = b.routeId || busName;
                    
                    // Extract bus number to create a unique, deterministic angle for overlapping buses
                    let busNumVal = parseInt(b.busNo) || parseInt(actualRouteId.replace('Bus ', '')) || parseInt(busName) || 0;
                    // Multiply by a large prime-like fraction so consecutive buses aren't next to each other
                    let angleOffset = busNumVal * 2.4; 
                    let radius = 0.0004; // ~40 meters fan-out radius
                    
                    let jitterLat = Math.sin(angleOffset) * radius;
                    let jitterLng = Math.cos(angleOffset) * radius;
                    
                    let newLoc = [b.lat + jitterLat, b.lng + jitterLng];
                    let heading = window.busHeadings[busName] || 0;

                    if (window.busMarkers[busName]) {
                        let oldLoc = window.busMarkers[busName].getLatLng();
                        
                        // Calculate heading if the bus has moved significantly
                        if (Math.abs(oldLoc.lat - newLoc[0]) > 0.00005 || Math.abs(oldLoc.lng - newLoc[1]) > 0.00005) {
                            heading = getBearing(oldLoc.lat, oldLoc.lng, newLoc[0], newLoc[1]);
                            window.busHeadings[busName] = heading;
                        }

                        // Move existing marker smoothly and update its crowd color and rotation
                        window.busMarkers[busName].setLatLng(newLoc);
                        window.busMarkers[busName].setIcon(createBusIcon(b.busNo || actualRouteId, b.crowd, heading));
                    } else {
                        // Create new marker
                        let marker = L.marker(newLoc, { icon: createBusIcon(b.busNo || actualRouteId, b.crowd, heading) }).addTo(map);
                        
                        let rName = "Route";
                        let routeObj = allRoutes.find(r => r.id === actualRouteId);
                        if (routeObj) rName = routeObj.name;
                        
                        let displayBusNo = b.busNo || actualRouteId;
                        marker.on('click', function() { 
                            showRouteForBus(marker, displayBusNo, rName); 
                        });
                        window.busMarkers[busName] = marker;
                    }

                    // Smoothly stretch the active route line to stay attached to the moving bus
                    if (activeBusMarker === window.busMarkers[busName]) {
                        if (activeRouteLine) {
                            var latlngs = activeRouteLine.getLatLngs();
                            var busLoc = window.busMarkers[busName].getLatLng();
                            // Determine which end of the route is closer to the bus
                            var distToStart = busLoc.distanceTo(latlngs[0]);
                            var distToEnd = busLoc.distanceTo(latlngs[latlngs.length - 1]);
                            
                            if (distToStart < distToEnd) {
                                latlngs[0] = busLoc;
                            } else {
                                latlngs[latlngs.length - 1] = busLoc;
                            }
                            activeRouteLine.setLatLngs(latlngs);
                        }
                        // Make the map follow the bus!
                        map.panTo(newLoc, { animate: true, duration: 1.0 });
                    }

                    // Calculate distance to trigger React Native In-App Banner
                    var dist = map.distance(window.busMarkers[busName].getLatLng(), uLoc);
                    distancesPayload.push({ name: busName, distance: dist, busNo: b.busNo || actualRouteId });
                }

                if (window.ReactNativeWebView && distancesPayload.length > 0) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'BUSES_DISTANCE_UPDATE',
                        payload: distancesPayload
                    }));
                }
            };

            // Function to dynamically update location when React Native fetches it natively
            window.updateLocation = function(lat, lng) {
                var newLoc = [lat, lng];
                map.setView(newLoc, 15);
                studentMarker.setLatLng(newLoc);

                if (activeRouteLine) {
                    var latlngs = activeRouteLine.getLatLngs();
                    latlngs[latlngs.length - 1] = L.latLng(lat, lng);
                    activeRouteLine.setLatLngs(latlngs);
                }
            };

            // Signal to React Native that the map is fully loaded and ready to receive buses
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MAP_READY' }));
            }
        </script>
    </body>
    </html>
  `;

  return (
    <View className="flex-1 bg-[#FCFBF8]">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      {/* In-App Notification Banner */}
      <Animated.View 
        {...panResponder.panHandlers}
        className="absolute left-4 right-4 z-50 bg-[#147C41] rounded-2xl shadow-lg flex-row items-center p-4 border-2 border-[#1A9A52]"
        style={{ 
          top: insets.top + 10,
          transform: [{ translateY: notificationAnim }],
          elevation: 10
        }}
      >
        <View className="w-12 h-12 bg-slate-800/20 rounded-full items-center justify-center mr-4">
          <Text className="text-2xl">🚌</Text>
        </View>
        <View className="flex-1">
          <Text className="text-white font-bold text-lg">{notification?.title || "Notification"}</Text>
          <Text className="text-white/90 text-sm mt-1 leading-tight">{notification?.message}</Text>
        </View>
        <TouchableOpacity onPress={dismissNotification} className="ml-2 px-2 py-1 bg-slate-800/10 rounded-full">
            <Text className="text-white text-xs font-bold uppercase tracking-wider">Close</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Header Overlay */}
      <Header 
        title="Live Tracking"
        onBack={onBack}
        isDarkMode={isDarkMode}
        absolutePosition={true}
        rightAction={<ThemeToggle isDarkMode={isDarkMode} onToggle={setIsDarkMode} />}
      />

      {/* Leaflet Map */}
      <View className="flex-1">
        <WebView 
          ref={webviewRef}
          originWhitelist={['*']}
          source={{ html: leafletHTML, baseUrl: 'https://localhost' }}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          setBuiltInZoomControls={true}
          setDisplayZoomControls={false}
          scalesPageToFit={false}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'MAP_READY') {
                setIsMapReady(true);
              } else if (data.type === 'BUS_SELECTED') {
                setSelectedBus(data.payload);
              } else if (data.type === 'BUS_DESELECTED') {
                setSelectedBus({ route: 'Tap a bus on the map', bus: '--', time: '-- min away' });
              } else if (data.type === 'BUSES_DISTANCE_UPDATE') {
                // We use this to show the in-app banner ONLY. Background push notifications are 
                // now securely handled by the Headless JS passengerBgTask!
                data.payload.forEach((bus: any) => {
                    if (bus.distance <= 800 && !notifiedBuses.current.has(bus.name)) {
                        notifiedBuses.current.add(bus.name);
                        // Only show in-app banner. System push is handled by Headless JS!
                        showNotification("Bus Approaching! 🚌", `Bus ${bus.busNo} is less than 800m away! Get ready.`);
                    }
                });
              }
            } catch (e) {
              console.log("Error parsing message from webview", e);
            }
          }}
        />
      </View>
      
      {/* Live Info Card (Bottom) */}
      {selectedBus.bus !== '--' && (
        <View className={"absolute bottom-6 left-6 right-6 p-5 rounded-3xl shadow-lg border " + (isDarkMode ? "bg-slate-800 border-slate-700/50" : "bg-white border-slate-200")} style={{ elevation: 8, paddingBottom: 20 + insets.bottom }}>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className={"text-sm font-bold uppercase tracking-widest mb-1 " + (isDarkMode ? "text-slate-400" : "text-slate-500")}>{
                ROUTES.find(r => r.id === selectedBus.route)?.name || selectedBus.route
              }</Text>
              <Text className={"text-xl font-bold " + (isDarkMode ? "text-slate-100" : "text-slate-800")}>{selectedBus.bus}</Text>
            </View>
            <View className="bg-[#147C41]/10 px-4 py-2 rounded-full border border-[#147C41]/20">
              <Text className="text-[#147C41] font-bold tracking-wide">{selectedBus.time}</Text>
            </View>
          </View>

          <TouchableOpacity 
            onPress={() => reportBus(selectedBus.bus)}
            className={"mt-4 pt-4 border-t flex-row items-center justify-center " + (isDarkMode ? "border-slate-700/50" : "border-slate-200")}
          >
            <Text className="text-red-500 font-bold tracking-wide">🚩 Report Fake Data</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MapScreen;
