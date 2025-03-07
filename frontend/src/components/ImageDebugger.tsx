import React, { useState } from 'react';

const ImageDebugger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Create a list of all images used in the app
  const images = [
    { name: 'Yarn', path: '/toys/yarn.png', publicPath: `${process.env.PUBLIC_URL}/toys/yarn.png` },
    { name: 'Laser', path: '/toys/laser.png', publicPath: `${process.env.PUBLIC_URL}/toys/laser.png` },
    { name: 'Mouse', path: '/toys/mouse.png', publicPath: `${process.env.PUBLIC_URL}/toys/mouse.png` },
    { name: 'Treats', path: '/toys/treats.png', publicPath: `${process.env.PUBLIC_URL}/toys/treats.png` },
    { name: 'Cat Tree', path: '/toys/cat-tree.png', publicPath: `${process.env.PUBLIC_URL}/toys/cat-tree.png` },
    { name: 'Victorian Home', path: '/images/victorian-home.png', publicPath: `${process.env.PUBLIC_URL}/images/victorian-home.png` },
    { name: 'Stamp', path: '/images/stamp.png', publicPath: `${process.env.PUBLIC_URL}/images/stamp.png` }
  ];

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-700 text-white px-3 py-1 rounded-lg text-sm shadow-lg"
      >
        {isOpen ? 'Hide Image Debug' : 'Debug Images'}
      </button>

      {isOpen && (
        <div className="bg-white p-4 rounded-lg shadow-xl mt-2 max-w-md max-h-96 overflow-auto">
          <h3 className="font-bold mb-2">Image Paths Debug</h3>
          <p className="text-xs mb-4">
            PUBLIC_URL: {process.env.PUBLIC_URL || '(not set)'}
          </p>
          
          <div className="grid grid-cols-2 gap-2">
            {images.map((img) => (
              <div key={img.name} className="border border-gray-200 rounded p-2">
                <div className="text-xs font-bold mb-1">{img.name}</div>
                <img
                  src={img.publicPath}
                  alt={img.name}
                  className="h-16 w-16 object-contain mb-1 mx-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiNmODcxNzEiLz48cGF0aCBkPSJNOCAxMkw4IDRNNCAxMEwxMiAxMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+';
                    target.classList.add('bg-red-100');
                  }}
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.classList.add('bg-green-100');
                  }}
                />
                <div className="text-xs text-gray-500 truncate">{img.publicPath}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDebugger;