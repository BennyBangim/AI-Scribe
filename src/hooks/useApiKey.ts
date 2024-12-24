import { useState, useEffect } from 'react';

const API_KEY_STORAGE_KEY = 'openai-api-key';

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string | null>(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (!storedKey) return null;
    // Ensure the key is properly formatted
    return storedKey.startsWith('sk-') ? storedKey : null;
  });

  const updateApiKey = (newKey: string) => {
    // Validate the API key format
    if (!newKey.startsWith('sk-')) {
      throw new Error('Invalid API key format. OpenAI API keys should start with "sk-"');
    }
    setApiKey(newKey);
    localStorage.setItem(API_KEY_STORAGE_KEY, newKey);
  };

  const clearApiKey = () => {
    setApiKey(null);
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  };

  return { apiKey, updateApiKey, clearApiKey };
}