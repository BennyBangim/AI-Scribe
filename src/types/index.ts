export interface TranscriptionSession {
  id: string;
  startTime: string;
  duration: number;
  fileName: string;
  fileSize: number;
  transcriptionLength: number;
  pdfUrl?: string;
}

export interface RecordingStatus {
  isActive: boolean;
  isPaused: boolean;
  elapsedTime: number;
  startTime?: Date;
}

export interface TranscriptionSegment {
  id: string;
  text: string;
  timestamp: number;
  speaker?: string;
}

export interface ExportOptions {
  format: 'txt' | 'doc' | 'pdf';
  includeTimestamps: boolean;
  includeSummary: boolean;
}