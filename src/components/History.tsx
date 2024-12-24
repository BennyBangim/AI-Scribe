import React, { useState } from 'react';
import { HistoryEntry, HistoryTitle, HistoryDate, HistoryPreview, HistoryContent, HistoryContainer } from './StyledComponents';
import { generatePDF } from '../utils/pdfGenerator';

interface HistoryItem {
  id: string;
  transcription: string;
  summary: {
    title: string;
    narrative: string;
    keyPoints: string[];
  };
  date: string;
}

interface HistoryProps {
  history: HistoryItem[];
  onDeleteEntry: (id: string) => void;
  onClearHistory: () => void;
  autoDownloadPDF: boolean;
}

const History: React.FC<HistoryProps> = ({ history, onDeleteEntry, onClearHistory, autoDownloadPDF }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleExport = async (item: HistoryItem) => {
    const pdfBlob = await generatePDF({
      transcription: item.transcription,
      summary: item.summary,
      title: item.summary.title
    });

    if (autoDownloadPDF) {
      // Auto download
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.summary.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
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

  return (
    <HistoryContainer>
      {history.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button
            onClick={onClearHistory}
            style={{
              padding: '0.5rem 1rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear History
          </button>
        </div>
      )}
      {history.map((item, index) => {
        const isExpanded = expandedIndex === index;
        const title = item.summary.title || 'Untitled Transcription';

        return (
          <HistoryEntry
            key={item.id}
            expanded={isExpanded}
            onClick={() => toggleExpand(index)}
          >
            <HistoryTitle expanded={isExpanded}>{title}</HistoryTitle>
            <div style={{ 
              position: 'absolute', 
              top: '12px', 
              right: '12px', 
              display: 'flex', 
              gap: '0.75rem', 
              alignItems: 'center',
              background: '#2a2a2a'
            }}>
              <span style={{
                fontSize: '12px',
                color: '#888888',
                marginRight: '0.75rem'
              }}>
                {formatDate(item.date)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleExport(item);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 8px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteEntry(item.id);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 8px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
                Delete
              </button>
            </div>
            {isExpanded ? (
              <HistoryContent>
                <strong>Summary:</strong>
                <br />
                {item.summary.narrative}
                <br />
                <br />
                <strong>Key Points:</strong>
                <ul style={{ listStyle: 'disc', marginLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                  {item.summary.keyPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </HistoryContent>
            ) : (
              <HistoryPreview expanded={isExpanded}>{item.summary.narrative.slice(0, 100) + (item.summary.narrative.length > 100 ? '...' : '')}</HistoryPreview>
            )}
          </HistoryEntry>
        );
      })}
    </HistoryContainer>
  );
};

export default History; 