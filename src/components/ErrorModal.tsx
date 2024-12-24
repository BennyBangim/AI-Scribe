import React, { useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: string;
}

export function ErrorModal({ isOpen, onClose, error }: ErrorModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullError, setShowFullError] = useState(false);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black flex items-center justify-center p-4 z-50"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes expandModal {
          from {
            transform: scale(0.95);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
      <div 
        className={`bg-zinc-900 rounded-lg shadow-xl transition-all duration-300 ease-in-out ${
          isExpanded 
            ? 'fixed inset-4 m-0' 
            : 'w-full max-w-lg'
        }`}
        style={{
          animation: 'slideIn 0.3s ease-out',
          transform: isExpanded ? 'scale(1)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-lg font-semibold text-red-400">Something Went Wrong...</h2>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-gray-400 hover:text-gray-300 transition-colors"
                title={isExpanded ? 'Minimize' : 'Maximize'}
              >
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-300 transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="mb-3 text-sm text-gray-300">
              The operation could not be completed. Please check the details below and try again.
            </div>

            <div className="flex-1 overflow-hidden">
              {showFullError ? (
                <pre 
                  className="text-sm text-gray-400 whitespace-pre-wrap overflow-y-auto h-full bg-black rounded-lg p-3 text-xs"
                  style={{ animation: 'fadeIn 0.2s ease-out' }}
                >
                  {error}
                </pre>
              ) : (
                <div className="text-gray-400">
                  <button
                    onClick={() => setShowFullError(true)}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Read More
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-zinc-800 text-sm text-gray-300 rounded-md hover:bg-zinc-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 