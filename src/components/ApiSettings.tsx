import React from 'react';
import styled from 'styled-components';

interface ApiSettingsProps {
  apiKey: string | null;
  onApiKeyChange: (key: string) => void;
  onClearApiKey: () => void;
  autoDownloadPDF: boolean;
  onAutoDownloadChange: (value: boolean) => void;
}

const SettingsContainer = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const SettingsGroup = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #4a9eff;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #dc2626;
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  input[type="checkbox"] {
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
  }

  label {
    color: #ffffff;
    cursor: pointer;
  }
`;

const CostInfo = styled.div`
  background: #2a2a2a;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
  color: #ffffff;
`;

const CostTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #3a3a3a;
  }
  
  th {
    color: #9ca3af;
    font-weight: 500;
  }
`;

export const ApiSettings: React.FC<ApiSettingsProps> = ({
  apiKey,
  onApiKeyChange,
  onClearApiKey,
  autoDownloadPDF,
  onAutoDownloadChange
}) => {
  return (
    <SettingsContainer>
      <SettingsGroup>
        <SettingsTitle>OpenAI API Key</SettingsTitle>
        <Input
          type="password"
          placeholder="Enter your OpenAI API key"
          value={apiKey || ''}
          onChange={(e) => onApiKeyChange(e.target.value)}
        />
        {apiKey && (
          <Button onClick={onClearApiKey}>
            Clear API Key
          </Button>
        )}
      </SettingsGroup>

      <SettingsGroup>
        <SettingsTitle>PDF Export Settings</SettingsTitle>
        <Checkbox>
          <input
            type="checkbox"
            id="autoDownload"
            checked={autoDownloadPDF}
            onChange={(e) => onAutoDownloadChange(e.target.checked)}
          />
          <label htmlFor="autoDownload">
            Automatically download PDF when clicking Export
          </label>
        </Checkbox>
      </SettingsGroup>

      <SettingsGroup>
        <SettingsTitle>Cost Information</SettingsTitle>
        <CostInfo>
          <p>AI-Scribe uses OpenAI's API for transcription and summarization. Here are the estimated costs:</p>
          
          <CostTable>
            <thead>
              <tr>
                <th>Service</th>
                <th>Cost</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Audio Transcription</td>
                <td>$0.006/minute</td>
                <td>Whisper API</td>
              </tr>
              <tr>
                <td>Summarization</td>
                <td>$0.05/summary</td>
                <td>GPT-3.5 Turbo</td>
              </tr>
              <tr>
                <td>Real-time (1 hour)</td>
                <td>$0.41</td>
                <td>Includes transcription and summary</td>
              </tr>
            </tbody>
          </CostTable>
          
          <p style={{ marginTop: '1rem', color: '#9ca3af', fontSize: '0.875rem' }}>
            Note: These are approximate costs. Actual costs may vary based on usage and OpenAI's pricing.
          </p>
        </CostInfo>
      </SettingsGroup>
    </SettingsContainer>
  );
}; 