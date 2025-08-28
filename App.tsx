import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PromptDisplay } from './components/PromptDisplay';
import { generatePromptFromImage } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { SplashScreen } from './components/SplashScreen';
import { XCircleIcon } from './components/icons/XCircleIcon';
import { HistoryDisplay } from './components/HistoryDisplay';

interface HistoryItem {
  prompt: string;
  timestamp: number;
}

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('promptHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
      setHistory([]);
    }
  }, []);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setGeneratedPrompt('');
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.onerror = () => {
        setError('Error reading the image file. It might be corrupted.');
        setImageFile(null);
        setImageUrl(null);
    };
    reader.readAsDataURL(file);
  };
  
  const handleClearImage = () => {
    setImageFile(null);
    setImageUrl(null);
    setGeneratedPrompt('');
    setError(null);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                resolve((reader.result as string).split(',')[1]);
            } else {
                reject(new Error("Failed to read file."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
  };

  const handleGeneratePrompt = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');

    try {
      const base64Data = await convertFileToBase64(imageFile);
      const mimeType = imageFile.type;
      const prompt = await generatePromptFromImage(base64Data, mimeType);
      
      setGeneratedPrompt(prompt);
      
      const newItem: HistoryItem = { prompt, timestamp: Date.now() };
      setHistory(prevHistory => {
        const updatedHistory = [newItem, ...prevHistory];
        try {
            localStorage.setItem('promptHistory', JSON.stringify(updatedHistory));
        } catch (e) {
            console.error("Failed to save history to localStorage", e);
        }
        return updatedHistory;
      });

    } catch (err) {
      console.error(err);
      const errorMessage = (err instanceof Error) ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate prompt: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const handleEnter = () => {
    setShowSplash(false);
  };

  const handleSelectHistoryItem = (prompt: string) => {
    setGeneratedPrompt(prompt);
  };

  const handleClearHistory = () => {
    try {
        localStorage.removeItem('promptHistory');
    } catch (e) {
        console.error("Failed to clear history from localStorage", e);
    }
    setHistory([]);
  };

  if (showSplash) {
    return <SplashScreen onEnter={handleEnter} />;
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 animate-appContentFadeIn">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            ProVision Prompt Crafter
          </h1>
          <p className="mt-3 text-lg text-gray-400">
            Upload an image to generate a master-level photographic prompt.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-6">
            <ImageUploader 
                onImageUpload={handleImageUpload} 
                imageUrl={imageUrl} 
                onError={setError}
            />
            <div className="flex w-full items-stretch gap-4">
              <button
                onClick={handleGeneratePrompt}
                disabled={!imageFile || isLoading}
                className="flex-grow flex items-center justify-center px-6 py-4 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-purple-500"
              >
                <SparklesIcon className="w-6 h-6 mr-3" />
                {isLoading ? 'Crafting Prompt...' : 'Generate Master Prompt'}
              </button>
              {imageFile && (
                <button
                  onClick={handleClearImage}
                  disabled={isLoading}
                  title="Clear Image"
                  className="flex-shrink-0 flex items-center justify-center px-6 py-4 text-lg font-semibold text-gray-300 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gray-500"
                >
                  <XCircleIcon className="w-6 h-6 mr-2" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-6">
             {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 text-center">{error}</div>}
            <PromptDisplay prompt={generatedPrompt} isLoading={isLoading} />
            <HistoryDisplay 
              history={history}
              onSelect={handleSelectHistoryItem}
              onClear={handleClearHistory}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
