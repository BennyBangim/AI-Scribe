import React from 'react';

interface ProgressProps {
  progress: number;
  label: string;
}

export function Progress({ progress, label }: ProgressProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-gray-400">
        <span>{label}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
} 