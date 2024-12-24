import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, List } from 'lucide-react';

interface SummaryViewProps {
  narrative: string;
  keyPoints: string[];
  detailLevel: 'brief' | 'detailed';
  onDetailLevelChange: (level: 'brief' | 'detailed') => void;
}

export function SummaryView({
  narrative,
  keyPoints,
  detailLevel,
  onDetailLevelChange,
}: SummaryViewProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Summary</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onDetailLevelChange('brief')}
            className={`px-4 py-2 rounded-md ${
              detailLevel === 'brief'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Brief
          </button>
          <button
            onClick={() => onDetailLevelChange('detailed')}
            className={`px-4 py-2 rounded-md ${
              detailLevel === 'detailed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Detailed
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="flex items-center text-lg font-medium mb-2">
            <FileText className="w-5 h-5 mr-2" />
            Narrative Summary
          </h3>
          <div className="prose max-w-none">
            <ReactMarkdown>{narrative}</ReactMarkdown>
          </div>
        </div>

        <div>
          <h3 className="flex items-center text-lg font-medium mb-2">
            <List className="w-5 h-5 mr-2" />
            Key Points
          </h3>
          <ul className="list-disc list-inside space-y-2">
            {keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}