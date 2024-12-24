import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Pause, Play, History as HistoryIcon, Settings, Home } from 'lucide-react';
import { jsPDF } from 'jspdf';

// Components
import { ErrorModal } from './components/ErrorModal';
import { Progress } from './components/Progress';
import { ApiSettings } from './components/ApiSettings';
import { RecordingControls } from './components/RecordingControls';
import History from './components/History';
import {
  TranscriptionContainer,
  KeyPointsList,
  SectionTitle,
  TranscriptionSection,
  TranscriptionHeader,
  TranscriptionTitle,
  TranscriptionStatus,
  RecordingDot,
  Logo,
  ExportButton,
  TranscriptionContent,
  HeaderContainer,
  LogoContainer,
  HeaderNav
} from './components/StyledComponents';

// Hooks
import { useAudioRecording } from './hooks/useAudioRecording';
import { useApiKey } from './hooks/useApiKey';
import { useTranscriptionHistory } from './hooks/useTranscriptionHistory';

// Utils
import { startTranscription } from './utils/transcription';
import { generateSummary } from './utils/summarization';
import { generatePDF } from './utils/pdfGenerator';

// Types
type View = 'main' | 'history' | 'settings';

interface Summary {
  title: string;
  narrative: string;
  keyPoints: string[];
}

const PROGRESS_TIMEOUT = 60000; // 1 minute timeout for progress

interface AppState {
  apiKey: string | null;
  transcription: string | null;
  summary: Summary | null;
  isRecording: boolean;
  isPaused: boolean;
  showSettings: boolean;
  showHistory: boolean;
  autoDownloadPDF: boolean;
  isProcessing: boolean;
}

