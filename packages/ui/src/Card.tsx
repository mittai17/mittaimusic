import React from 'react';
import { ViewStyle } from 'react-native';
import styled from 'styled-components/native';

const StyledCard = styled.TouchableOpacity`
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 16px;
  margin: 8px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, onPress, style }) => {
  return (
    <StyledCard onPress={onPress} activeOpacity={0.8} style={style} disabled={!onPress}>
      {children}
    </StyledCard>
  );
};

