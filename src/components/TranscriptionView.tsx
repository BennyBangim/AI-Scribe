import React from 'react';
import { Play, Pause, Download } from 'lucide-react';

interface TranscriptionViewProps {
  text: string;
  isProcessing: boolean;
  onExport: () => void;
}

export function TranscriptionView({ text, isProcessing, onExport }: TranscriptionViewProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transcription</h2>
        <button
          onClick={onExport}
          disabled={!text || isProcessing}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>
      {isProcessing ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="prose max-w-none">
          {text || 'No transcription available yet. Upload a file to begin.'}
        </div>
      )}
    </div>
  );
}