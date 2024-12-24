import React from 'react';
import { Clock } from 'lucide-react';

interface RecordingTimerProps {
  elapsedTime: number;
  isPaused: boolean;
}

export function RecordingTimer({ elapsedTime, isPaused }: RecordingTimerProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-2 text-gray-200">
      <Clock className="w-5 h-5" />
      <span className="font-mono text-lg">
        {formatTime(elapsedTime)}
      </span>
      {isPaused && (
        <span className="text-yellow-400 text-sm">(Paused)</span>
      )}
    </div>
  );
}