import React from 'react';
import { FileText, Trash2, Download, Clock } from 'lucide-react';
import type { TranscriptionSession } from '../types';

interface TranscriptionHistoryProps {
  sessions: TranscriptionSession[];
  onRemoveSession: (id: string) => void;
}

export function TranscriptionHistory({ sessions, onRemoveSession }: TranscriptionHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Transcription History</h2>
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-gray-400">No transcription sessions yet.</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-100 font-medium">
                    {session.fileName}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-400 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(session.startTime)}</span>
                  </div>
                  <div>Duration: {formatDuration(session.duration)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {session.pdfUrl && (
                  <a
                    href={session.pdfUrl}
                    download
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    title="Download PDF"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                )}
                <button
                  onClick={() => onRemoveSession(session.id)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  title="Delete Session"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}