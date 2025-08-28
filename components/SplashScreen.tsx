import React from 'react';
import { CameraIcon } from './icons/CameraIcon';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col justify-center items-center z-50 animate-fadeIn">
      <div className="text-center p-8">
        <div className="inline-block p-4 bg-purple-900/20 rounded-full mb-6 border border-purple-800">
          <CameraIcon className="w-16 h-16 text-purple-400" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
          ProVision
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Deconstruct any image into a master-level photographic prompt. Unleash the full potential of AI image generation.
        </p>
        <button
          onClick={onEnter}
          className="px-10 py-4 text-xl font-semibold text-white bg-purple-600 rounded-lg shadow-lg shadow-purple-600/20 hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
        >
          Enter Studio
        </button>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
};
