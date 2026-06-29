import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';

export interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: (val: boolean) => void;
  style?: ViewStyle;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDarkMode,
  onToggle,
  style,
}) => {
  const buttonClasses = [
    'w-10 h-10 items-center justify-center rounded-full shadow-sm',
    isDarkMode ? 'bg-slate-800' : 'bg-white border border-slate-200',
  ].join(' ');

  return (
    <TouchableOpacity 
      onPress={() => onToggle(!isDarkMode)} 
      className={buttonClasses} 
      style={[{ elevation: 3 }, style]}
    >
      <Text className="text-xl">{isDarkMode ? "☀️" : "🌙"}</Text>
    </TouchableOpacity>
  );
};

export default ThemeToggle;
