import React from "react";

export interface Toy {
  id: string;
  name: string;
  icon: string;
}

interface ToySelectProps {
  onToySelect: (toy: Toy) => void;
}

const TOYS: Toy[] = [
  { id: "laser", name: "Laser Pointer", icon: "🔴" },
  { id: "yarn", name: "Ball of Yarn", icon: "🧶" },
  { id: "mouse", name: "Squeaky Mouse", icon: "🐭" },
  { id: "tree", name: "Cat Tree", icon: "🌳" },
];

const ToySelect: React.FC<ToySelectProps> = ({ onToySelect }) => {
  return (
    <div className="flex gap-4 justify-center mb-4">
      {TOYS.map((toy) => (
        <button
          key={toy.id}
          onClick={() => onToySelect(toy)}
          className="flex flex-col items-center p-2 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <span className="text-2xl mb-1">{toy.icon}</span>
          <span className="text-sm text-gray-600">{toy.name}</span>
        </button>
      ))}
    </div>
  );
};

export default ToySelect;
