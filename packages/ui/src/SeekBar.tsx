import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  width: 100%;
  padding: 8px 0;
`;

const ProgressBar = styled.View`
  height: 4px;
  background-color: #333333;
  border-radius: 2px;
  position: relative;
  width: 100%;
`;

const ProgressFill = styled.View<{ progress: number }>`
  height: 100%;
  width: ${(props) => props.progress}%;
  background-color: #1db954;
  border-radius: 2px;
`;

const Handle = styled.View<{ position: number }>`
  position: absolute;
  left: ${(props) => props.position}%;
  top: -6px;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: #1db954;
  margin-left: -8px;
`;

const TimeContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 4px;
`;

const TimeText = styled.Text`
  color: #b3b3b3;
  font-size: 12px;
`;

interface SeekBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  disabled?: boolean;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const SeekBar: React.FC<SeekBarProps> = ({
  currentTime,
  duration,
}) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Container>
      <ProgressBar>
        <ProgressFill progress={progress} />
        <Handle position={progress} />
      </ProgressBar>
      <TimeContainer>
        <TimeText>{formatTime(currentTime)}</TimeText>
        <TimeText>{formatTime(duration)}</TimeText>
      </TimeContainer>
    </Container>
  );
};
