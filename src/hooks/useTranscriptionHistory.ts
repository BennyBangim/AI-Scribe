import { useState, useEffect } from 'react';

interface HistoryEntry {
  id: string;
  transcription: string;
  summary: {
    title: string;
    narrative: string;
    keyPoints: string[];
  };
  date: string;
}

export function useTranscriptionHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const savedHistory = localStorage.getItem('transcriptionHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('transcriptionHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (entry: HistoryEntry) => {
    setHistory(prev => [entry, ...prev]);
  };

  const deleteEntry = (id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    addToHistory,
    deleteEntry,
    clearHistory
  };
}