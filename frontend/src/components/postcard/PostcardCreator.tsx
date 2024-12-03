import React, { useState } from "react";
import Draggable from "react-draggable";
import ImageUploader from "./ImageUploader";
import ToySelect, { Toy } from "./ToySelect";

interface PlacedToy extends Toy {
  position: { x: number; y: number };
}

const PostcardCreator: React.FC = () => {
  const [catImage, setCatImage] = useState<string | null>(null);
  const [placedToys, setPlacedToys] = useState<PlacedToy[]>([]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setCatImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleToySelect = (toy: Toy) => {
    setPlacedToys([
      ...placedToys,
      { ...toy, position: { x: 0, y: 0 } }
    ]);
  };

  const handleToyDrag = (index: number, e: any, data: { x: number; y: number }) => {
    const newToys = [...placedToys];
    newToys[index] = { ...newToys[index], position: { x: data.x, y: data.y } };
    setPlacedToys(newToys);
  };

  return (
    <div className="min-h-screen bg-purple-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-800">
          Create Your Furever Memory
        </h1>
        
        <ToySelect onToySelect={handleToySelect} />

        <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-4 relative overflow-hidden">
          {catImage ? (
            <>
              <img
                src={catImage}
                alt="Uploaded cat"
                className="w-full h-full object-contain rounded-lg"
              />
              {placedToys.map((toy, index) => (
                <Draggable
                  key={`${toy.id}-${index}`}
                  position={toy.position}
                  onStop={(e, data) => handleToyDrag(index, e, data)}
                >
                  <div className="absolute cursor-move text-4xl">
                    {toy.icon}
                  </div>
                </Draggable>
              ))}
            </>
          ) : (
            <ImageUploader onImageUpload={handleImageUpload} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostcardCreator;
