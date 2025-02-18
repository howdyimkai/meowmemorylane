import React from 'react';

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
    { id: 'yarn', src: './toys/yarn.png', alt: 'Ball of Yarn' },
    { id: 'laser', src: './toys/laser.png', alt: 'Laser Pointer' },
    { id: 'mouse', src: './toys/mouse.png', alt: 'Mouse Toy' },
    { id: 'treats', src: './toys/treats.png', alt: 'Cat Treats' },
    { id: 'cattree', src: './toys/cat-tree.png', alt: 'Cat Tree' }
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
          />
        </div>
      ))}
    </div>
  );
};

export default ToySelector;