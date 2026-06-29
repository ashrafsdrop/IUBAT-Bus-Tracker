import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ROUTES } from '../data/routes';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SelectionScreen = ({ onBack, onNavigate }: { onBack?: () => void, onNavigate?: (screen: string) => void }) => {
  const insets = useSafeAreaInsets();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);

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
      <View className="flex-row items-center px-4 py-3 bg-[#FCFBF8] z-10">
        <TouchableOpacity onPress={onBack} className="w-10 h-10 items-center justify-center rounded-full">
          <Text className="text-[#147C41] text-3xl font-bold leading-none">←</Text>
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-bold text-slate-800">
          Select Your Route
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={false}>
        
        <View className="mb-8">
          <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">
            Available Routes
          </Text>
          <View>
            {ROUTES.map((route) => {
              const isSelected = selectedRoute === route.id;
              const isExpanded = expandedRoute === route.id;
              const firstStop = route.stops[0];
              const lastStop = route.stops[route.stops.length - 1];

              return (
                <View key={route.id} className="mb-3">
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => handleRouteSelect(route.id)}
                    className={`p-4 rounded-2xl border-2 z-10 ${
                      isSelected ? 'border-[#147C41] bg-[#147C41]/5' : 'border-transparent bg-white'
                    }`}
                    style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 }}
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
                    <View className="bg-white mx-2 px-4 py-4 rounded-b-2xl border-x border-b border-slate-100" style={{ marginTop: -15, paddingTop: 25, zIndex: 1 }}>
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
            })}
          </View>
        </View>

        <View className="h-32" />
      </ScrollView>

      {/* Action Button */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-[#FCFBF8]/95 border-t border-slate-100">
        <TouchableOpacity
          disabled={!isContinueEnabled}
          onPress={() => onNavigate && onNavigate('Map')}
          className={`py-4 rounded-2xl items-center justify-center ${
            isContinueEnabled ? 'bg-[#147C41] shadow-lg' : 'bg-slate-200'
          }`}
          style={isContinueEnabled ? { elevation: 4, shadowColor: '#147C41', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.2, shadowRadius: 12 } : {}}
        >
          <Text className={`text-lg font-bold tracking-wide ${isContinueEnabled ? 'text-white' : 'text-slate-400'}`}>
            Continue to Map
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectionScreen;
