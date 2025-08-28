import React, { useState, useCallback, useEffect } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
  onError: (error: string) => void;
}

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageUrl, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);

  // Reset sliders whenever a new image is loaded.
  useEffect(() => {
    if (imageUrl) {
      setContrast(100);
      setBrightness(100);
      setSaturation(100);
    }
  }, [imageUrl]);

  const handleFileValidation = (file: File) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      onError('Invalid file type. Please upload a PNG, JPG, or WEBP file.');
      return;
    }
    onError(''); // Clear previous errors
    onImageUpload(file);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileValidation(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileValidation(e.dataTransfer.files[0]);
    }
  }, [onImageUpload, onError]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  return (
    <div className="w-full bg-gray-900/50 border-2 border-dashed border-gray-800 rounded-lg p-4 flex flex-col justify-center items-center transition-all duration-300">
      <div 
        className="w-full aspect-video flex flex-col justify-center items-center rounded-md"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          id="imageUpload"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
        <div 
          className={`w-full h-full flex flex-col justify-center items-center rounded-md transition-colors duration-300 ${isDragging ? 'bg-purple-900/30' : ''}`}
        >
          {imageUrl ? (
             <label htmlFor="imageUpload" className="group relative cursor-pointer w-full h-full">
              <img 
                src={imageUrl} 
                alt="Uploaded preview" 
                className="object-contain w-full h-full rounded-md" 
                style={{ filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)` }}
              />
              <div className="absolute inset-0 bg-gray-900/70 rounded-md flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <UploadIcon className="w-10 h-10 mb-2 text-white" />
                  <span className="font-semibold text-white text-lg">Change Image</span>
              </div>
             </label>
          ) : (
            <label htmlFor="imageUpload" className="cursor-pointer text-center text-gray-400 flex flex-col items-center">
              <UploadIcon className="w-12 h-12 mb-4 text-gray-500" />
              <span className="font-semibold text-purple-400">Click to upload</span>
              <span className="mt-1">or drag and drop</span>
              <span className="text-xs mt-2">PNG, JPG, or WEBP</span>
            </label>
          )}
        </div>
      </div>

      {imageUrl && (
        <div className="w-full mt-6 space-y-4">
          <div className="grid grid-cols-4 items-center gap-2 text-sm text-gray-400">
            <label htmlFor="brightness" className="col-span-1">Brightness</label>
            <input
              id="brightness"
              type="range"
              min="0"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="col-span-3 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-2 text-sm text-gray-400">
            <label htmlFor="contrast" className="col-span-1">Contrast</label>
            <input
              id="contrast"
              type="range"
              min="0"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="col-span-3 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-2 text-sm text-gray-400">
            <label htmlFor="saturation" className="col-span-1">Saturation</label>
            <input
              id="saturation"
              type="range"
              min="0"
              max="200"
              value={saturation}
              onChange={(e) => setSaturation(Number(e.target.value))}
              className="col-span-3 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
            />
          </div>
        </div>
      )}
      <style>{`
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #a855f7; /* purple-500 */
          cursor: pointer;
          border-radius: 50%;
          transition: background-color 0.2s;
        }
        .range-thumb::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #a855f7; /* purple-500 */
          cursor: pointer;
          border-radius: 50%;
          transition: background-color 0.2s;
        }
        .range-thumb:hover::-webkit-slider-thumb {
          background-color: #9333ea; /* purple-600 */
        }
        .range-thumb:hover::-moz-range-thumb {
          background-color: #9333ea; /* purple-600 */
        }
      `}</style>
    </div>
  );
};