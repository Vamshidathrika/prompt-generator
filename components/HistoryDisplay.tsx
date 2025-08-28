import React from 'react';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryItem {
  prompt: string;
  timestamp: number;
}

interface HistoryDisplayProps {
  history: HistoryItem[];
  onSelect: (prompt: string) => void;
  onClear: () => void;
}

export const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-gray-900/50 rounded-lg p-4 border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-300">Prompt History</h3>
        <button
          onClick={onClear}
          className="flex items-center text-sm text-gray-500 hover:text-red-400 transition-colors"
          title="Clear history"
        >
          <TrashIcon className="w-4 h-4 mr-1" />
          Clear
        </button>
      </div>
      <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {history.map((item) => (
          <li key={item.timestamp}>
            <button
              onClick={() => onSelect(item.prompt)}
              className="w-full text-left p-2 rounded-md bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            >
              <p className="text-gray-300 truncate text-sm">
                {item.prompt}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
