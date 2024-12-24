import OpenAI from 'openai';

export async function startTranscription(
  audioBlob: Blob,
  onTranscriptionResult: (result: string) => void,
  onError: (error: string) => void,
  apiKey: string
) {
  try {
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });

    // Create a file with .webm extension
    const file = new File([audioBlob], 'audio.webm', { 
      type: 'audio/webm'
    });

    // Log the file details for debugging
    console.log('Sending audio for transcription:', {
      size: file.size,
      type: file.type,
      name: file.name,
      blob_type: audioBlob.type,
      blob_size: audioBlob.size
    });

    // Only transcribe if we have enough audio data
    if (file.size < 2048) {
      console.log('Audio file too small, skipping transcription');
      return;
    }

    const response = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'en',
      response_format: 'text'
    });

    // Only send non-empty transcriptions
    if (response && response.trim()) {
      onTranscriptionResult(response);
    }
  } catch (error) {
    // Log the full error for debugging
    console.error('Transcription error details:', {
      message: error instanceof Error ? error.message : String(error),
      blob_size: audioBlob.size,
      blob_type: audioBlob.type
    });
    onError(error instanceof Error ? error.message : String(error));
  }
}