export function App() {
  const { apiKey, updateApiKey, clearApiKey } = useApiKey();
  const { isRecording: isRecordingHook, startRecording, stopRecording } = useAudioRecording();
  const { history, addToHistory, deleteEntry, clearHistory } = useTranscriptionHistory();
  const [state, setState] = useState<AppState>({
    apiKey: apiKey,
    transcription: null,
    summary: null,
    isRecording: false,
    isPaused: false,
    showSettings: false,
    showHistory: false,
    autoDownloadPDF: localStorage.getItem('autoDownloadPDF') === 'true',
    isProcessing: false
  });
  const [currentView, setCurrentView] = useState<View>('main');
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  const [summarizationProgress, setSummarizationProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const progressTimeoutRef = useRef<NodeJS.Timeout>();
  const lastProgressUpdateRef = useRef<number>(0);
  const currentOperationRef = useRef<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const handleError = useCallback((error: string, operation: string) => {
    const fullError = `Error during ${operation}:\n${error}\n\nTimestamp: ${new Date().toISOString()}`;
    setError(fullError);
    setShowError(true);
    setState(prev => ({ ...prev, isProcessing: false }));
    setTranscriptionProgress(0);
    setSummarizationProgress(0);
    if (progressTimeoutRef.current) {
      clearTimeout(progressTimeoutRef.current);
    }
  }, []);

  const startProgressTimeout = useCallback((operation: string) => {
    if (progressTimeoutRef.current) {
      clearTimeout(progressTimeoutRef.current);
    }
    lastProgressUpdateRef.current = Date.now();
    currentOperationRef.current = operation;

    progressTimeoutRef.current = setInterval(() => {
      const timeSinceLastUpdate = Date.now() - lastProgressUpdateRef.current;
      if (timeSinceLastUpdate >= PROGRESS_TIMEOUT) {
        handleError(
          `Operation timed out after ${PROGRESS_TIMEOUT / 1000} seconds without progress.`,
          currentOperationRef.current
        );
        if (progressTimeoutRef.current) {
          clearInterval(progressTimeoutRef.current);
        }
      }
    }, 1000);
  }, [handleError]);

  const updateProgress = useCallback((progress: number, operation: string) => {
    if (operation === 'transcription') {
      setTranscriptionProgress(progress);
    } else {
      setSummarizationProgress(progress);
    }
    lastProgressUpdateRef.current = Date.now();
  }, []);

  const togglePause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const handleTranscriptionResult = useCallback((result: string) => {
    // Update progress to reflect actual completion
    updateProgress(100, 'transcription');
    setState(prev => ({ ...prev, transcription: prev.transcription ? prev.transcription + ' ' + result : result }));
    // Display transcription in real-time
    setCurrentView('main');
    // Reset transcription progress after a short delay
    setTimeout(() => setTranscriptionProgress(0), 1000);
  }, [updateProgress]);

  const generateTranscriptionSummary = useCallback(async () => {
    if (!state.transcription || !state.apiKey) return null;

    try {
      console.log('Starting summarization process...');
      startProgressTimeout('summarization');
      updateProgress(10, 'summarization');
      const newSummary = await generateSummary(state.transcription, state.apiKey, 'brief');
      updateProgress(100, 'summarization');
      setState(prev => ({ ...prev, summary: newSummary }));
      console.log('Summary generated:', newSummary);
      return newSummary;
    } catch (error) {
      console.error('Error during summarization:', error);
      handleError(error instanceof Error ? error.message : String(error), 'summarization');
      return null;
    } finally {
      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current);
      }
      setTimeout(() => setSummarizationProgress(0), 1000);
    }
  }, [state.transcription, state.apiKey, startProgressTimeout, updateProgress, handleError]);

  const handleFileInputChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !apiKey) {
      setCurrentView('settings');
      return;
    }

    const duration = await new Promise<number>((resolve) => {
      const audio = new Audio();
      audio.onloadedmetadata = () => resolve(audio.duration);
      audio.src = URL.createObjectURL(file);
    });

    const minutes = Math.ceil(duration / 60);
    const estimatedTranscriptionCost = minutes * 0.006;
    const estimatedSummaryCost = 0.05;
    const totalCost = estimatedTranscriptionCost + estimatedSummaryCost;

    const confirmUpload = window.confirm(
      `Estimated costs for ${minutes} minute${minutes === 1 ? '' : 's'}:\n` +
      `• Transcription: $${estimatedTranscriptionCost.toFixed(2)}\n` +
      `• Summarization: $${estimatedSummaryCost.toFixed(2)}\n` +
      `• Total: $${totalCost.toFixed(2)}\n\n` +
      `Would you like to process this file?`
    );

    if (!confirmUpload) return;

    setState(prev => ({ ...prev, isProcessing: true, transcription: '', summary: null }));
    
    try {
      const blob = new Blob([await file.arrayBuffer()], { type: file.type });
      startProgressTimeout('transcription');
      updateProgress(10, 'transcription');
      
      const transcriptionResult = await new Promise<string>((resolve, reject) => {
        startTranscription(
          blob,
          (result) => {
            setState(prev => ({ ...prev, transcription: result }));
            resolve(result);
          },
          reject,
          apiKey
        );
      });

      updateProgress(100, 'transcription');
      console.log('Transcription completed:', transcriptionResult);

      if (transcriptionResult) {
        startProgressTimeout('summarization');
        updateProgress(10, 'summarization');
        const newSummary = await generateSummary(transcriptionResult, apiKey, 'brief');
        updateProgress(100, 'summarization');
        
        setState(prev => ({ ...prev, summary: newSummary }));
        addToHistory({
          id: Date.now().toString(),
          transcription: transcriptionResult,
          summary: newSummary,
          date: new Date().toISOString()
        });
        
        console.log('Summary completed:', newSummary);
      }
    } catch (error) {
      handleError(error instanceof Error ? error.message : String(error), 'file processing');
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current);
      }
      setTimeout(() => {
        setTranscriptionProgress(0);
        setSummarizationProgress(0);
      }, 1000);
    }
  }, [apiKey, startProgressTimeout, updateProgress, handleError, addToHistory]);

  const handleStartRecording = useCallback(async () => {
    if (!apiKey) {
      setCurrentView('settings');
      return;
    }
    
    const estimatedCostPerHour = 0.41;
    const confirmStart = window.confirm(
      `Estimated cost for 1 hour of recording:\n` +
      `• Transcription: $0.36\n` +
      `• Summarization: $0.05\n` +
      `• Total: $${estimatedCostPerHour.toFixed(2)}\n\n` +
      `Would you like to start recording?`
    );

    if (!confirmStart) return;

    setState(prev => ({ ...prev, isRecording: true, isPaused: false, transcription: '', summary: null }));
    try {
      await startRecording((blob) => {
        if (!state.isPaused) {
          startTranscription(
            blob,
            handleTranscriptionResult,
            (error) => handleError(error, 'real-time transcription'),
            state.apiKey || ''
          );
        }
      });
    } catch (error) {
      handleError(error instanceof Error ? error.message : String(error), 'starting recording');
    }
  }, [startRecording, handleTranscriptionResult, state.isPaused, apiKey, handleError]);

  const handleStopRecording = useCallback(async () => {
    try {
      // First stop the recording
      await stopRecording();
      setState(prev => ({ ...prev, isRecording: false, isPaused: false }));
      
      // Wait a brief moment for the final transcription to be processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Now check if we have a transcription to summarize
      if (state.transcription) {
        console.log('Starting summarization with transcription:', state.transcription);
        
        // Start summarization process - matching the file upload process
        startProgressTimeout('summarization');
        updateProgress(10, 'summarization');
        
        try {
          // Generate summary using the same process as file upload
          const newSummary = await generateSummary(state.transcription, state.apiKey || '', 'brief');
          console.log('Generated summary:', newSummary);
          
          // Update progress
          updateProgress(100, 'summarization');
          
          // Update state with new summary
          setState(prev => ({ ...prev, summary: newSummary }));
          
          // Add to history - matching file upload process
          addToHistory({
            id: Date.now().toString(),
            transcription: state.transcription,
            summary: newSummary,
            date: new Date().toISOString()
          });
          
          console.log('Added to history');
        } catch (error) {
          console.error('Summarization error:', error);
          handleError(error instanceof Error ? error.message : String(error), 'summarization');
        }
      } else {
        console.warn('No transcription available for summarization');
      }
    } catch (error) {
      console.error('Error in handleStopRecording:', error);
      handleError(error instanceof Error ? error.message : String(error), 'stop recording');
    } finally {
      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current);
      }
      // Reset progress after delay
      setTimeout(() => setSummarizationProgress(0), 1000);
    }
  }, [stopRecording, state.transcription, state.apiKey, addToHistory, startProgressTimeout, updateProgress, handleError]);

  const handleAutoDownloadChange = (value: boolean) => {
    setState(prev => ({ ...prev, autoDownloadPDF: value }));
    localStorage.setItem('autoDownloadPDF', value.toString());
  };

  const handleExport = async () => {
    if (!state.transcription || !state.summary) return;
    
    const pdfBlob = await generatePDF({
      transcription: state.transcription,
      summary: state.summary,
      title: state.summary.title
    });

    if (state.autoDownloadPDF) {
      // Auto download
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.summary.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Show preview in new tab
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    }
  };

  const startProgressSimulation = () => {
    setProgress(0);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    progressInterval.current = setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 90) {
          return currentProgress;
        }
        // Gradually slow down the progress as it gets higher
        const increment = Math.max(0.5, (90 - currentProgress) / 20);
        return Math.min(90, currentProgress + increment);
      });
    }, 200);
  };

  const stopProgressSimulation = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    setProgress(100);
  };

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="bg-zinc-800 shadow-md">
        <HeaderContainer>
          <LogoContainer>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
            </svg>
          </LogoContainer>
          
          <Logo onClick={() => setCurrentView('main')}>
            <img src="/images/logo1.webp" alt="AI-Scribe" />
          </Logo>
          
          <HeaderNav>
            <button
              onClick={() => setCurrentView('main')}
              className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-zinc-700"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-zinc-700"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-zinc-700"
            >
              <HistoryIcon className="w-4 h-4" />
              <span>History</span>
            </button>
          </HeaderNav>
        </HeaderContainer>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentView === 'main' && (
          <>
            <div className="bg-zinc-800 rounded-lg shadow-md p-6 mb-6">
              <RecordingControls
                isRecording={state.isRecording}
                isPaused={state.isPaused}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                onTogglePause={togglePause}
                onFileSelect={handleFileInputChange}
              />
              
              {state.isRecording && (
                <button
                  onClick={togglePause}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {state.isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                  {state.isPaused ? 'Resume' : 'Pause'} Transcription
                </button>
              )}
              
              {(transcriptionProgress > 0 || summarizationProgress > 0) && (
                <div className="space-y-4 mt-4">
                  {transcriptionProgress > 0 && (
                    <Progress
                      progress={transcriptionProgress}
                      label="Transcribing audio..."
                    />
                  )}
                  {summarizationProgress > 0 && (
                    <Progress
                      progress={summarizationProgress}
                      label="Generating summary..."
                    />
                  )}
                </div>
              )}
            </div>

            <TranscriptionSection>
              <TranscriptionHeader>
                <TranscriptionTitle>Real-time Transcription</TranscriptionTitle>
                <div className="flex items-center space-x-4">
                  <TranscriptionStatus>
                    <RecordingDot isRecording={state.isRecording && !state.isPaused} />
                    {state.isRecording ? (
                      state.isPaused ? 'Paused' : 'Recording...'
                    ) : 'Not recording'}
                  </TranscriptionStatus>
                  {state.transcription && (
                    <ExportButton onClick={handleExport}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Export
                    </ExportButton>
                  )}
                </div>
              </TranscriptionHeader>
              <TranscriptionContent>
                <TranscriptionContainer>
                  {state.transcription || 'Transcription will appear here...'}
                </TranscriptionContainer>
              </TranscriptionContent>
            </TranscriptionSection>
            
            {state.summary && (
              <TranscriptionSection>
                <SectionTitle>Summary</SectionTitle>
                <TranscriptionContainer>
                  {state.summary.narrative}
                </TranscriptionContainer>
                
                <SectionTitle>Key Points</SectionTitle>
                <KeyPointsList>
                  {state.summary.keyPoints.map((point: string, index: number) => (
                    <li key={index}>{point}</li>
                  ))}
                </KeyPointsList>
              </TranscriptionSection>
            )}
            
            {error && showError && (
              <ErrorModal
                isOpen={showError}
                onClose={() => setShowError(false)}
                error={error}
              />
            )}
          </>
        )}
        
        {currentView === 'settings' && (
          <ApiSettings
            apiKey={apiKey}
            onApiKeyChange={updateApiKey}
            onClearApiKey={clearApiKey}
            autoDownloadPDF={state.autoDownloadPDF}
            onAutoDownloadChange={handleAutoDownloadChange}
          />
        )}
        
        {currentView === 'history' && (
          <History
            history={history}
            onDeleteEntry={deleteEntry}
            onClearHistory={clearHistory}
            autoDownloadPDF={state.autoDownloadPDF}
          />
        )}
      </main>
    </div>
  );
}

export default App;