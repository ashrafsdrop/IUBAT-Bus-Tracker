import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, LayoutAnimation, Platform, UIManager, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ROUTES } from '../data/routes';
import Header from '../components/Header';
import Button from '../components/Button';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SelectionScreen = ({ onBack, onNavigate }: { onBack?: () => void, onNavigate?: (screen: string) => void }) => {
  const insets = useSafeAreaInsets();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoutes = useMemo(() => {
    if (!searchQuery.trim()) return ROUTES;
    const query = searchQuery.toLowerCase().trim();
    return ROUTES.filter(route => 
      route.name.toLowerCase().includes(query) || 
      route.stops.some(stop => stop.name.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const handleRouteSelect = (routeId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedRoute(routeId);
    setExpandedRoute(expandedRoute === routeId ? null : routeId);
  };

  const isContinueEnabled = selectedRoute !== null;

  return (
    <View className="flex-1 bg-[#FCFBF8]" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      {/* Header */}
      <Header 
        title="Select Your Route"
        onBack={onBack}
        transparentBackground={true}
      />

      <View className="px-4 py-2 z-10">
        <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm" style={{ elevation: 2 }}>
          <Text className="text-lg mr-3">🔍</Text>
          <TextInput
            className="flex-1 text-base font-medium text-slate-800 p-0"
            placeholder="Search destination (e.g. Uttara)"
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2">
              <Text className="text-slate-400 text-lg font-bold">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={false}>
        
        <View className="mb-8">
          <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">
            Available Routes
          </Text>
          <View>
            {filteredRoutes.length === 0 ? (
              <View className="items-center py-10">
                <Text className="text-4xl mb-4">🗺️</Text>
                <Text className="text-lg font-bold text-slate-600">No routes found</Text>
                <Text className="text-sm text-slate-400 text-center mt-2 px-6">
                  We couldn't find any bus route stopping at "{searchQuery}".
                </Text>
              </View>
            ) : (
              filteredRoutes.map((route) => {
              const isSelected = selectedRoute === route.id;
              const isExpanded = expandedRoute === route.id;
              const firstStop = route.stops[0];
              const lastStop = route.stops[route.stops.length - 1];

              return (
                <View key={route.id} className="mb-3">
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => handleRouteSelect(route.id)}
                    className={`p-4 border-2 z-10 ${
                      isSelected ? 'border-[#147C41] bg-[#F0FDF4]' : 'border-transparent bg-white'
                    } ${isExpanded ? 'rounded-t-2xl border-b-0' : 'rounded-2xl shadow-sm'}`}
                    style={!isExpanded ? { elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 } : {}}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 pr-4">
                        <Text className={`text-base font-bold ${isSelected ? 'text-[#147C41]' : 'text-slate-800'}`}>
                          {route.name}
                        </Text>
                        
                        <View className="flex-row flex-wrap mt-2 gap-2">
                           <View className="bg-slate-100 px-2 py-1 rounded flex-row items-center">
                             <Text className="text-xs text-slate-600 font-semibold tracking-wide">📍 {route.stops.length} Stops</Text>
                           </View>
                           <View className="bg-slate-100 px-2 py-1 rounded flex-row items-center">
                             <Text className="text-xs text-slate-600 font-semibold tracking-wide">⏰ {firstStop.time}</Text>
                           </View>
                        </View>
                      </View>
                      <View className={`w-6 h-6 rounded-full border-2 mt-1 items-center justify-center ${
                        isSelected ? 'border-[#147C41]' : 'border-slate-300'
                      }`}>
                        {isSelected && <View className="w-3 h-3 rounded-full bg-[#147C41]" />}
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Expandable Stops Timeline */}
                  {isExpanded && (
                    <View className={`bg-white px-4 py-4 rounded-b-2xl border-2 border-t-0 ${isSelected ? 'border-[#147C41]' : 'border-slate-100'}`}>
                      <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 mt-2">Route Schedule</Text>
                      {route.stops.map((stop, index) => {
                        const isFirst = index === 0;
                        const isLast = index === route.stops.length - 1;
                        return (
                          <View key={index} className="flex-row mb-1">
                            {/* Time */}
                            <View className="w-16 pt-0.5">
                              <Text className={`text-xs ${isFirst || isLast ? 'font-bold text-slate-700' : 'font-medium text-slate-500'}`}>{stop.time}</Text>
                            </View>
                            
                            {/* Line & Dot */}
                            <View className="items-center px-3">
                              <View className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                                isFirst ? 'bg-[#147C41]' : isLast ? 'bg-[#C41E3A]' : 'bg-slate-300'
                              }`} style={{ elevation: 1 }} />
                              {!isLast && (
                                <View className="w-0.5 bg-slate-200 flex-1 my-1" style={{ minHeight: 20 }} />
                              )}
                            </View>
                            
                            {/* Stop Name */}
                            <View className="flex-1 pb-4">
                              <Text className={`text-sm ${isFirst || isLast ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                                {stop.name}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            }))}
          </View>
        </View>

        <View className="h-32" />
      </ScrollView>

      {/* Action Button */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-[#FCFBF8]/95 border-t border-slate-100">
        <Button 
          title="Continue to Map"
          onPress={() => onNavigate && onNavigate('Map')}
          disabled={!isContinueEnabled}
        />
      </View>
    </View>
  );
};

export default SelectionScreen;
