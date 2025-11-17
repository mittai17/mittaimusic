import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

const StyledButton = styled.TouchableOpacity<{ variant: 'primary' | 'secondary' | 'ghost'; disabled?: boolean }>`
  padding: 12px 24px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  background-color: ${(props) => {
    if (props.disabled) return '#cccccc';
    if (props.variant === 'primary') return '#1db954';
    if (props.variant === 'secondary') return '#333333';
    return 'transparent';
  }};
  border: ${(props) => (props.variant === 'ghost' ? '1px solid #666666' : 'none')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const ButtonText = styled.Text<{ variant: 'primary' | 'secondary' | 'ghost' }>`
  color: ${(props) => {
    if (props.variant === 'primary') return '#ffffff';
    if (props.variant === 'secondary') return '#ffffff';
    return '#1db954';
  }};
  font-size: 16px;
  font-weight: 600;
`;

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) => {
  return (
    <StyledButton
      variant={variant}
      disabled={disabled || loading}
      onPress={onPress}
      style={style}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? '#1db954' : '#ffffff'} />
      ) : (
        <ButtonText variant={variant}>{title}</ButtonText>
      )}
    </StyledButton>
  );
};

