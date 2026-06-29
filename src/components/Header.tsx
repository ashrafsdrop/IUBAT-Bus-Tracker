import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface HeaderProps {
  title: string;
  onBack?: () => void;
  isDarkMode?: boolean;
  rightAction?: React.ReactNode;
  transparentBackground?: boolean;
  absolutePosition?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  isDarkMode = false,
  rightAction,
  transparentBackground = false,
  absolutePosition = false,
}) => {
  const insets = useSafeAreaInsets();

  const containerClasses = [
    'flex-row items-center px-4 py-3',
    transparentBackground ? 'bg-transparent' : (isDarkMode ? 'bg-slate-900/95 border-b border-slate-700/50' : 'bg-[#FCFBF8]/95 border-b border-slate-200'),
    absolutePosition ? 'absolute top-0 left-0 right-0 z-10' : 'z-10',
  ].join(' ');

  const titleClasses = [
    'flex-1 text-center text-xl font-bold',
    isDarkMode ? 'text-slate-100' : 'text-slate-800',
  ].join(' ');

  const backButtonClasses = [
    'w-10 h-10 items-center justify-center rounded-full',
    transparentBackground ? '' : 'border shadow-sm',
    isDarkMode ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-200',
  ].join(' ');

  return (
    <View className={containerClasses} style={absolutePosition ? { paddingTop: insets.top + 12 } : {}}>
      <TouchableOpacity 
        onPress={onBack} 
        className={backButtonClasses} 
        style={!transparentBackground ? { elevation: 3 } : {}}
      >
        <Text className="text-[#147C41] text-3xl font-bold leading-none">←</Text>
      </TouchableOpacity>
      
      <Text className={titleClasses}>
        {title}
      </Text>
      
      {rightAction ? (
        rightAction
      ) : (
        <View className="w-10" />
      )}
    </View>
  );
};

export default Header;
