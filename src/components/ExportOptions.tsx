import React from 'react';
import { Download, Clock, FileText } from 'lucide-react';
import type { ExportOptions } from '../types';

interface ExportOptionsProps {
  onExport: (options: ExportOptions) => void;
  disabled: boolean;
}

export function ExportOptions({ onExport, disabled }: ExportOptionsProps) {
  const [options, setOptions] = React.useState<ExportOptions>({
    format: 'pdf',
    includeTimestamps: true,
    includeSummary: true,
  });

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-100 mb-4">Export Options</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Format
          </label>
          <div className="flex space-x-4">
            {['txt', 'doc', 'pdf'].map((format) => (
              <label
                key={format}
                className="flex items-center space-x-2 text-gray-300"
              >
                <input
                  type="radio"
                  name="format"
                  value={format}
                  checked={options.format === format}
                  onChange={(e) =>
                    setOptions({ ...options, format: e.target.value as any })
                  }
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="uppercase">{format}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              checked={options.includeTimestamps}
              onChange={(e) =>
                setOptions({ ...options, includeTimestamps: e.target.checked })
              }
              className="text-blue-500 focus:ring-blue-500"
            />
            <Clock className="w-4 h-4" />
            <span>Include timestamps</span>
          </label>

          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              checked={options.includeSummary}
              onChange={(e) =>
                setOptions({ ...options, includeSummary: e.target.checked })
              }
              className="text-blue-500 focus:ring-blue-500"
            />
            <FileText className="w-4 h-4" />
            <span>Include summary</span>
          </label>
        </div>

        <button
          onClick={() => onExport(options)}
          disabled={disabled}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5 mr-2" />
          Export
        </button>
      </div>
    </div>
  );
}