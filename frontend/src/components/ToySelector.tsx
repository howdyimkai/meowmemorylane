import React from 'react';
import { getToyImage } from '../utils/imageImports';

interface ToyInfo {
  id: string;
  src: string;
  alt: string;
}

interface ToySelectorProps {
  onToySelect: (toy: ToyInfo) => void;
  selectedToyId: string | null;
}

const ToySelector: React.FC<ToySelectorProps> = ({ onToySelect, selectedToyId }) => {
  const toys = [
    { id: 'yarn', src: getToyImage('yarn'), alt: 'Ball of Yarn' },
    { id: 'laser', src: getToyImage('laser'), alt: 'Laser Pointer' },
    { id: 'mouse', src: getToyImage('mouse'), alt: 'Mouse Toy' },
    { id: 'treats', src: getToyImage('treats'), alt: 'Cat Treats' },
    { id: 'cattree', src: getToyImage('cattree'), alt: 'Cat Tree' }
  ];

  return (
    <div className="flex justify-center items-center gap-8 mt-6">
      {toys.map(toy => (
        <div key={toy.id} className="flex flex-col items-center">
          <img 
            src={toy.src} 
            alt={toy.alt} 
            className={`w-16 h-16 object-contain cursor-pointer transition-transform hover:scale-110
              ${selectedToyId === toy.id ? 'ring-2 ring-green-500 rounded-full' : ''}`}
            onClick={() => onToySelect(toy)}
            onError={(e) => {
              console.error(`Failed to load image: ${toy.src}`);
              const target = e.target as HTMLImageElement;
              target.style.backgroundColor = '#f8d7da';
              target.style.border = '1px solid #dc3545';
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default ToySelector;