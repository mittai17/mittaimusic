import React from 'react';
import { ImageStyle } from 'react-native';
import styled from 'styled-components/native';

const StyledImage = styled.Image<{ size: number; rounded?: boolean }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => (props.rounded ? props.size / 2 : 8)}px;
  background-color: #333333;
`;

interface CoverImageProps {
  source: { uri: string } | number;
  size?: number;
  rounded?: boolean;
  style?: ImageStyle;
}

export const CoverImage: React.FC<CoverImageProps> = ({
  source,
  size = 100,
  rounded = false,
  style,
}) => {
  return <StyledImage source={source} size={size} rounded={rounded} style={style} />;
};

