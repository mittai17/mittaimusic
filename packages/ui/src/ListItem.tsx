import React from 'react';
import styled from 'styled-components/native';

const StyledListItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: transparent;
`;

const ContentContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const TextContainer = styled.View`
  flex: 1;
  margin-left: 12px;
`;

const Title = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
`;

const Subtitle = styled.Text`
  color: #b3b3b3;
  font-size: 14px;
  margin-top: 4px;
`;

const RightContainer = styled.View`
  margin-left: 12px;
`;

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onPress,
}) => {
  return (
    <StyledListItem onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <ContentContainer>
        {leftIcon}
        <TextContainer>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </TextContainer>
      </ContentContainer>
      {rightIcon && <RightContainer>{rightIcon}</RightContainer>}
    </StyledListItem>
  );
};

