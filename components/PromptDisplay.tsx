import React, { useState, useEffect } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { Spinner } from './icons/Spinner';

interface PromptDisplayProps {
  prompt: string;
  isLoading: boolean;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt, isLoading }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setIsCopied(true);
    }
  };

  const hasContent = prompt.length > 0;

  return (
    <div className="relative w-full h-full min-h-[200px] lg:min-h-full flex flex-col bg-gray-900/50 rounded-lg p-4 border border-gray-800">
      <div className="flex-grow overflow-y-auto pr-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        ) : hasContent ? (
          <p className="text-gray-200 whitespace-pre-wrap font-mono text-base leading-relaxed">{prompt}</p>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Your generated prompt will appear here...</p>
          </div>
        )}
      </div>
      {hasContent && !isLoading && (
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 bg-gray-700/50 rounded-md hover:bg-gray-600/50 transition-colors"
          title="Copy prompt"
        >
          <CopyIcon className="w-5 h-5 text-gray-300" />
          {isCopied && <span className="absolute -top-8 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">Copied!</span>}
        </button>
      )}
    </div>
  );
};
