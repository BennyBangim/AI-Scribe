import React from 'react';
import { Download } from 'lucide-react';

interface TranscriptionDisplayProps {
  transcription: string;
  isProcessing: boolean;
  onExport: () => void;
}

export function TranscriptionDisplay({
  transcription,
  isProcessing,
  onExport,
}: TranscriptionDisplayProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-100">Live Transcription</h2>
        <button
          onClick={onExport}
          disabled={!transcription || isProcessing}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>
      
      <div className="relative min-h-[200px] bg-gray-900 rounded-md p-4">
        {isProcessing && (
          <div className="absolute top-0 right-0 m-2">
            <div className="animate-pulse flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Recording...</span>
            </div>
          </div>
        )}
        <div className="prose prose-invert max-w-none text-gray-300">
          {transcription || 'No transcription available yet. Start recording or upload an audio file.'}
        </div>
      </div>
    </div>
  );
}