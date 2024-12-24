import React from 'react';
import styled from 'styled-components';
import { Mic, Upload } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onTogglePause: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #6b7280;
    cursor: not-allowed;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5rem;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5rem;
  }
`;

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPaused,
  onStartRecording,
  onStopRecording,
  onTogglePause,
  onFileSelect
}) => {
  return (
    <ControlsContainer>
      {!isRecording ? (
        <>
          <Button onClick={onStartRecording}>
            <Mic />
            Start Real-time Transcription
          </Button>
          <FileInputLabel>
            <Upload />
            Upload Audio File
            <FileInput
              type="file"
              accept="audio/*"
              onChange={onFileSelect}
            />
          </FileInputLabel>
        </>
      ) : (
        <Button onClick={onStopRecording}>
          <Mic />
          Stop Recording
        </Button>
      )}
    </ControlsContainer>
  );
};