import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'danger' | 'disabled';
  size?: 'normal' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  activeOpacity?: number;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  size = 'normal',
  style,
  textStyle,
  activeOpacity = 0.8,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return 'bg-slate-200';
    if (variant === 'danger') return 'bg-[#C41E3A]';
    return 'bg-[#147C41]';
  };

  const containerClasses = [
    size === 'large' ? 'py-5' : 'py-4',
    'rounded-2xl items-center justify-center shadow-sm w-full',
    getBackgroundColor(),
  ].join(' ');

  const getTextColor = () => {
    if (disabled) return 'text-slate-500';
    return 'text-white';
  };

  const textClasses = [
    'text-lg font-bold tracking-wide uppercase',
    getTextColor(),
  ].join(' ');

  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={activeOpacity}
      onPress={onPress}
      className={containerClasses}
      style={[
        !disabled ? { elevation: 4, shadowColor: variant === 'danger' ? '#C41E3A' : '#147C41', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.2, shadowRadius: 12 } : {},
        style
      ]}
    >
      <Text className={textClasses} style={textStyle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
