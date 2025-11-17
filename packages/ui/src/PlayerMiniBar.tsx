import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { CoverImage } from './CoverImage';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: #1a1a1a;
  border-top-width: 1px;
  border-top-color: #333333;
`;

const TextContainer = styled.View`
  flex: 1;
  margin-left: 12px;
`;

const TrackTitle = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
`;

const TrackArtist = styled.Text`
  color: #b3b3b3;
  font-size: 12px;
  margin-top: 2px;
`;

const ControlButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #1db954;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
`;

const ControlIcon = styled.Text`
  color: #ffffff;
  font-size: 18px;
`;

interface PlayerMiniBarProps {
  track: {
    id: string;
    title: string;
    artist: string;
    coverUrl: string;
  } | null;
  isPlaying: boolean;
  onPress: () => void;
  onPlayPause: () => void;
}

export const PlayerMiniBar: React.FC<PlayerMiniBarProps> = ({
  track,
  isPlaying,
  onPress,
  onPlayPause,
}) => {
  if (!track) return null;

  return (
    <Container>
      <TouchableOpacity onPress={onPress} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <CoverImage source={{ uri: track.coverUrl }} size={48} />
        <TextContainer>
          <TrackTitle numberOfLines={1}>{track.title}</TrackTitle>
          <TrackArtist numberOfLines={1}>{track.artist}</TrackArtist>
        </TextContainer>
      </TouchableOpacity>
      <ControlButton onPress={onPlayPause} activeOpacity={0.7}>
        <ControlIcon>{isPlaying ? '⏸' : '▶'}</ControlIcon>
      </ControlButton>
    </Container>
  );
};

