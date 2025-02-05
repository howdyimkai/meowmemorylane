import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Please upload an image file';
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a JPEG, PNG, or WebP image';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Image must be less than 5MB';
    }
    return null;
  };

  const handleFile = (file: File) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    onImageUpload(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [onImageUpload]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center p-8 border-2 border-dashed transition-colors
        ${isDragging ? 'border-green-500 bg-green-50' : 'border-white/30'}
        ${error ? 'border-red-500 bg-red-50' : ''}`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
    >
      <div className="mb-4 text-4xl">
        {error ? '⚠️' : '📷'}
      </div>
      
      <p className="text-center mb-2 text-white">
        {isDragging ? 'Drop your image here' : 'Upload photos of your cat'}
      </p>
      
      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">
          {error}
        </p>
      )}
      
      <label className="flex items-center gap-2 border border-white rounded px-4 py-2 cursor-pointer text-white hover:bg-white/10 transition-colors">
        Choose a photo
        <input
          type="file"
          className="hidden"
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleChange}
        />
      </label>
      
      <p className="text-xs text-white/70 mt-4">
        JPEG, PNG or WebP, up to 5MB
      </p>
    </div>
  );
};

export default ImageUploader;