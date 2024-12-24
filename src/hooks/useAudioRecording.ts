import { useState, useCallback, useRef } from 'react';

export function useAudioRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const onDataCallback = useRef<((blob: Blob) => void) | null>(null);

  const startRecording = useCallback(async (onData: (blob: Blob) => void) => {
    try {
      // Request screen capture with audio
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true
      });

      // Check if we have audio
      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) {
        throw new Error('No audio track available. Please make sure to select a source with audio and enable "Share audio".');
      }

      // Create a new stream with only the audio track
      const audioStream = new MediaStream([audioTrack]);

      // Stop video track as we don't need it
      stream.getVideoTracks().forEach(track => track.stop());

      // Use WebM format which is widely supported
      const mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        throw new Error('WebM audio format not supported. Please try a different browser.');
      }

      console.log('Using audio format:', mimeType);

      const recorder = new MediaRecorder(audioStream, {
        mimeType,
        audioBitsPerSecond: 128000
      });

      mediaRecorder.current = recorder;
      audioChunks.current = [];
      onDataCallback.current = onData;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      // Handle stopping screen share
      audioTrack.onended = () => {
        stopRecording();
      };

      recorder.start(2000); // Capture in 2-second intervals for better chunks
      setIsRecording(true);

      console.log('Recording started:', {
        format: mimeType,
        track: audioTrack.label
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!mediaRecorder.current) return null;

    return new Promise<Blob>((resolve) => {
      const recorder = mediaRecorder.current!;
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: recorder.mimeType });
        audioChunks.current = [];
        
        // Stop all tracks
        recorder.stream.getTracks().forEach(track => track.stop());
        
        setIsRecording(false);
        
        // Trigger transcription after stopping
        if (onDataCallback.current) {
          onDataCallback.current(audioBlob);
        }

        resolve(audioBlob);
      };

      recorder.stop();
    });
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording
  };
}