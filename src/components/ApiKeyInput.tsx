import React from 'react';
import { Key, Trash2 } from 'lucide-react';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onClearApiKey: () => void;
}

export function ApiKeyInput({ apiKey, onApiKeyChange, onClearApiKey }: ApiKeyInputProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="password"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="Enter OpenAI API Key"
          className="w-full pl-10 pr-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
        />
      </div>
      {apiKey && (
        <button
          onClick={onClearApiKey}
          className="p-2 text-red-400 hover:bg-gray-700 rounded-md"
          title="Clear API Key"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}